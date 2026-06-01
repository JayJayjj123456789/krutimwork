import { callTyphoon } from './typhoon.service';

export async function getRecommendations(params: {
  temperature: number;
  aqi: number;
  uv: number;
  healthScore: number;
}): Promise<{ activity: string; clothing: string; hydration: string }> {
  const prompt = `คุณเป็นผู้ช่วยสุขภาพส่วนบุคคล

สภาพอากาศวันนี้:
- อุณหภูมิ: ${params.temperature}°C
- AQI: ${params.aqi}
- UV: ${params.uv}
- Health Score: ${params.healthScore}/100

ให้คำแนะนำเป็นภาษาไทย สั้นๆ ในรูปแบบ JSON:
{
  "activity": "คำแนะนำกิจกรรม",
  "clothing": "คำแนะนำการแต่งตัว",
  "hydration": "คำแนะนำการดื่มน้ำ"
}`;

  const text = await callTyphoon(prompt);
  try {
    const json = JSON.parse(text);
    return {
      activity: json.activity,
      clothing: json.clothing,
      hydration: json.hydration,
    };
  } catch {
    return { activity: text, clothing: '', hydration: '' };
  }
}
