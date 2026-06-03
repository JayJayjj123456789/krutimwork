import { callTyphoon } from './typhoon.service';

const MENU_SYSTEM = `คุณเป็นนักโภชนาการไทย แนะนำเมนูอาหารไทย 3 อย่างที่เหมาะกับสภาพอากาศ
- ตอบเป็น JSON array เท่านั้น ห้ามมีข้อความอื่น
- แต่ละเมนูมี: name (ชื่อเมนูภาษาไทย), reason (เหตุผล 1 ประโยค), benefit (ประโยคสั้น ๆ เกี่ยวกับสุขภาพ)
- เลือกเมนูที่หาซื้อง่ายในไทย`;

const MOOD_SYSTEM = `คุณเป็นผู้เชี่ยวชาญด้านจิตวิทยาและสภาพอากาศ
- วิเคราะห์ว่าสภาพอากาศนี้ส่งผลต่ออารมณ์คนไทยอย่างไร
- ให้คำแนะนำ 2-3 ประโยคสั้น ๆ ภาษาไทย เป็นกันเอง
- ไม่ต้องตอบเป็น JSON`;

function clamp(n: number, lo: number, hi: number): number {
  if (typeof n !== 'number' || isNaN(n)) return 0;
  return Math.max(lo, Math.min(hi, n));
}

export interface MenuItem {
  name: string;
  reason: string;
  benefit: string;
}

export async function getMenuSuggestions(params: {
  temperature: number;
  humidity: number;
  aqi: number;
  uv: number;
}): Promise<MenuItem[]> {
  console.log(`[insights.service] getMenuSuggestions: temp=${params.temperature} humidity=${params.humidity} aqi=${params.aqi} uv=${params.uv}`);

  const prompt = `${MENU_SYSTEM}

สภาพอากาศ:
- อุณหภูมิ: ${clamp(params.temperature, -50, 60)}°C
- ความชื้น: ${clamp(params.humidity, 0, 100)}%
- AQI: ${clamp(params.aqi, 0, 500)}
- UV: ${clamp(params.uv, 0, 20)}

ตอบเป็น JSON array เท่านั้น:`;

  const text = await callTyphoon(prompt, undefined, 400);
  const match = text.match(/\[[\s\S]*?\]/);
  const jsonStr = match ? match[0] : text;
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('not array');
    console.log(`[insights.service] menu suggestions: ${parsed.length} items parsed`);
    return parsed.slice(0, 3).map((m: any) => ({
      name: String(m.name || '').slice(0, 100),
      reason: String(m.reason || '').slice(0, 200),
      benefit: String(m.benefit || '').slice(0, 200),
    }));
  } catch (err) {
    console.warn(`[insights.service] menu parse failed:`, (err as Error).message);
    return [];
  }
}

const WMO_TH: Record<number, string> = {
  0: 'ท้องฟ้าแจ่มใส', 1: 'เมฆเล็กน้อย', 2: 'มีเมฆเป็นบางส่วน', 3: 'เมฆครึ้ม',
  45: 'หมอก', 48: 'หมอกน้ำแข็ง', 51: 'ฝนปรอยเล็กน้อย', 53: 'ฝนปรอย',
  55: 'ฝนปรอยหนัก', 61: 'ฝนตกเล็กน้อย', 63: 'ฝนตกปานกลาง', 65: 'ฝนตกหนัก',
  71: 'หิมะตกเล็กน้อย', 73: 'หิมะตกปานกลาง', 75: 'หิมะตกหนัก',
  80: 'ฝนซู่เล็กน้อย', 81: 'ฝนซู่ปานกลาง', 82: 'ฝนซู่รุนแรง',
  95: 'พายุฝนฟ้าคะนอง', 96: 'พายุฝนฟ้าคะนอง', 99: 'พายุฝนฟ้าคะนองรุนแรง',
};

function weatherLabel(code: number): string {
  return WMO_TH[code] || 'ไม่ทราบ';
}

export async function getMoodInsight(params: {
  temperature: number;
  humidity: number;
  weatherCode: number;
  isDay: number;
}): Promise<string> {
  const prompt = `${MOOD_SYSTEM}

สภาพอากาศ:
- อุณหภูมิ: ${clamp(params.temperature, -50, 60)}°C
- ความชื้น: ${clamp(params.humidity, 0, 100)}%
- สภาพ: ${params.isDay === 1 ? 'กลางวัน' : 'กลางคืน'}
- ลักษณะอากาศ: ${weatherLabel(params.weatherCode)}

วิเคราะห์ผลกระทบต่ออารมณ์:`;

  return callTyphoon(prompt, undefined, 200);
}
