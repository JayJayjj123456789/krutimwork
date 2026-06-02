import { Request, Response, NextFunction } from 'express';
import { getWeatherByCity } from '../services/weather/weather.service';
import { getMenuSuggestions, getMoodInsight } from '../services/ai/insights.service';

export async function getMenuHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const city = (req.query.city as string) || 'Bangkok';
    const weather = await getWeatherByCity(city);
    const items = await getMenuSuggestions({
      temperature: weather.temperature ?? 30,
      humidity: weather.humidity ?? 60,
      aqi: weather.aqi ?? 0,
      uv: weather.uv ?? 0,
    });
    res.json({ success: true, data: { city: weather.city, items } });
  } catch (err) {
    next(err);
  }
}

export async function getMoodHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const city = (req.query.city as string) || 'Bangkok';
    const weather = await getWeatherByCity(city);
    const mood = await getMoodInsight({
      temperature: weather.temperature ?? 30,
      humidity: weather.humidity ?? 60,
      weatherCode: weather.weather_code ?? 0,
      isDay: weather.is_day ?? 1,
    });
    res.json({ success: true, data: { city: weather.city, mood } });
  } catch (err) {
    next(err);
  }
}
