import axios from 'axios';
import { sanitizeForPrompt } from '../../utils/sanitize';

const TYPHOON_URL =
  process.env.TYPHOON_API_URL || 'https://api.opentyphoon.ai/v1/chat/completions';
const TYPHOON_KEY = process.env.TYPHOON_API_KEY || '';

export async function callTyphoon(
  prompt: string,
  model = 'typhoon-v2',
  maxTokens = 500
): Promise<string> {
  const res = await axios.post(
    TYPHOON_URL,
    {
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    },
    {
      headers: { Authorization: `Bearer ${TYPHOON_KEY}` },
      timeout: 30_000,
    }
  );
  if (!res.data?.choices?.[0]?.message?.content) {
    throw new Error('Invalid AI API response: missing choices');
  }
  return res.data.choices[0].message.content;
}

export async function chat(_userId: number | string, question: string): Promise<string> {
  const cleanQuestion = sanitizeForPrompt(question);
  const prompt = `คุณเป็นผู้ช่วยอัจฉริยะด้านสุขภาพจากข้อมูลสภาพอากาศ ตอบเป็นภาษาไทย สั้นและเป็นมิตร

คำถาม: ${cleanQuestion}`;

  return callTyphoon(prompt);
}
