import { Request, Response, NextFunction } from 'express';
import { geocode } from '../services/weather/geocoding.service';

export async function getGeocode(req: Request, res: Response, next: NextFunction) {
  try {
    const name = typeof req.query.name === 'string' ? req.query.name : '';
    if (!name) {
      console.warn('[geocode.controller] missing name parameter');
      return res.status(400).json({ success: false, error: 'name required' });
    }
    const parsed = typeof req.query.count === 'string' ? Number(req.query.count) : NaN;
    const count = Number.isNaN(parsed) ? 1 : Math.max(1, Math.min(10, parsed));
    console.log(`[geocode.controller] geocode name="${name}" count=${count}`);
    const results = await geocode(name, count);
    if (!results) {
      console.warn(`[geocode.controller] no results for "${name}"`);
      return res.status(404).json({ success: false, error: 'Location not found' });
    }
    console.log(`[geocode.controller] geocode success: ${results.length} results for "${name}"`);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error(`[geocode.controller] geocode error:`, (err as Error).message);
    next(err);
  }
}
