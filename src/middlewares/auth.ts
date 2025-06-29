import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

// Store last activity time for each user
const userActivity = new Map<string, number>()
const INACTIVITY_LIMIT = 10 * 60 * 1000 // 10 phút

// Middleware to check user inactivity
export const checkInactivity = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    next()
    return
  }

  const userId = req.user._id.toString()
  const now = Date.now()
  const lastActivity = userActivity.get(userId) || now
  const inactiveTime = now - lastActivity

  // Nếu không hoạt động quá 10 phút thì xóa session và trả về 401
  if (inactiveTime > INACTIVITY_LIMIT) {
    userActivity.delete(userId)
    req.session.destroy(() => {
      res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn do không hoạt động' })
    })
    return
  }

  // Nếu có hoạt động thì reset lại thời gian
  userActivity.set(userId, now)
  next()
}

// Middleware xác thực JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization']
    console.log('Auth header:', authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    console.log('Token:', token)

    if (!token) {
      console.log('No token found in request')
      res.status(401).json({ message: 'Không tìm thấy token xác thực' })
      return
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      console.log('Decoded token:', decoded)

      // Try both id and userId from token
      const userId = decoded.userId || decoded.id
      console.log('Extracted userId:', userId)

      if (!userId) {
        console.log('No userId found in token')
        res.status(401).json({ message: 'Token không hợp lệ - không tìm thấy ID người dùng' })
        return
      }

      User.findById(userId)
        .then((user) => {
          console.log('Found user:', user)
          if (!user) {
            console.log('User not found in database')
            res.status(401).json({ message: 'Người dùng không tồn tại' })
            return
          }
          req.user = user
          console.log('User authenticated successfully')
          next()
        })
        .catch((error) => {
          console.log('Error finding user:', error)
          res.status(401).json({ message: 'Token không hợp lệ' })
        })
    } catch (jwtError) {
      console.log('JWT verification error:', jwtError)
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Token đã hết hạn' })
      } else {
        res.status(401).json({ message: 'Token không hợp lệ' })
      }
    }
  } catch (error) {
    console.log('General error in auth middleware:', error)
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

// Middleware kiểm tra quyền admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' })
  }
}

// Middleware kiểm tra quyền user
export const isUser = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'USER' || req.user.role === 'admin')) {
    next()
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' })
  }
}

// Middleware kiểm tra quyền sở hữu (chỉ cho phép user sở hữu hoặc admin)
export const isOwner = (req: Request, res: Response, next: NextFunction): void => {
  const resourceId = req.params.id

  if (!req.user) {
    res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' })
    return
  }

  if (req.user.role === 'admin' || req.user._id.toString() === resourceId) {
    next()
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' })
  }
}

// Middleware kiểm tra quyền manager
export const isManager = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
    next()
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' })
  }
}
