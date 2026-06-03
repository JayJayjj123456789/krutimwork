import { Request, Response, NextFunction } from 'express';

const SAFE_MESSAGE = 'Internal Server Error';
const SAFE_CLIENT_MESSAGE = 'Request could not be processed';

// Patterns that might leak internal details
const SENSITIVE_PATTERNS = [
  /https?:\/\/[^\s]+/g,           // URLs
  /Bearer\s+[^\s]+/gi,            // Auth tokens
  /api[_-]?key[^\s]*/gi,          // API keys
  /open-meteo|typhoon|firebase/gi, // Internal service names
  /ECONNREFUSED|ENOTFOUND/gi,     // Network errors
];

function sanitizeMessage(message: string): string {
  let sanitized = message;
  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  return sanitized;
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  void _next;
  let status = 500;
  let rawMessage = SAFE_MESSAGE;
  let stack: unknown;

  if (err !== null && typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (typeof obj.status === 'number') status = obj.status;
    if (typeof obj.message === 'string') rawMessage = obj.message;
    stack = obj.stack;
  }

  // Sanitize all messages before sending to client
  const sanitizedMessage = sanitizeMessage(rawMessage);
  const message = status >= 400 && status < 500 ? sanitizedMessage : SAFE_MESSAGE;

  console.error(`[ERROR-HANDLER] ${status} - ${rawMessage}`);
  console.error(`[ERROR-HANDLER] request: ${req.method} ${req.originalUrl}`);
  if (typeof stack === 'string') console.error(stack);
  res.status(status).json({
    success: false,
    error: message,
  });
}
