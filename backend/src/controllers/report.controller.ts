import { Request, Response, NextFunction } from 'express';
import { getWeeklyReport } from '../services/reports/report.service';

export async function getReport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.query.userId as string;
    const weekStart = req.query.week as string;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId required' });
    }

    const result = await getWeeklyReport(userId, weekStart);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
