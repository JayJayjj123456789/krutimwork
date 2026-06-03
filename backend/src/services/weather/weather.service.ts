import { getFirestore } from '../../config/firebase';
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
  id?: string;
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
  pm25: number | null;
  pm10: number | null;
  o3: number | null;
  no2: number | null;
  uv: number | null;
  timestamp: string;
  daily: DailyForecast[];
  dataAvailability?: {
    aqi: boolean;
    uv: boolean;
  };
  persisted?: boolean;
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
  console.log(`[weather.service] geocoding "${cleanCity}"...`);
  const locations = await geocode(cleanCity, 1);
  const location: GeoLocation | null = locations?.[0] ?? null;
  if (!location) {
    console.warn(`[weather.service] city not found: "${cleanCity}"`);
    throw Object.assign(new Error(`City not found: ${cleanCity}`), { status: 404 });
  }
  console.log(`[weather.service] geocoded "${cleanCity}" → ${location.name}, ${location.country} (${location.latitude}, ${location.longitude})`);

  console.log(`[weather.service] fetching forecast + air quality for ${location.latitude}, ${location.longitude}...`);
  const [forecast, air] = await Promise.all([
    getForecast(location.latitude, location.longitude, location.timezone),
    getAirQuality(location.latitude, location.longitude).catch((err) => {
      console.error('[weather.service] Air quality lookup failed:', (err as Error).message);
      return null;
    }),
  ]);
  console.log(`[weather.service] forecast received, daily=${forecast.daily?.length ?? 0} days`);
  console.log(`[weather.service] air quality data: ${air !== null ? 'available' : 'UNAVAILABLE'}`);

  if (!forecast.current) {
    console.warn(`[weather.service] NO current weather data in forecast response for "${cleanCity}"`);
    throw Object.assign(new Error(`Weather data unavailable for ${cleanCity}`), { status: 502 });
  }

  const temp = forecast.current.temperature;
  const feels_like = forecast.current.apparent_temperature;
  const humidity = forecast.current.humidity;
  const wind_speed = forecast.current.wind_speed;
  const precipitation = forecast.current.precipitation;
  const weather_code = forecast.current.weather_code;
  const is_day = forecast.current.is_day;

  const uvToday = forecast.daily?.length ? (forecast.daily[0]?.uv_index_max ?? null) : null;
  if (uvToday === null) {
    console.warn('[weather.service] UV index data unavailable for', cleanCity);
  }

  const record: WeatherRecord = {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    temperature: temp,
    feels_like: feels_like,
    humidity: humidity,
    wind_speed: wind_speed,
    precipitation: precipitation,
    weather_code: weather_code,
    is_day: is_day,
    aqi: air?.aqi ?? null,
    pm25: air?.pm25 ?? null,
    pm10: air?.pm10 ?? null,
    o3: air?.o3 ?? null,
    no2: air?.no2 ?? null,
    uv: uvToday,
    timestamp: new Date().toISOString(),
    daily: forecast.daily,
    dataAvailability: {
      aqi: air !== null,
      uv: uvToday !== null,
    },
    persisted: true,
  };

  if (air === null) {
    console.warn('[weather.service] Air quality data unavailable for', cleanCity, '- showing warning to user');
  }

  try {
    const db = getFirestore();
    const docRef = await db.collection('weatherRecords').add({
      city: record.city,
      temperature: record.temperature,
      humidity: record.humidity,
      aqi: record.aqi,
      uv: record.uv,
      wind_speed: record.wind_speed,
      pm25: record.pm25,
      timestamp: record.timestamp,
    });
    record.id = docRef.id;
    console.log(`[weather.service] persisted weather for "${record.city}" id=${record.id}`);
  } catch (err) {
    console.error('[weather.service] Failed to persist weather data:', (err as Error).message);
    record.persisted = false;
  }

  return record;
}

export { mapAqiCategory, mapUvCategory };
