import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    return res.status(400).json({
      error: 'validation_error',
      message: firstIssue ? firstIssue.message : 'Invalid request data',
    });
  }

  if (err?.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'file_too_large',
        message: 'File size exceeds maximum limit',
      });
    }
    return res.status(400).json({
      error: 'upload_error',
      message: 'Failed to process file upload',
    });
  }

  // Never log request body or sensitive details. Only log generic message.
  console.error('[Error]', err?.message || 'Internal server error');

  return res.status(500).json({
    error: 'internal_error',
    message: 'An unexpected error occurred. Please try again later.',
  });
}
