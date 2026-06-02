import { Request, Response, NextFunction } from 'express';
import { geocode } from '../services/weather/geocoding.service';

export async function getGeocode(req: Request, res: Response, next: NextFunction) {
  try {
    const name = (req.query.name as string) || '';
    if (!name) {
      return res.status(400).json({ success: false, error: 'name required' });
    }
    const count = Math.max(1, Math.min(10, Number(req.query.count) || 1));
    const results = await geocode(name, count);
    if (!results) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}
