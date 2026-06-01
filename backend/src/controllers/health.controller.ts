import { Request, Response, NextFunction } from 'express';
import { analyzeHealth } from '../services/health/analysis.service';

export async function analyzeHealthHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, city } = req.body;
    if (!userId || !city) {
      return res.status(400).json({ success: false, error: 'userId and city required' });
    }
    const result = await analyzeHealth(userId, city);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
