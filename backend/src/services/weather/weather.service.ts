import axios from 'axios';
import { requireSupabase } from '../../config/supabase';
import { getAQIByCoords } from './aqi.service';
import { getUVByCoords } from './uv.service';

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';
const MAX_CITY_LENGTH = 100;

function sanitizeCity(city: string): string {
  if (typeof city !== 'string') throw new Error('city must be a string');
  const cleaned = city.replace(/[<>'"%;()&+]/g, '').trim();
  if (!cleaned) throw new Error('city cannot be empty');
  if (cleaned.length > MAX_CITY_LENGTH) {
    throw new Error(`city name exceeds maximum length of ${MAX_CITY_LENGTH}`);
  }
  return cleaned;
}

export async function getWeatherByCity(city: string) {
  const cleanCity = sanitizeCity(city);
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const res = await axios.get(url, {
    params: { q: cleanCity, appid: OPENWEATHER_KEY, units: 'metric' },
    timeout: 10_000,
  });

  if (!res.data?.coord || !res.data?.main) {
    throw new Error('Invalid response from weather API');
  }

  const { lat, lon } = res.data.coord;

  const aqiResult = await getAQIByCoords(lat, lon).catch((err) => {
    console.error('AQI lookup failed:', err);
    return null;
  });
  const uvResult = await getUVByCoords(lat, lon).catch((err) => {
    console.error('UV lookup failed:', err);
    return null;
  });

  const data = {
    city: res.data.name,
    temperature: res.data.main.temp,
    humidity: res.data.main.humidity,
    wind_speed: res.data.wind?.speed ?? 0,
    aqi: aqiResult?.aqi ?? 0,
    uv: uvResult?.uv ?? 0,
    pm25: aqiResult?.components?.pm2_5 ?? 0,
    timestamp: new Date().toISOString(),
  };

  try {
    await requireSupabase().from('weather_records').insert(data);
  } catch (err) {
    console.error('Failed to persist weather data:', err);
  }
  return data;
}
