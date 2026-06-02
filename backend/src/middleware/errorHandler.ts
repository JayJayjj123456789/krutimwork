import { Request, Response, NextFunction } from 'express';

const SAFE_MESSAGE = 'Internal Server Error';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  void _next;
  const status = typeof err?.status === 'number' ? err.status : 500;
  const isClientSafe = status >= 400 && status < 500;
  const rawMessage = typeof err?.message === 'string' ? err.message : SAFE_MESSAGE;
  const message = isClientSafe ? rawMessage : SAFE_MESSAGE;
  console.error(`[Error] ${status}: ${rawMessage}`);
  if (err?.stack) console.error(err.stack);
  res.status(status).json({
    success: false,
    error: message,
  });
}
