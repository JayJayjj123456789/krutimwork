import { Request, Response, NextFunction } from 'express';
import { getWeatherByCity } from '../services/weather/weather.service';

export async function getWeather(req: Request, res: Response, next: NextFunction) {
  try {
    const city = (req.query.city as string) || 'Bangkok';
    const data = await getWeatherByCity(city);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
