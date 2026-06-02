import axios from 'axios';

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

const AQI_SCALE: Record<number, number> = { 1: 50, 2: 100, 3: 150, 4: 200, 5: 300 };

export async function getAQIByCoords(lat: number, lon: number) {
  const url = 'https://api.openweathermap.org/data/2.5/air_pollution';
  const res = await axios.get(url, {
    params: { lat, lon, appid: OPENWEATHER_KEY },
    timeout: 10_000,
  });
  const main = res.data?.list?.[0]?.main;
  const components = res.data?.list?.[0]?.components || {};
  if (!main) throw new Error('AQI: empty response from upstream');
  return {
    aqi: AQI_SCALE[main.aqi] ?? 0,
    components,
  };
}
