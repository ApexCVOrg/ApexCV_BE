import { Router, Request, Response } from 'express';
import { chatService } from '../services/chatService';
import { checkUserAuth } from '../middlewares/checkUserAuth';
import {
  validateCreateSession,
  validateSendUserMessage,
  validateGetUserMessages,
} from '../validations/userChatValidation';
import { checkManagerAuth } from '../middlewares/checkManagerAuth';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// Apply user auth middleware to all routes
router.use(checkUserAuth);

/**
 * POST /api/user/chats
 * Create a new chat session for user
 */
router.post('/', validateCreateSession, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found',
      });
    }

    const session = await chatService.createSession(userId);

    res.json({
      success: true,
      message: 'Chat session created successfully',
      data: {
        chatId: session.chatId,
        userId: session.userId,
        status: session.status,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error('Create chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/user/chats/:chatId/messages
 * Send a message from user to a chat session
 */
router.post(
  '/:chatId/messages',
  validateSendUserMessage,
  async (req: AuthRequest, res: Response) => {
    try {
      const { chatId } = req.params;
      const { content, role, isBotMessage, attachments } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found',
        });
      }

      // Verify user owns this chat session
      const session = await chatService.getSessionById(chatId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Chat session not found',
        });
      }

      if (session.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only send messages to your own chat sessions',
        });
      }

      // Determine message role and bot flag
      const messageRole = role || 'user';
      const botFlag = isBotMessage || false;

      const message = await chatService.sendUserMessage(
        chatId,
        content,
        messageRole,
        botFlag,
        attachments,
      );

      res.json({
        success: true,
        message: 'Message sent successfully',
        data: {
          messageId: message._id,
          content: message.content,
          role: message.role,
          isBotMessage: message.isBotMessage,
          attachments: message.attachments,
          messageType: message.messageType,
          createdAt: message.createdAt,
        },
      });
    } catch (error) {
      console.error('Send user message error:', error);

      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            message: 'Chat session not found',
          });
        }
        if (error.message.includes('closed')) {
          return res.status(400).json({
            success: false,
            message: 'Cannot send message to closed session',
          });
        }
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

/**
 * GET /api/user/chats/:chatId/messages
 * Get all messages for a specific chat session (user can only see their own chats)
 */
router.get(
  '/:chatId/messages',
  validateGetUserMessages,
  async (req: AuthRequest, res: Response) => {
    try {
      const { chatId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found',
        });
      }

      // Verify user owns this chat session
      const session = await chatService.getSessionById(chatId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Chat session not found',
        });
      }

      if (session.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own chat sessions',
        });
      }

      const messages = await chatService.getMessages(chatId);

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error('Get user messages error:', error);

      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Chat session not found',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

/**
 * POST /api/user/chats/:chatId/read
 * Mark messages as read for a chat session
 */
router.post('/:chatId/read', async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found',
      });
    }

    // Verify user owns this chat session
    const session = await chatService.getSessionById(chatId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found',
      });
    }

    if (session.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only mark your own chat messages as read',
      });
    }

    await chatService.markMessagesAsRead(chatId, userId);

    res.json({
      success: true,
      message: 'Messages marked as read successfully',
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/user/chats/unread-count
 * Get unread message count for user
 */
router.get('/unread-count', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found',
      });
    }

    const unreadCount = await chatService.getUnreadCount(userId);

    res.json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/user/chats
 * Get user's own chat sessions
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found',
      });
    }

    const filter = { userId };
    const result = await chatService.getSessions(page, limit, filter);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Route để manager tham gia chat
router.post('/:chatId/join', checkManagerAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const managerId = req.user?.id;

    if (!managerId) {
      return res.status(401).json({
        success: false,
        message: 'Manager ID not found',
      });
    }

    const updatedSession = await chatService.joinSession(chatId, managerId);

    res.status(200).json({
      success: true,
      message: 'Manager joined chat successfully',
      data: updatedSession,
    });
  } catch (error) {
    console.error('Join chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Route để kiểm tra manager đã tham gia chat chưa
router.get('/:chatId/join-status', async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found',
      });
    }

    // Verify user owns this chat session
    const session = await chatService.getSessionById(chatId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found',
      });
    }

    if (session.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only check your own chat sessions',
      });
    }

    const isJoined = await chatService.isManagerJoined(chatId);
    const managerId = await chatService.getSessionManager(chatId);

    res.json({
      success: true,
      data: {
        isJoined,
        managerId,
      },
    });
  } catch (error) {
    console.error('Check join status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
