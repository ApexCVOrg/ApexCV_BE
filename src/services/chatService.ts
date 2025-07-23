import { ChatSessionModel, IChatSession } from '../models/ChatSession';
import { ChatMessageModel, IChatMessage } from '../models/ChatMessage';
import { logManagerAction } from '../utils/logManagerAction';
import { Request } from 'express';

export interface ChatSessionWithLastMessage extends Omit<IChatSession, 'lastMessage'> {
  lastMessage?: {
    content: string;
    role: 'user' | 'manager' | 'bot';
    createdAt: Date;
  };
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ChatFilter {
  status?: 'open' | 'closed';
  userId?: string;
}

class ChatService {
  /**
   * Lấy danh sách chat sessions với phân trang và filter, sắp xếp theo tin nhắn mới nhất
   */
  async getSessions(
    page: number = 1, 
    limit: number = 10, 
    filter?: ChatFilter
  ): Promise<PaginationResult<ChatSessionWithLastMessage>> {
    try {
      const skip = (page - 1) * limit;
      
      // Build query filter
      const queryFilter: any = {};
      if (filter?.status) {
        queryFilter.status = filter.status;
      }
      if (filter?.userId) {
        queryFilter.userId = filter.userId;
      }

      // Get sessions with pagination, sorted by lastMessageAt (newest first)
      const [sessions, total] = await Promise.all([
        ChatSessionModel.find(queryFilter)
          .sort({ lastMessageAt: -1, updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        ChatSessionModel.countDocuments(queryFilter)
      ]);

      // Get last message for each session
      const sessionsWithLastMessage: ChatSessionWithLastMessage[] = await Promise.all(
        sessions.map(async (session) => {
          const lastMessage = await ChatMessageModel.findOne(
            { chatId: session.chatId },
            { content: 1, role: 1, createdAt: 1 }
          )
            .sort({ createdAt: -1 })
            .lean();

          return {
            ...session,
            lastMessage: lastMessage ? {
              content: lastMessage.content,
              role: lastMessage.role,
              createdAt: lastMessage.createdAt
            } : undefined
          };
        })
      );

      return {
        data: sessionsWithLastMessage,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get chat sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lấy toàn bộ messages của một chat session
   */
  async getMessages(chatId: string): Promise<IChatMessage[]> {
    try {
      // Verify session exists
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }

      const messages = await ChatMessageModel.find({ chatId })
        .sort({ createdAt: 1 })
        .lean();

      return messages;
    } catch (error) {
      throw new Error(`Failed to get messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gửi tin nhắn từ manager
   */
  async sendManagerMessage(
    chatId: string, 
    managerId: string, 
    content: string, 
    attachments?: any[],
    messageType?: 'text' | 'file' | 'image' | 'product',
    product?: any,
    req?: Request
  ): Promise<IChatMessage> {
    try {
      // Verify session exists and is open
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }
      if (session.status === 'closed') {
        throw new Error('Cannot send message to closed session');
      }

      // Determine message type if not provided
      const finalMessageType = messageType || (attachments && attachments.length > 0 ? 
        (attachments.some(att => att.mimetype.startsWith('image/')) ? 'image' : 'file') : 'text');

      // Create new message
      const message = new ChatMessageModel({
        chatId,
        role: 'manager',
        content,
        isRead: false,
        attachments,
        messageType: finalMessageType,
        product: product
      });

      await message.save();

      // Update session with last message info and increment unread count
      const lastMessageText = attachments && attachments.length > 0 ? 
        `📎 ${attachments.length} file(s)` : 
        (content.length > 100 ? content.substring(0, 100) + '...' : content);

      await ChatSessionModel.updateOne(
        { chatId },
        { 
          updatedAt: new Date(),
          lastMessage: lastMessageText,
          lastMessageAt: new Date(),
          $inc: { unreadCount: 1 }
        }
      );

      // Log manager action if request is provided
      if (req) {
        await logManagerAction(req, {
          action: 'SEND_MESSAGE',
          target: `Chat: ${chatId}`,
          detail: `Sent ${finalMessageType} message: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`,
          managerId
        });
      }

      return message;
    } catch (error) {
      throw new Error(`Failed to send manager message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gửi tin nhắn từ user
   */
  async sendUserMessage(chatId: string, content: string, role: 'user' | 'bot' = 'user', isBotMessage: boolean = false, attachments?: any[]): Promise<IChatMessage> {
    try {
      // Verify session exists and is open
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }
      if (session.status === 'closed') {
        throw new Error('Cannot send message to closed session');
      }

      // Determine message type
      const messageType = attachments && attachments.length > 0 ? 
        (attachments.some(att => att.mimetype.startsWith('image/')) ? 'image' : 'file') : 'text';

      // Create new message
      const message = new ChatMessageModel({
        chatId,
        role,
        content,
        isBotMessage,
        isRead: false,
        attachments,
        messageType
      });

      await message.save();

      // Update session with last message info and increment unread count
      const lastMessageText = attachments && attachments.length > 0 ? 
        `📎 ${attachments.length} file(s)` : 
        (content.length > 100 ? content.substring(0, 100) + '...' : content);

      await ChatSessionModel.updateOne(
        { chatId },
        { 
          updatedAt: new Date(),
          lastMessage: lastMessageText,
          lastMessageAt: new Date(),
          $inc: { unreadCount: 1 }
        }
      );

      return message;
    } catch (error) {
      throw new Error(`Failed to send user message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Đánh dấu tin nhắn đã đọc
   */
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    try {
      // Verify session exists
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }

      // Mark all unread messages as read
      await ChatMessageModel.updateMany(
        { chatId, isRead: false },
        { isRead: true }
      );

      // Reset unread count
      await ChatSessionModel.updateOne(
        { chatId },
        { unreadCount: 0 }
      );
    } catch (error) {
      throw new Error(`Failed to mark messages as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lấy số tin nhắn chưa đọc cho user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const result = await ChatSessionModel.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalUnread: { $sum: '$unreadCount' } } }
      ]);

      return result.length > 0 ? result[0].totalUnread : 0;
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lấy số tin nhắn chưa đọc cho manager
   */
  async getManagerUnreadCount(): Promise<number> {
    try {
      const result = await ChatSessionModel.aggregate([
        { $match: { status: { $in: ['open', 'manager_joined'] } } },
        { $group: { _id: null, totalUnread: { $sum: '$unreadCount' } } }
      ]);

      return result.length > 0 ? result[0].totalUnread : 0;
    } catch (error) {
      throw new Error(`Failed to get manager unread count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Đóng chat session
   */
  async closeSession(chatId: string, managerId: string, note?: string, req?: Request): Promise<void> {
    try {
      // Verify session exists
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }

      // Optionally add a closing note as a manager message BEFORE closing
      if (note) {
        await this.sendManagerMessage(chatId, managerId, `[CLOSED] ${note}`);
      }

      // Update session status AFTER sending the note
      await ChatSessionModel.updateOne(
        { chatId },
        { 
          status: 'closed',
          updatedAt: new Date()
        }
      );

      // Log manager action if request is provided
      if (req) {
        await logManagerAction(req, {
          action: 'CLOSE_CHAT',
          target: `Chat: ${chatId}`,
          detail: `Closed chat session${note ? ` with note: ${note}` : ''}`,
          managerId
        });
      }
    } catch (error) {
      throw new Error(`Failed to close session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lấy chat session theo ID
   */
  async getSessionById(chatId: string): Promise<IChatSession | null> {
    try {
      const session = await ChatSessionModel.findOne({ chatId }).lean();
      return session;
    } catch (error) {
      throw new Error(`Failed to get session by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Tạo chat session mới (cho user)
   */
  async createSession(userId: string): Promise<IChatSession> {
    try {
      const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const session = new ChatSessionModel({
        chatId,
        userId,
        status: 'open',
        unreadCount: 0
      });

      await session.save();
      return session;
    } catch (error) {
      throw new Error(`Failed to create chat session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Manager tham gia chat session
   */
  async joinSession(chatId: string, managerId: string, req?: Request): Promise<IChatSession> {
    try {
      // Verify session exists
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }

      // Update session with manager
      const updatedSession = await ChatSessionModel.findOneAndUpdate(
        { chatId },
        { 
          managerId,
          status: 'manager_joined',
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!updatedSession) {
        throw new Error('Failed to join session');
      }

      // Log manager action if request is provided
      if (req) {
        await logManagerAction(req, {
          action: 'JOIN_CHAT',
          target: `Chat: ${chatId}`,
          detail: 'Joined chat session to provide support',
          managerId
        });
      }

      return updatedSession;
    } catch (error) {
      throw new Error(`Failed to join session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Kiểm tra xem manager đã tham gia chat chưa
   */
  async isManagerJoined(chatId: string): Promise<boolean> {
    try {
      const session = await ChatSessionModel.findOne({ chatId });
      return session?.status === 'manager_joined';
    } catch (error) {
      throw new Error(`Failed to check manager join status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lấy manager ID của session
   */
  async getSessionManager(chatId: string): Promise<string | null> {
    try {
      const session = await ChatSessionModel.findOne({ chatId });
      return session?.managerId || null;
    } catch (error) {
      throw new Error(`Failed to get session manager: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const chatService = new ChatService(); 