import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'

interface RateLimitRequest extends Request {
  userId?: string
}

// Rate limiter cho chat messages - 10 tin nhắn mỗi phút mỗi userId
export const chatMessageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 10, // Tối đa 10 tin nhắn mỗi phút
  message: {
    success: false,
    message: 'Too many messages. Please wait before sending another message.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key function để rate limit theo userId
  keyGenerator: (req: RateLimitRequest) => {
    return req.userId || req.ip || 'unknown' // Đảm bảo luôn trả về string
  },
  // Custom handler để trả về thông tin chi tiết hơn
  handler: (req: RateLimitRequest, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Maximum 10 messages per minute.',
      retryAfter: Math.ceil(60 / 1000) // Thời gian chờ tính bằng giây
    })
  }
})

// Rate limiter cho chat history - 30 requests mỗi phút mỗi userId
export const chatHistoryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 30, // Tối đa 30 requests mỗi phút
  message: {
    success: false,
    message: 'Too many history requests. Please wait before requesting again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key function để rate limit theo userId
  keyGenerator: (req: RateLimitRequest) => {
    return req.userId || req.ip || 'unknown' // Đảm bảo luôn trả về string
  },
  // Custom handler để trả về thông tin chi tiết hơn
  handler: (req: RateLimitRequest, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Maximum 30 history requests per minute.',
      retryAfter: Math.ceil(60 / 1000) // Thời gian chờ tính bằng giây
    })
  }
}) 