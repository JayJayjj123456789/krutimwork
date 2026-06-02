import axios from 'axios';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export interface CurrentWeather {
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  precipitation: number;
  weather_code: number;
  is_day: number;
  time: string;
}

export interface DailyForecast {
  date: string;
  weather_code: number;
  temperature_max: number;
  temperature_min: number;
  precipitation_sum: number;
  uv_index_max: number;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  humidity: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

export interface ForecastResult {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast;
  timezone: string;
}

export async function getForecast(
  lat: number,
  lon: number,
  timezone = 'auto'
): Promise<ForecastResult> {
  const res = await axios.get(FORECAST_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      timezone,
      current: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'wind_speed_10m',
        'wind_direction_10m',
        'precipitation',
        'weather_code',
        'is_day',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'uv_index_max',
      ].join(','),
      hourly: ['temperature_2m', 'relative_humidity_2m', 'weather_code', 'precipitation_probability'].join(','),
      forecast_days: 7,
      wind_speed_unit: 'kmh',
    },
    timeout: 10_000,
  });

  const c = res.data?.current;
  const d = res.data?.daily;
  const h = res.data?.hourly;

  if (!c || !d?.time || !h?.time) {
    throw new Error('Open-Meteo: invalid response shape');
  }

  return {
    current: {
      temperature: c.temperature_2m,
      apparent_temperature: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      wind_speed: c.wind_speed_10m,
      wind_direction: c.wind_direction_10m,
      precipitation: c.precipitation,
      weather_code: c.weather_code,
      is_day: c.is_day,
      time: c.time,
    },
    daily: d.time.map((date: string, i: number) => ({
      date,
      weather_code: d.weather_code[i],
      temperature_max: d.temperature_2m_max[i],
      temperature_min: d.temperature_2m_min[i],
      precipitation_sum: d.precipitation_sum[i],
      uv_index_max: d.uv_index_max[i],
    })),
    hourly: {
      time: h.time,
      temperature: h.temperature_2m,
      humidity: h.relative_humidity_2m,
      weather_code: h.weather_code,
      precipitation_probability: h.precipitation_probability,
    },
    timezone: res.data.timezone,
  };
}
