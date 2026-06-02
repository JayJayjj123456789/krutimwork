import axios from 'axios';

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

export async function getUVByCoords(lat: number, lon: number) {
  const url = 'https://api.openweathermap.org/data/2.5/uvi';
  const res = await axios.get(url, {
    params: { lat, lon, appid: OPENWEATHER_KEY },
    timeout: 10_000,
  });
  if (typeof res.data?.value !== 'number') {
    throw new Error('UV: empty response from upstream');
  }
  return { uv: res.data.value };
}
