import { Request, Response, NextFunction } from 'express';
import { analyzeHealth } from '../services/health/analysis.service';

export async function analyzeHealthHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const city = req.body?.city;
    if (!userId) {
      console.warn('[health.controller] no userId in request');
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    if (typeof city !== 'string' || !city.trim()) {
      console.warn(`[health.controller] invalid city body="${JSON.stringify(req.body)}"`);
      return res.status(400).json({ success: false, error: 'city required' });
    }
    console.log(`[health.controller] analyzeHealth userId=${userId} city="${city}"`);
    const result = await analyzeHealth(userId, city);
    console.log(`[health.controller] analyzeHealth success userId=${userId} healthScore=${result.health_score}`);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(`[health.controller] analyzeHealth error:`, (err as Error).message);
    next(err);
  }
}
