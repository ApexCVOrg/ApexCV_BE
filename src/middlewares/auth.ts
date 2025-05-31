import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Middleware xác thực JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
      res.status(401).json({ message: 'Không tìm thấy token xác thực' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    console.log('Decoded token:', decoded);
    
    User.findById(decoded.id)
      .then(user => {
        console.log('Found user:', user);
        if (!user) {
          res.status(401).json({ message: 'Người dùng không tồn tại' });
          return;
        }
        req.user = user;
        next();
      })
      .catch(error => {
        console.log('Error finding user:', error);
        res.status(401).json({ message: 'Token không hợp lệ' });
      });
  } catch (error) {
    console.log('JWT verify error:', error);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Middleware kiểm tra quyền admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' });
  }
};

// Middleware kiểm tra quyền user
export const isUser = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'USER' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' });
  }
};

// Middleware kiểm tra quyền sở hữu (chỉ cho phép user sở hữu hoặc admin)
export const isOwner = (req: Request, res: Response, next: NextFunction): void => {
  const resourceId = req.params.id;
  
  if (!req.user) {
    res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
    return;
  }

  if (req.user.role === 'ADMIN' || req.user._id.toString() === resourceId) {
    next();
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' });
  }
};

// Middleware kiểm tra quyền manager
export const isManager = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'MANAGER' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' });
  }
};

