import { Router, Request, Response } from 'express';
import { chatService } from '../services/chatService';
import { checkUserAuth } from '../middlewares/checkUserAuth';
import { 
  validateCreateSession,
  validateSendUserMessage, 
  validateGetUserMessages 
} from '../validations/userChatValidation';

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
        message: 'User ID not found'
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
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    console.error('Create chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/user/chats/:chatId/messages
 * Send a message from user to a chat session
 */
router.post('/:chatId/messages', validateSendUserMessage, async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found'
      });
    }

    // Verify user owns this chat session
    const session = await chatService.getSessionById(chatId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    if (session.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only send messages to your own chat sessions'
      });
    }

    const message = await chatService.sendUserMessage(chatId, content);

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: message._id,
        content: message.content,
        role: message.role,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error('Send user message error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Chat session not found'
        });
      }
      if (error.message.includes('closed')) {
        return res.status(400).json({
          success: false,
          message: 'Cannot send message to closed session'
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/user/chats/:chatId/messages
 * Get all messages for a specific chat session (user can only see their own chats)
 */
router.get('/:chatId/messages', validateGetUserMessages, async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found'
      });
    }

    // Verify user owns this chat session
    const session = await chatService.getSessionById(chatId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    if (session.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own chat sessions'
      });
    }

    const messages = await chatService.getMessages(chatId);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get user messages error:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
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
        message: 'User ID not found'
      });
    }

    const filter = { userId };
    const result = await chatService.getSessions(page, limit, filter);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 