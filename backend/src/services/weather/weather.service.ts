import { requireSupabase } from '../../config/supabase';
import { geocode, GeoLocation } from './geocoding.service';
import { getForecast, ForecastResult, DailyForecast } from './forecast.service';
import { getAirQuality, AirQualityResult } from './air-quality.service';

const MAX_CITY_LENGTH = 100;

function httpError(message: string, status: number): Error & { status: number } {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

function sanitizeCity(city: string): string {
  if (typeof city !== 'string') throw httpError('city must be a string', 400);
  const cleaned = city.replace(/[<>'"%;()&+]/g, '').trim();
  if (!cleaned) throw httpError('city cannot be empty', 400);
  if (cleaned.length > MAX_CITY_LENGTH) {
    throw httpError(`city name exceeds maximum length of ${MAX_CITY_LENGTH}`, 400);
  }
  return cleaned;
}

export interface WeatherRecord {
  city: string;
  country: string | null;
  latitude: number;
  longitude: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  weather_code: number;
  is_day: number;
  aqi: number | null;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  uv: number;
  timestamp: string;
  daily: DailyForecast[];
  dataAvailability?: {
    aqi: boolean;
    uv: boolean;
  };
}

function mapAqiCategory(aqi: number): { label: string; chip: string; chipClass: string } {
  if (aqi <= 50)  return { label: 'ดีมาก',     chip: 'Good',        chipClass: 'chip-good' };
  if (aqi <= 100) return { label: 'ปานกลาง',  chip: 'Moderate',    chipClass: 'chip-neutral' };
  if (aqi <= 150) return { label: 'ไม่ดีต่อกลุ่มเสี่ยง', chip: 'Unhealthy for Sensitive', chipClass: 'chip-warning' };
  if (aqi <= 200) return { label: 'ไม่ดี',     chip: 'Unhealthy',   chipClass: 'chip-warning' };
  if (aqi <= 300) return { label: 'ไม่ดีมาก',  chip: 'Very Unhealthy', chipClass: 'chip-error' };
  return                  { label: 'อันตราย',  chip: 'Hazardous',   chipClass: 'chip-error' };
}

function mapUvCategory(uv: number): { label: string; chip: string; chipClass: string } {
  if (uv <= 2)  return { label: 'ต่ำ',      chip: 'Low',            chipClass: 'chip-good' };
  if (uv <= 5)  return { label: 'ปานกลาง',  chip: 'Moderate',       chipClass: 'chip-neutral' };
  if (uv <= 7)  return { label: 'สูง',     chip: 'High',           chipClass: 'chip-warning' };
  if (uv <= 10) return { label: 'สูงมาก',   chip: 'Very High',      chipClass: 'chip-warning' };
  return               { label: 'อันตราย',  chip: 'Extreme',        chipClass: 'chip-error' };
}

export async function getWeatherByCity(city: string): Promise<WeatherRecord> {
  const cleanCity = sanitizeCity(city);
  const locations = await geocode(cleanCity, 1);
  const location: GeoLocation | null = locations?.[0] ?? null;
  if (!location) {
    throw Object.assign(new Error(`City not found: ${cleanCity}`), { status: 404 });
  }

  const [forecast, air] = await Promise.all([
    getForecast(location.latitude, location.longitude, location.timezone),
    getAirQuality(location.latitude, location.longitude).catch((err) => {
      console.error('Air quality lookup failed:', err);
      return null;
    }),
  ]);

  const uvToday = forecast.daily[0]?.uv_index_max ?? null;
  if (uvToday === null) {
    console.warn('UV index data unavailable for', cleanCity);
  }

  const record: WeatherRecord = {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    temperature: forecast.current.temperature,
    feels_like: forecast.current.apparent_temperature,
    humidity: forecast.current.humidity,
    wind_speed: forecast.current.wind_speed,
    precipitation: forecast.current.precipitation,
    weather_code: forecast.current.weather_code,
    is_day: forecast.current.is_day,
    aqi: air?.aqi ?? null,
    pm25: air?.pm25 ?? 0,
    pm10: air?.pm10 ?? 0,
    o3: air?.o3 ?? 0,
    no2: air?.no2 ?? 0,
    uv: uvToday ?? 0,
    timestamp: new Date().toISOString(),
    daily: forecast.daily,
    dataAvailability: {
      aqi: air !== null,
      uv: uvToday !== null,
    },
  };

  if (air === null) {
    console.warn('Air quality data unavailable for', cleanCity, '- showing warning to user');
  }

  try {
    await requireSupabase().from('weather_records').insert({
      city: record.city,
      temperature: record.temperature,
      humidity: record.humidity,
      aqi: record.aqi,
      uv: record.uv,
      wind_speed: record.wind_speed / 3.6,
      pm25: record.pm25,
      weather_code: record.weather_code,
      is_day: record.is_day,
      timestamp: record.timestamp,
    });
  } catch (err) {
    console.error('Failed to persist weather data:', err);
  }

  return record;
}

export { mapAqiCategory, mapUvCategory };
