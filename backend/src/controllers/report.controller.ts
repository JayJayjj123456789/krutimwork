import { Request, Response, NextFunction } from 'express';
import { getWeeklyReport } from '../services/reports/report.service';

export async function getReport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const weekStart = typeof req.query.week === 'string' ? req.query.week : undefined;
    const result = await getWeeklyReport(String(userId), weekStart);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
