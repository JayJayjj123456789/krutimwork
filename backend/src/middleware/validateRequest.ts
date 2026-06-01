import { Request, Response, NextFunction } from 'express';

export function validateRequest(fields: string[], source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter((f) => !req[source]?.[f]);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`,
      });
    }
    next();
  };
}
