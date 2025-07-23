import { body, param, query, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

// Validation rules for GET /api/manager/chats
export const validateGetChats = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['open', 'closed']).withMessage('Status must be either "open" or "closed"'),
  validate
]

// Validation rules for GET /api/manager/chats/:chatId/messages
export const validateGetMessages = [
  param('chatId').notEmpty().withMessage('Chat ID is required').isString().withMessage('Chat ID must be a string'),
  validate
]

// Validation rules for POST /api/manager/chats/:chatId/messages
export const validateSendMessage = [
  param('chatId').notEmpty().withMessage('Chat ID is required').isString().withMessage('Chat ID must be a string'),
  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')
    .trim(),
  validate
]

// Validation rules for PATCH /api/manager/chats/:chatId/close
export const validateCloseSession = [
  param('chatId').notEmpty().withMessage('Chat ID is required').isString().withMessage('Chat ID must be a string'),
  body('note')
    .optional()
    .isString()
    .withMessage('Note must be a string')
    .isLength({ max: 500 })
    .withMessage('Note must not exceed 500 characters'),
  validate
]
