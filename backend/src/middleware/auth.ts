import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'];
  
  if (!userId || isNaN(Number(userId))) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Provide x-user-id header.',
    });
  }

  req.userId = Number(userId);
  next();
}

export function requireOwnership(req: Request, res: Response, next: NextFunction) {
  const targetUserId = req.params.userId || req.query.userId;
  
  if (targetUserId && req.userId !== Number(targetUserId)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. You can only access your own health data.',
    });
  }

  next();
}
