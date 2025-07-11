import { Router, Request, Response } from 'express'
import OpenAI from 'openai'
import { db } from '../config/firebase'
import admin from 'firebase-admin'
import { ChatRequest, ChatResponse, ChatRecord } from '../types/chat'
import { checkAuth } from '../middlewares/chatAuth'
import { validateMessage } from '../middlewares/chatValidation'
import { chatMessageLimiter, chatHistoryLimiter } from '../middlewares/chatRateLimit'
import dotenv from 'dotenv'
import { DocumentModel } from '../models/Document'

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

// POST /chat - Tìm kiếm tài liệu
router.post('/', 
  checkAuth, // Kiểm tra userId từ body
  validateMessage, // Validate nội dung message
  chatMessageLimiter, // Rate limit
  async (req: Request, res: Response) => {
    try {
      const { message }: { message: string } = req.body
      const tags = req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : []
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
      const skip = (page - 1) * limit

      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message is required' })
      }

      // 1. Ưu tiên tìm kiếm theo tags nếu có
      let query: any = { $text: { $search: message } }
      if (tags.length > 0) {
        query.tags = { $in: tags }
      }

      // 2. Tìm kiếm full-text trước
      let docs = await DocumentModel.find(query, { score: { $meta: 'textScore' }, title: 1, content: 1 })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .lean()

      let total = await DocumentModel.countDocuments(query)

      // 3. Nếu không có kết quả, fallback sang fuzzy search bằng regex
      if (docs.length === 0) {
        const regex = new RegExp(message, 'i')
        let regexQuery: any = {
          $or: [
            { title: regex },
            { content: regex }
          ]
        }
        if (tags.length > 0) {
          regexQuery.tags = { $in: tags }
        }
        docs = await DocumentModel.find(regexQuery, { title: 1, content: 1 })
          .skip(skip)
          .limit(limit)
          .lean()
        total = await DocumentModel.countDocuments(regexQuery)
      }

      // 4. Chuẩn hóa kết quả trả về
      const resultDocs = docs.map((d: any) => ({
        id: d._id,
        title: d.title,
        snippet: d.content.slice(0, 200),
        ...(d.score && { score: d.score })
      }))

      const hasMore = (page * limit) < total

      res.json({
        success: true,
        data: {
          docs: resultDocs,
          hasMore
        }
      })
    } catch (error) {
      console.error('Chat API Error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
)

export default router 
