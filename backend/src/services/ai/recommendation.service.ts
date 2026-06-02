import { callTyphoon } from './typhoon.service';

function clampNumber(n: number, min: number, max: number): number {
  if (typeof n !== 'number' || isNaN(n)) return 0;
  return Math.max(min, Math.min(max, n));
}

export async function getRecommendations(params: {
  temperature: number;
  aqi: number;
  uv: number;
  healthScore: number;
}): Promise<{ activity: string; clothing: string; hydration: string }> {
  const temp = clampNumber(params.temperature, -50, 60);
  const aqi = clampNumber(params.aqi, 0, 500);
  const uv = clampNumber(params.uv, 0, 20);
  const score = clampNumber(params.healthScore, 0, 100);

  const prompt = `คุณเป็นผู้ช่วยสุขภาพส่วนบุคคล

สภาพอากาศวันนี้:
- อุณหภูมิ: ${temp}°C
- AQI: ${aqi}
- UV: ${uv}
- Health Score: ${score}/100

ให้คำแนะนำเป็นภาษาไทย สั้นๆ ในรูปแบบ JSON:
{
  "activity": "คำแนะนำกิจกรรม",
  "clothing": "คำแนะนำการแต่งตัว",
  "hydration": "คำแนะนำการดื่มน้ำ"
}`;

  const text = await callTyphoon(prompt);
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const json = JSON.parse(jsonStr);
    return {
      activity: String(json.activity || '').slice(0, 500),
      clothing: String(json.clothing || '').slice(0, 500),
      hydration: String(json.hydration || '').slice(0, 500),
    };
  } catch {
    return { activity: String(text).slice(0, 500), clothing: '', hydration: '' };
  }
}
