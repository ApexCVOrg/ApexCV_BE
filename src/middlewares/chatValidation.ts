import { Request, Response, NextFunction } from 'express'

// Danh sách từ cấm (có thể mở rộng)
const BANNED_WORDS = [
    // 🛑 Tiếng Việt – tục tĩu, xúc phạm
    'đm', 'đụ', 'địt', 'đéo', 'đcm', 'đcl',
    'vcl', 'vkl', 'vl', 'cc', 'cmm', 'clm',
    'ngu', 'ngu ngốc', 'đần', 'đần độn', 'óc chó', 'não chó',
    'súc vật', 'chó chết', 'mẹ mày', 'bố mày', 'đồ con lợn',
    'con đĩ', 'con chó', 'cút mẹ', 'dm', 'cmm', 'mẹ kiếp',
    'mịa', 'vl thật', 'dốt nát', 'vô học',
  
    // 🛑 Tiếng Việt – spam / quảng cáo rác
    'quảng cáo', 'mua ngay', 'giảm giá', 'sale off', 'khuyến mãi',
    'click vào đây', 'truy cập link', 'tặng quà', 'nạp thẻ', 'hack like',
    'like fanpage', 'xem hàng tại đây', 'bit.ly', 'zalo.me', 'telegram', 'vay tiền',
  
    // 🛑 Tiếng Anh – tục tĩu, xúc phạm
    'fuck', 'shit', 'bitch', 'asshole', 'dick', 'bastard',
    'idiot', 'moron', 'retard', 'stupid', 'suck my', 'jerk',
    'whore', 'slut', 'piss', 'cock', 'motherfucker', 'cum',
  
    // 🛑 Tiếng Anh – spam, scam, nguy hiểm
    'spam', 'advertisement', 'promotion', 'cheap', 'free money',
    'click here', 'buy now', 'order now', 'limited time', 'special offer',
    'bit.ly', 'shorturl.at', 'tinyurl.com',
    'phishing', 'malware', 'virus', 'trojan', 'hacked', 'download now',
    'get rich', 'work from home', 'make money fast'
  ]
  

// Regex để detect HTML tags và script
const HTML_TAG_REGEX = /<[^>]*>/g
const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
const XSS_REGEX = /javascript:|vbscript:|onload=|onerror=|onclick=/gi

interface ValidationRequest extends Request {
  userId?: string
}

export const validateMessage = (req: ValidationRequest, res: Response, next: NextFunction): void => {
  try {
    const { message } = req.body

    // Kiểm tra message có tồn tại không
    if (!message) {
      res.status(400).json({
        success: false,
        message: 'Message is required'
      })
      return
    }

    // Kiểm tra kiểu dữ liệu
    if (typeof message !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Message must be a string'
      })
      return
    }

    const trimmedMessage = message.trim()

    // Kiểm tra độ dài
    if (trimmedMessage.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      })
      return
    }

    if (trimmedMessage.length > 500) {
      res.status(400).json({
        success: false,
        message: 'Message too long. Maximum 500 characters allowed.'
      })
      return
    }

    // Kiểm tra HTML tags và script
    if (HTML_TAG_REGEX.test(trimmedMessage)) {
      res.status(400).json({
        success: false,
        message: 'HTML tags are not allowed'
      })
      return
    }

    if (SCRIPT_REGEX.test(trimmedMessage)) {
      res.status(400).json({
        success: false,
        message: 'Script tags are not allowed'
      })
      return
    }

    if (XSS_REGEX.test(trimmedMessage)) {
      res.status(400).json({
        success: false,
        message: 'Potentially harmful content detected'
      })
      return
    }

    // Kiểm tra từ cấm
    const lowerMessage = trimmedMessage.toLowerCase()
    const foundBannedWords = BANNED_WORDS.filter(word => 
      lowerMessage.includes(word.toLowerCase())
    )

    if (foundBannedWords.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Message contains inappropriate content',
        bannedWords: foundBannedWords
      })
      return
    }

    // Kiểm tra spam patterns (lặp lại ký tự quá nhiều)
    const repeatedChars = /(.)\1{4,}/g
    if (repeatedChars.test(trimmedMessage)) {
      res.status(400).json({
        success: false,
        message: 'Message contains too many repeated characters'
      })
      return
    }

    // Kiểm tra URL spam
    const urlCount = (trimmedMessage.match(/https?:\/\/[^\s]+/g) || []).length
    if (urlCount > 2) {
      res.status(400).json({
        success: false,
        message: 'Too many URLs in message'
      })
      return
    }

    next()
  } catch (error) {
    console.error('Message Validation Error:', error)
    res.status(500).json({
      success: false,
      message: 'Validation error'
    })
  }
} 