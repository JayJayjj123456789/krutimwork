import axios from 'axios';
import { sanitizeForPrompt } from '../../utils/sanitize';

const TYPHOON_URL =
  process.env.TYPHOON_API_URL || 'https://api.opentyphoon.ai/v1/chat/completions';
const TYPHOON_KEY = process.env.TYPHOON_API_KEY || '';

export async function callTyphoon(
  prompt: string,
  model = 'typhoon-v2.5-30b-a3b-instruct',
  maxTokens = 500
): Promise<string> {
  try {
    const res = await axios.post(
      TYPHOON_URL,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${TYPHOON_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60_000,
      }
    );
    if (!res.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI API response: missing choices');
    }
    return res.data.choices[0].message.content;
  } catch (err: any) {
    if (err?.response) {
      console.error('[Typhoon error]', err.response.status, JSON.stringify(err.response.data).slice(0, 500));
    } else {
      console.error('[Typhoon error]', err?.message);
    }
    throw err;
  }
}

export async function chat(_userId: number | string, question: string): Promise<string> {
  const cleanQuestion = sanitizeForPrompt(question);
  const prompt = `คุณเป็นผู้ช่วยอัจฉริยะด้านสุขภาพจากข้อมูลสภาพอากาศ ตอบเป็นภาษาไทย สั้นและเป็นมิตร

คำถาม: ${cleanQuestion}`;

  return callTyphoon(prompt);
}
