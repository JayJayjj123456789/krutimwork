import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[Error] ${status}: ${message}`);
  res.status(status).json({
    success: false,
    error: message,
  });
}
