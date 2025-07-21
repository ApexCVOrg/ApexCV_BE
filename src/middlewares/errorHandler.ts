import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      details: err.errors.map((e) => ({ path: e.path, message: e.message })),
    });
  }
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred.',
  });
}
