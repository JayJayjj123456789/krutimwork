import axios from 'axios';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface GeoLocation {
  name: string;
  country: string | null;
  admin1: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
}

export async function geocode(name: string, count: number = 1): Promise<GeoLocation[] | null> {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  const safeCount = Math.max(1, Math.min(10, Math.floor(count)));
  const res = await axios.get(GEOCODING_URL, {
    params: { name: trimmed, count: safeCount, language: 'en', format: 'json' },
    timeout: 10_000,
  });
  const results: any[] = res.data?.results ?? [];
  if (results.length === 0) return null;
  return results.map((r) => ({
    name: r.name,
    country: r.country ?? null,
    admin1: r.admin1 ?? null,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone ?? 'auto',
  }));
}
