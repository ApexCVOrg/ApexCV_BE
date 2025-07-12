import { ChatSessionModel, IChatSession } from '../models/ChatSession';
import { ChatMessageModel, IChatMessage } from '../models/ChatMessage';

export interface ChatSessionWithLastMessage extends IChatSession {
  lastMessage?: {
    content: string;
    role: 'user' | 'manager';
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
   * Lấy danh sách chat sessions với phân trang và filter
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

      // Get sessions with pagination
      const [sessions, total] = await Promise.all([
        ChatSessionModel.find(queryFilter)
          .sort({ updatedAt: -1 })
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
  async sendManagerMessage(chatId: string, managerId: string, content: string): Promise<IChatMessage> {
    try {
      // Verify session exists and is open
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }
      if (session.status === 'closed') {
        throw new Error('Cannot send message to closed session');
      }

      // Create new message
      const message = new ChatMessageModel({
        chatId,
        role: 'manager',
        content
      });

      await message.save();

      // Update session updatedAt
      await ChatSessionModel.updateOne(
        { chatId },
        { updatedAt: new Date() }
      );

      return message;
    } catch (error) {
      throw new Error(`Failed to send manager message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Đóng chat session
   */
  async closeSession(chatId: string, managerId: string, note?: string): Promise<void> {
    try {
      // Verify session exists
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }

      // Update session status
      await ChatSessionModel.updateOne(
        { chatId },
        { 
          status: 'closed',
          updatedAt: new Date()
        }
      );

      // Optionally add a closing note as a manager message
      if (note) {
        await this.sendManagerMessage(chatId, managerId, `[CLOSED] ${note}`);
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
        status: 'open'
      });

      await session.save();
      return session;
    } catch (error) {
      throw new Error(`Failed to create chat session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gửi tin nhắn từ user
   */
  async sendUserMessage(chatId: string, content: string): Promise<IChatMessage> {
    try {
      // Verify session exists and is open
      const session = await ChatSessionModel.findOne({ chatId });
      if (!session) {
        throw new Error('Chat session not found');
      }
      if (session.status === 'closed') {
        throw new Error('Cannot send message to closed session');
      }

      // Create new message
      const message = new ChatMessageModel({
        chatId,
        role: 'user',
        content
      });

      await message.save();

      // Update session updatedAt
      await ChatSessionModel.updateOne(
        { chatId },
        { updatedAt: new Date() }
      );

      return message;
    } catch (error) {
      throw new Error(`Failed to send user message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const chatService = new ChatService(); 