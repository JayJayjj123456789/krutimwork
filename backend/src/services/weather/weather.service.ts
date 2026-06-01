import axios from 'axios';
import { requireSupabase } from '../../config/supabase';
import { getAQIByCoords } from './aqi.service';
import { getUVByCoords } from './uv.service';

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

export async function getWeatherByCity(city: string) {
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const res = await axios.get(url, {
    params: { q: city, appid: OPENWEATHER_KEY, units: 'metric' },
  });

  const { lat, lon } = res.data.coord;
  const [aqiData, uvData] = await Promise.all([
    getAQIByCoords(lat, lon),
    getUVByCoords(lat, lon),
  ]);

  const data = {
    city: res.data.name,
    temperature: res.data.main.temp,
    humidity: res.data.main.humidity,
    wind_speed: res.data.wind?.speed || 0,
    aqi: aqiData.aqi,
    uv: uvData.uv,
    pm25: aqiData.components?.pm2_5 || 0,
    timestamp: new Date().toISOString(),
  };

  try { await requireSupabase().from('weather_records').insert(data); } catch {}
  return data;
}
