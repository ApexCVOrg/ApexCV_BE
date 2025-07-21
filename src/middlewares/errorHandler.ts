import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // Nếu response đã được gửi, chuyển tiếp lỗi cho middleware tiếp theo
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      details: err.errors.map((e) => ({ path: e.path, message: e.message }))
    });
  }

  const error = err as { status?: number; name?: string; message?: string };
  const status = error.status || 500;
  res.status(status).json({
    error: error.name || 'InternalServerError',
    message: error.message || 'An unexpected error occurred.'
  });
}
