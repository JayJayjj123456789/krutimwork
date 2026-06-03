import { Request, Response, NextFunction } from 'express';
import { getWeatherByCity } from '../services/weather/weather.service';
import { getMenuSuggestions, getMoodInsight } from '../services/ai/insights.service';

export async function getMenuHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const city = typeof req.query.city === 'string' ? req.query.city : 'Bangkok';
    console.log(`[insights.controller] getMenu city="${city}"`);
    const weather = await getWeatherByCity(city);
    const items = await getMenuSuggestions({
      temperature: weather.temperature,
      humidity: weather.humidity,
      aqi: weather.aqi ?? 0,
      uv: weather.uv ?? 0,
    });
    console.log(`[insights.controller] getMenu success: ${items.length} items for "${city}"`);
    res.json({ success: true, data: { city: weather.city, items } });
  } catch (err) {
    console.error(`[insights.controller] getMenu error:`, (err as Error).message);
    next(err);
  }
}

export async function getMoodHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const city = typeof req.query.city === 'string' ? req.query.city : 'Bangkok';
    console.log(`[insights.controller] getMood city="${city}"`);
    const weather = await getWeatherByCity(city);
    const mood = await getMoodInsight({
      temperature: weather.temperature,
      humidity: weather.humidity,
      weatherCode: weather.weather_code,
      isDay: weather.is_day,
    });
    console.log(`[insights.controller] getMood success: mood length=${mood.length} for "${city}"`);
    res.json({ success: true, data: { city: weather.city, mood } });
  } catch (err) {
    console.error(`[insights.controller] getMood error:`, (err as Error).message);
    next(err);
  }
}
