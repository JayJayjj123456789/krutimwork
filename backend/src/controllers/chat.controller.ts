import { Request, Response, NextFunction } from 'express';
import { getFirestore } from '../config/firebase';
import { chat } from '../services/ai/typhoon.service';
import { getWeatherByCity } from '../services/weather/weather.service';

const MAX_QUESTION_LENGTH = 1000;
const MIN_QUESTION_LENGTH = 1;

const WEATHER_KEYWORDS = /(weather|rain|temperature|hot|cold|cool|warm|humid|aqi|pollution|pm2\.5|pm25|uv|umbrella|mask|jacket|wear|wearwear|snow|wind|storm|degree|°c|°f|ฝน|อากาศ|ร้อน|หนาว|เย็น|ชื้น|มลพิษ|ร่ม|หน้ากาก|เสื้อ|สภาพอากาศ|อุณหภูมิ|ความชื้น|ฝุ่น)/i;

const KNOWN_CITIES = [
  'Bangkok', 'Tokyo', 'London', 'Paris', 'New York', 'Singapore', 'Berlin',
  'Sydney', 'Mumbai', 'Cairo', 'Seoul', 'Beijing', 'Shanghai', 'Hong Kong',
  'Dubai', 'Istanbul', 'Rome', 'Madrid', 'Barcelona', 'Amsterdam', 'Vienna',
  'Prague', 'Athens', 'Moscow', 'Toronto', 'Vancouver', 'Montreal', 'Los Angeles',
  'San Francisco', 'Chicago', 'Miami', 'Boston', 'Mexico City', 'Buenos Aires',
  'Sao Paulo', 'Rio de Janeiro', 'Lima', 'Bogota', 'Santiago', 'Cape Town',
  'Johannesburg', 'Lagos', 'Nairobi', 'Casablanca', 'Karachi', 'Delhi', 'Jakarta',
  'Manila', 'Kuala Lumpur', 'Hanoi', 'Ho Chi Minh', 'Taipei', 'Osaka', 'Kyoto',
  'กรุงเทพ', 'โตเกียว', 'ลอนดอน', 'ปารีส', 'นิวยอร์ก', 'สิงคโปร์', 'เบอร์ลิน',
  'ซิดนีย์', 'มุมไบ', 'ไคโร', 'โซล', 'ปักกิ่ง', 'เซี่ยงไฮ้', 'ฮ่องกง',
  'ดูไบ', 'อิสตันบูล', 'โรม', 'มาดริด', 'บาร์เซโลนา', 'อัมสเตอร์ดัม',
];

const weatherCache = new Map<string, { data: string; expires: number }>();
const WEATHER_CACHE_TTL_MS = 60_000;

function sanitize(input: string): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function extractCityFromQuestion(question: string): string | null {
  for (const city of KNOWN_CITIES) {
    if (question.toLowerCase().includes(city.toLowerCase())) return city;
  }
  const m = question.match(/\b(?:in|at|for)\s+([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*)/);
  if (m) return m[1].trim();
  const mThai = question.match(/(?:ที่|ใน|เมือง)\s*([ก-๙][\u0E00-\u0E7F]+(?:\s[ก-๙][\u0E00-\u0E7F]+)*)/);
  if (mThai) return mThai[1].trim();
  return null;
}

async function buildWeatherContext(city: string): Promise<{ context: string; fetched: boolean }> {
  const cached = weatherCache.get(city.toLowerCase());
  if (cached && cached.expires > Date.now()) {
    console.log(`[chat.controller] weather cache hit for "${city}"`);
    return { context: cached.data, fetched: true };
  }
  try {
    console.log(`[chat.controller] calling getWeatherByCity("${city}")...`);
    const t0 = Date.now();
    const w = await getWeatherByCity(city);
    console.log(`[chat.controller] getWeatherByCity("${city}") OK in ${Date.now() - t0}ms, temp=${w.temperature}`);
    const aqiLabel = w.aqi !== null ? (w.aqi <= 50 ? 'ดีมาก' : w.aqi <= 100 ? 'ปานกลาง' : w.aqi <= 150 ? 'ไม่ดีต่อกลุ่มเสี่ยง' : 'ไม่ดี') : 'ไม่ทราบ';
    const uvLabel = w.uv !== null ? (w.uv <= 2 ? 'ต่ำ' : w.uv <= 5 ? 'ปานกลาง' : w.uv <= 7 ? 'สูง' : 'สูงมาก') : 'ไม่ทราบ';
    const ctx = `สภาพอากาศปัจจุบันที่ ${w.city}, ${w.country ?? ''}:
- อุณหภูมิ: ${w.temperature}°C (รู้สึกเหมือน ${w.feels_like}°C)
- ความชื้น: ${w.humidity}%
- ความเร็วลม: ${w.wind_speed} km/h
- AQI: ${w.aqi ?? 'N/A'} (${aqiLabel})
- PM2.5: ${w.pm25 ?? 'N/A'} µg/m³
- UV Index: ${w.uv ?? 'N/A'} (${uvLabel})
- สภาพ: weather_code=${w.weather_code}, is_day=${w.is_day}
- เวลา: ${w.timestamp}`;
    weatherCache.set(city.toLowerCase(), { data: ctx, expires: Date.now() + WEATHER_CACHE_TTL_MS });
    return { context: ctx, fetched: true };
  } catch (e) {
    console.warn(`[chat.controller] getWeatherByCity("${city}") FAILED:`, (e as Error).message);
    return { context: '', fetched: false };
  }
}

export async function chatHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { question } = req.body;

    if (!req.userId) {
      console.warn('[chat.controller] no userId in request');
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const userId = req.userId;
    if (!question || typeof question !== 'string') {
      console.warn(`[chat.controller] invalid question body="${JSON.stringify(req.body)}"`);
      return res.status(400).json({ success: false, error: 'question required' });
    }

    const cleanQuestion = sanitize(question);

    if (cleanQuestion.length < MIN_QUESTION_LENGTH) {
      return res.status(400).json({ success: false, error: 'question cannot be empty' });
    }
    if (cleanQuestion.length > MAX_QUESTION_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `question exceeds maximum length of ${MAX_QUESTION_LENGTH} characters`,
      });
    }

    let weatherContext = '';
    let weatherFetched = false;
    if (WEATHER_KEYWORDS.test(cleanQuestion)) {
      const city = extractCityFromQuestion(cleanQuestion);
      if (city) {
        console.log(`[chat.controller] detected weather question for city "${city}"`);
        const result = await buildWeatherContext(city);
        weatherContext = result.context;
        weatherFetched = result.fetched;
      } else {
        console.log('[chat.controller] weather question but no city detected');
      }
    }

    console.log(`[chat.controller] chat userId=${userId} question="${cleanQuestion.slice(0, 80)}..." hasWeatherContext=${!!weatherContext} weatherFetched=${weatherFetched}`);
    const answer = await chat(userId, cleanQuestion, weatherContext, weatherFetched);
    console.log(`[chat.controller] chat success userId=${userId} answerLength=${answer.length}`);

    try {
      const db = getFirestore();
      await db.collection('chatHistory').add({
        user_id: userId,
        question: cleanQuestion,
        answer,
        city: extractCityFromQuestion(cleanQuestion),
        created_at: new Date().toISOString(),
      });
      console.log('[chat.controller] chat history saved to Firestore');
    } catch (dbErr) {
      console.error('[chat.controller] Failed to save chat history:', dbErr);
    }

    res.json({ success: true, data: { answer } });
  } catch (err) {
    console.error(`[chat.controller] chat error:`, (err as Error).message);
    next(err);
  }
}

export const _debugBuildWeatherContext = buildWeatherContext;
export const _debugExtractCity = extractCityFromQuestion;
export const _debugWeatherKeywords = WEATHER_KEYWORDS;
