import { Router, Request, Response } from 'express'
import OpenAI from 'openai'
import { db } from '../config/firebase'
import admin from 'firebase-admin'
import { ChatRequest, ChatResponse, ChatRecord } from '../types/chat'
import { checkAuth } from '../middlewares/chatAuth'
import { validateMessage } from '../middlewares/chatValidation'
import { chatMessageLimiter, chatHistoryLimiter } from '../middlewares/chatRateLimit'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

// Check if OPENAI_API_KEY exists
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required')
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// GET /chat/history - Lấy lịch sử chat (chỉ lấy của chính mình)
router.get('/history', 
  checkAuth, // Kiểm tra userId từ query params
  chatHistoryLimiter, // Rate limit
  async (req: Request, res: Response) => {
  try {
    const { limit = '50', offset = '0' } = req.query
    const userId = (req as any).userId // Lấy userId từ middleware checkAuth

    // Parse pagination parameters
    const limitNum = parseInt(limit as string, 10)
    const offsetNum = parseInt(offset as string, 10)

    if (isNaN(limitNum) || isNaN(offsetNum) || limitNum < 1 || limitNum > 100 || offsetNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters. limit: 1-100, offset: >= 0'
      })
    }

    // Query Firestore - CHỈ lấy chat của userId hiện tại
    let query = db.collection('chats')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limitNum)

    // Apply offset if needed
    if (offsetNum > 0) {
      const offsetDoc = await db.collection('chats')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(offsetNum)
        .get()
      
      if (!offsetDoc.empty) {
        const lastDoc = offsetDoc.docs[offsetDoc.docs.length - 1]
        query = query.startAfter(lastDoc)
      }
    }

    const snapshot = await query.get()
    
    const chats: ChatRecord[] = []
    snapshot.forEach((doc) => {
      chats.push(doc.data() as ChatRecord)
    })

    // Get total count for pagination info - CHỈ đếm chat của userId hiện tại
    const totalSnapshot = await db.collection('chats')
      .where('userId', '==', userId)
      .get()

    res.json({
      success: true,
      data: {
        chats,
        pagination: {
          total: totalSnapshot.size,
          limit: limitNum,
          offset: offsetNum,
          hasMore: chats.length === limitNum && (offsetNum + limitNum) < totalSnapshot.size
        }
      }
    })

  } catch (error: any) {
    console.error('[🔥 Chat History Error]', error?.message || error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error?.message || 'Unknown error'
    })
  }
})

// POST /chat - Gửi tin nhắn (với validation và rate limit)
router.post('/', 
  checkAuth, // Kiểm tra userId từ body
  validateMessage, // Validate nội dung message
  chatMessageLimiter, // Rate limit
  async (req: Request, res: Response) => {
  try {
    const { message }: { message: string } = req.body
    const userId = (req as any).userId // Lấy userId từ middleware checkAuth

    // Validate input (đã được validateMessage kiểm tra, nhưng double-check)
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      })
    }

    // Call OpenAI Chat Completion API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Bạn là trợ lý bán hàng thời trang'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const reply = completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời ngay lúc này.'

    // Save to Firestore with Timestamp - CHỈ lưu với userId đã xác thực
    const chatRecord: ChatRecord = {
      userId,
      message: message.trim(), // Đảm bảo message đã được trim
      reply,
      createdAt: admin.firestore.Timestamp.now()
    }

    const docRef = await db.collection('chats').add(chatRecord)
    const chatId = docRef.id

    // Prepare response with chatId
    const response: ChatResponse = {
      reply,
      chatId
    }

    res.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router 
