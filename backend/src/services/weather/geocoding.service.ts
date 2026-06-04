import axios from 'axios';
import { withRetry } from '../../utils/retry';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface GeoLocation {
  name: string;
  country: string | null;
  admin1: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
}

const THAI_RE = /[\u0E00-\u0E7F]/;

function pickLanguages(query: string): string[] {
  return THAI_RE.test(query) ? ['th', 'en'] : ['en', 'th'];
}

async function tryGeocode(trimmed: string, count: number, language: string): Promise<any[]> {
  const res = await axios.get(GEOCODING_URL, {
    params: { name: trimmed, count, format: 'json', language },
    timeout: 10_000,
    headers: { "User-Agent": "AetherAI/1.0" },
  });
  return res.data?.results ?? [];
}

export async function geocode(name: string, count: number = 1): Promise<GeoLocation[] | null> {
  const trimmed = name?.trim();
  if (!trimmed) {
    console.warn('[geocoding.service] empty name provided');
    return null;
  }
  const safeCount = Math.max(1, Math.min(10, Math.floor(count)));
  const languages = pickLanguages(trimmed);
  console.log(`[geocoding.service] searching "${trimmed}" count=${safeCount} languages=${languages.join(',')}`);

  for (const lang of languages) {
    try {
      const results = await withRetry(() => tryGeocode(trimmed, safeCount, lang), {
        retries: 2,
        baseDelay: 800,
        onRetry: (err, a) => console.warn(`[geocoding.service] ${lang} retry ${a} after:`, (err as Error)?.message),
      });
      if (results.length > 0) {
        console.log(`[geocoding.service] found ${results.length} result(s) for "${trimmed}" via ${lang}: ${results.map((r: any) => r.name).join(', ')}`);
        return results.map((r: any) => ({
          name: r.name,
          country: r.country ?? null,
          admin1: r.admin1 ?? null,
          latitude: r.latitude,
          longitude: r.longitude,
          timezone: r.timezone ?? 'auto',
        }));
      }
      console.log(`[geocoding.service] no results for "${trimmed}" via ${lang}, trying next language`);
    } catch (err) {
      console.warn(`[geocoding.service] ${lang} geocode failed for "${trimmed}":`, (err as Error).message);
    }
  }

  console.warn(`[geocoding.service] all languages exhausted for "${trimmed}"`);
  return null;
}
