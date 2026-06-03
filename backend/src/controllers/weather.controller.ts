import { Request, Response, NextFunction } from 'express';
import { getWeatherByCity } from '../services/weather/weather.service';

export async function getWeather(req: Request, res: Response, next: NextFunction) {
  try {
    const city = typeof req.query.city === 'string' ? req.query.city : 'Bangkok';
    console.log(`[weather.controller] getWeather city="${city}"`);
    const data = await getWeatherByCity(city);
    console.log(`[weather.controller] getWeather success city="${data.city}" temp=${data.temperature}`);
    res.json({ success: true, data });
  } catch (err) {
    console.error(`[weather.controller] getWeather error:`, (err as Error).message);
    next(err);
  }
}
