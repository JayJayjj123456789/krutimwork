import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../config/firebase';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function requireJwtAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required. Provide Bearer token.' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.userId = decoded.uid;
    console.log(`[jwt-auth] authenticated userId=${decoded.uid}`);
    next();
  } catch (err) {
    console.warn('[jwt-auth] invalid token:', (err as Error).message);
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}
