import axios from 'axios';
import { withRetry } from '../../utils/retry';

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export interface AirQualityResult {
  aqi: number | null;
  pm25: number | null;
  pm10: number | null;
  o3: number | null;
  no2: number | null;
  co: number | null;
  time: string;
}

export async function getAirQuality(lat: number, lon: number): Promise<AirQualityResult> {
  console.log(`[air-quality.service] fetching for lat=${lat} lon=${lon}`);
  const res = await withRetry(() => axios.get(AIR_QUALITY_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: ['us_aqi', 'pm10', 'pm2_5', 'ozone', 'nitrogen_dioxide', 'carbon_monoxide'].join(','),
      timezone: 'auto',
    },
    timeout: 10_000,
    headers: { "User-Agent": "AetherAI/1.0" },
  }), {
    retries: 3,
    baseDelay: 1000,
    onRetry: (err, a) => console.warn(`[air-quality.service] retry ${a} after:`, (err as Error)?.message),
  });
  const c = res.data?.current;
  if (!c) {
    console.error('[air-quality.service] empty response from Open-Meteo');
    throw new Error('Open-Meteo Air Quality: empty response');
  }

  const aqi = typeof c.us_aqi === 'number' ? c.us_aqi : null;
  console.log(`[air-quality.service] result: aqi=${aqi} pm25=${c.pm2_5} o3=${c.ozone}`);

  return {
    aqi,
    pm25: typeof c.pm2_5 === 'number' ? c.pm2_5 : null,
    pm10: typeof c.pm10 === 'number' ? c.pm10 : null,
    o3: typeof c.ozone === 'number' ? c.ozone : null,
    no2: typeof c.nitrogen_dioxide === 'number' ? c.nitrogen_dioxide : null,
    co: typeof c.carbon_monoxide === 'number' ? c.carbon_monoxide : null,
    time: c.time,
  };
}
