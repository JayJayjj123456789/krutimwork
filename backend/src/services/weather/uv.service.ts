import axios from 'axios';

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

export async function getUVByCoords(lat: number, lon: number) {
  const url = 'https://api.openweathermap.org/data/2.5/uvi';
  const res = await axios.get(url, {
    params: { lat, lon, appid: OPENWEATHER_KEY },
  });
  return { uv: res.data.value || 0 };
}
