import { Request, Response } from 'express'
import { ZodError } from 'zod'

export function errorHandler(err: unknown, _req: Request, res: Response) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      details: err.errors.map((e) => ({ path: e.path, message: e.message }))
    })
  }

  const error = err as { status?: number; name?: string; message?: string }
  const status = error.status || 500
  res.status(status).json({
    error: error.name || 'InternalServerError',
    message: error.message || 'An unexpected error occurred.'
  })
}
