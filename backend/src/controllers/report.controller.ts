import { Request, Response, NextFunction } from 'express';
import { getWeeklyReport } from '../services/reports/report.service';

export async function getReport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const weekStart = typeof req.query.weekStart === 'string' ? req.query.weekStart : undefined;
    console.log(`[report.controller] getReport userId=${userId || 'anonymous'} weekStart=${weekStart || 'auto'}`);
    const result = await getWeeklyReport(userId || 'anonymous', weekStart);
    console.log(`[report.controller] getReport success: ${result.analyses_count} analyses, avgScore=${result.avg_health_score}`);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(`[report.controller] getReport error:`, (err as Error).message);
    next(err);
  }
}
