import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('API Error:', err);

  // Catch Zod input validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Catch PostgreSQL error codes for database failures
  if (err.code && typeof err.code === 'string') {
    return res.status(400).json({
      error: 'Database operation failed',
      code: err.code,
      message: err.message,
    });
  }

  // Default Express internal server error fallback
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    error: message,
  });
}
