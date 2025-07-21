import { Router, Request, Response } from 'express'
import { chatService } from '../services/chatService'
import { checkManagerAuth } from '../middlewares/checkManagerAuth'
import {
  validateGetChats,
  validateGetMessages,
  validateSendMessage,
  validateCloseSession
} from '../validations/chatValidation'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

const router = Router()

// Apply manager auth middleware to all routes
router.use(checkManagerAuth)

/**
 * GET /api/manager/chats
 * Get list of chat sessions with pagination and filtering
 */
router.get('/', validateGetChats, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as 'open' | 'closed' | undefined

    const filter: { status?: 'open' | 'closed' } = {}
    if (status) {
      filter.status = status
    }

    const result = await chatService.getSessions(page, limit, filter)

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('Get chats error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /api/manager/chats/:chatId/join-status
 * Check if manager has joined a specific chat
 */
router.get('/:chatId/join-status', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params
    const isJoined = await chatService.isManagerJoined(chatId)

    res.json({
      success: true,
      data: {
        isJoined,
        chatId
      }
    })
  } catch (error) {
    console.error('Check join status error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /api/manager/chats/:chatId/messages
 * Get all messages for a specific chat session
 */
router.get('/:chatId/messages', validateGetMessages, async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params

    const messages = await chatService.getMessages(chatId)

    res.json({
      success: true,
      data: messages
    })
  } catch (error) {
    console.error('Get messages error:', error)

    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/manager/chats/:chatId/messages
 * Send a message from manager to a chat session
 */
router.post('/:chatId/messages', validateSendMessage, async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params
    const { content, attachments } = req.body
    const managerId = req.user?.id

    if (!managerId) {
      return res.status(401).json({
        success: false,
        message: 'Manager ID not found'
      })
    }

    const message = await chatService.sendManagerMessage(chatId, managerId, content, attachments)

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: message._id,
        content: message.content,
        role: message.role,
        attachments: message.attachments,
        messageType: message.messageType,
        createdAt: message.createdAt
      }
    })
  } catch (error) {
    console.error('Send message error:', error)

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Chat session not found'
        })
      }
      if (error.message.includes('closed')) {
        return res.status(400).json({
          success: false,
          message: 'Cannot send message to closed session'
        })
      }
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * PATCH /api/manager/chats/:chatId/close
 * Close a chat session
 */
router.patch('/:chatId/close', validateCloseSession, async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params
    const { note } = req.body
    const managerId = req.user?.id

    if (!managerId) {
      return res.status(401).json({
        success: false,
        message: 'Manager ID not found'
      })
    }

    await chatService.closeSession(chatId, managerId, note)

    res.json({
      success: true,
      message: 'Chat session closed successfully'
    })
  } catch (error) {
    console.error('Close session error:', error)

    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
