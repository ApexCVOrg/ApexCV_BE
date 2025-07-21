import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    id: string;
    email: string;
    role: string;
  };
}

export const checkUserAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
      return;
    }

    // Check if user has valid role (user, manager, admin)
    if (!['user', 'manager', 'admin'].includes(decoded.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Invalid user role',
      });
      return;
    }

    // Add user info to request - bao gồm cả _id và id
    req.user = {
      _id: decoded.id || decoded._id, // MongoDB ObjectId
      id: decoded.id || decoded._id, // String ID
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    } else {
      console.error('Auth middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};
