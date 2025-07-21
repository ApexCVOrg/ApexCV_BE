import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Validation rules for POST /api/user/chats (create session)
export const validateCreateSession = [
  // No body validation needed for creating session
  validate,
];

// Validation rules for POST /api/user/chats/:chatId/messages
export const validateSendUserMessage = [
  param('chatId')
    .notEmpty()
    .withMessage('Chat ID is required')
    .isString()
    .withMessage('Chat ID must be a string'),
  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')
    .trim(),
  body('role').optional().isIn(['user', 'bot']).withMessage('Role must be either "user" or "bot"'),
  body('isBotMessage').optional().isBoolean().withMessage('isBotMessage must be a boolean'),
  validate,
];

// Validation rules for GET /api/user/chats/:chatId/messages
export const validateGetUserMessages = [
  param('chatId')
    .notEmpty()
    .withMessage('Chat ID is required')
    .isString()
    .withMessage('Chat ID must be a string'),
  validate,
];
