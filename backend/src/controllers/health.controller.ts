import { Request, Response, NextFunction } from 'express';
import { analyzeHealth } from '../services/health/analysis.service';

export async function analyzeHealthHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const city = req.body?.city;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    if (typeof city !== 'string' || !city.trim()) {
      return res.status(400).json({ success: false, error: 'city required' });
    }
    const result = await analyzeHealth(String(userId), city);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
