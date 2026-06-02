import axios from 'axios';

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export interface AirQualityResult {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  co: number;
  time: string;
}

export async function getAirQuality(lat: number, lon: number): Promise<AirQualityResult> {
  const res = await axios.get(AIR_QUALITY_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: ['us_aqi', 'pm10', 'pm2_5', 'ozone', 'nitrogen_dioxide', 'carbon_monoxide'].join(','),
      timezone: 'auto',
    },
    timeout: 10_000,
  });
  const c = res.data?.current;
  if (!c) throw new Error('Open-Meteo Air Quality: empty response');

  const aqi = typeof c.us_aqi === 'number' ? c.us_aqi : null;
  if (aqi === null) {
    throw new Error('Open-Meteo Air Quality: AQI data unavailable');
  }

  return {
    aqi,
    pm25: typeof c.pm2_5 === 'number' ? c.pm2_5 : 0,
    pm10: typeof c.pm10 === 'number' ? c.pm10 : 0,
    o3: typeof c.ozone === 'number' ? c.ozone : 0,
    no2: typeof c.nitrogen_dioxide === 'number' ? c.nitrogen_dioxide : 0,
    co: typeof c.carbon_monoxide === 'number' ? c.carbon_monoxide : 0,
    time: c.time,
  };
}
