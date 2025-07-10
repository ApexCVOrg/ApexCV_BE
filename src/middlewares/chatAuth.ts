import { Request, Response, NextFunction } from 'express'

interface AuthenticatedRequest extends Request {
  userId?: string
}

export const checkAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    // Lấy userId từ body hoặc session
    const userId = req.body?.userId || (req.session as any)?.userId

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User ID is required. Please provide userId in request body or valid session.'
      })
      return
    }

    // Validate userId format (basic check)
    if (typeof userId !== 'string' || userId.trim().length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid user ID format'
      })
      return
    }

    // Gắn userId vào request object
    req.userId = userId.trim()
    next()
  } catch (error) {
    console.error('Chat Auth Error:', error)
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    })
  }
} 