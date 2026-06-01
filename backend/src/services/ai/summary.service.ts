import { callTyphoon } from './typhoon.service';

export async function generateHealthSummary(params: {
  temperature: number;
  humidity: number;
  aqi: number;
  uv: number;
  healthScore: number;
  respiratoryRisk: string;
  migraineRisk: string;
  fatigueRisk: string;
}): Promise<string> {
  const prompt = `คุณเป็นผู้เชี่ยวชาญด้านสุขภาพกับสภาพอากาศ

ข้อมูลสภาพอากาศ:
- อุณหภูมิ: ${params.temperature}°C
- ความชื้น: ${params.humidity}%
- AQI: ${params.aqi}
- UV Index: ${params.uv}

ผลวิเคราะห์:
- Health Score: ${params.healthScore}/100
- ความเสี่ยงระบบทางเดินหายใจ: ${params.respiratoryRisk}
- ความเสี่ยงไมเกรน: ${params.migraineRisk}
- ความเสี่ยงอ่อนเพลีย: ${params.fatigueRisk}

กรุณาสรุปผลกระทบต่อสุขภาพเป็นภาษาไทย สั้นๆ ไม่เกิน 3 ประโยค`;

  return callTyphoon(prompt);
}

export async function generateReportSummary(
  averageHealthScore: number,
  totalDays: number
): Promise<string> {
  const prompt = `คุณเป็นผู้เชี่ยวชาญด้านสุขภาพ

ข้อมูลรายงานประจำสัปดาห์:
- คะแนนสุขภาพเฉลี่ย: ${averageHealthScore}/100
- จำนวนวันที่วิเคราะห์: ${totalDays} วัน

กรุณาสรุปภาพรวมสุขภาพประจำสัปดาห์เป็นภาษาไทย สั้นๆ ไม่เกิน 3 ประโยค`;

  return callTyphoon(prompt);
}
