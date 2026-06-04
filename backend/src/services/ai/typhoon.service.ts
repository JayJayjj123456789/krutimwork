import axios from 'axios';
import { sanitizeForPrompt } from '../../utils/sanitize';
import { withRetry } from '../../utils/retry';
import { searchWeb } from '../search/search.service';

function typhoonUrl(): string {
  return process.env.TYPHOON_API_URL || 'https://api.opentyphoon.ai/v1/chat/completions';
}

function typhoonKey(): string {
  return process.env.TYPHOON_API_KEY || '';
}

export async function callTyphoon(
  prompt: string,
  model = 'typhoon-v2.5-30b-a3b-instruct',
  maxTokens = 500
): Promise<string> {
  const apiKey = typhoonKey();
  const apiUrl = typhoonUrl();
  console.log(`[typhoon.service] calling model=${model} maxTokens=${maxTokens} promptLength=${prompt.length} keySet=${!!apiKey}`);
  if (!apiKey) {
    console.error('[typhoon.service] TYPHOON_API_KEY is not set');
  }
  return withRetry(async () => {
    const res = await axios.post(
      apiUrl,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60_000,
      }
    );
    if (!res.data?.choices?.[0]?.message?.content) {
      console.error('[typhoon.service] invalid response:', JSON.stringify(res.data).slice(0, 300));
      throw new Error('Invalid AI API response: missing choices');
    }
    const content = res.data.choices[0].message.content;
    console.log(`[typhoon.service] response OK: length=${content.length}`);
    return content;
  }, {
    retries: 2,
    baseDelay: 1000,
    onRetry: (err, attempt) => console.warn(`[typhoon.service] retry ${attempt} after:`, (err as Error)?.message),
  });
}

export async function chat(_userId: string, question: string, weatherContext = '', weatherFetched = true): Promise<string> {
  console.log(`[typhoon.service] chat question="${question.slice(0, 80)}..." hasWeatherContext=${!!weatherContext} weatherFetched=${weatherFetched}`);
  const cleanQuestion = sanitizeForPrompt(question);

  const searchResult = await searchWeb(cleanQuestion).catch(() => '');

  const appContext = weatherContext
    ? `ข้อมูลสภาพอากาศจากแอป Aether AI (ใช้ข้อมูลนี้เป็นหลัก):\n${weatherContext}\n\n`
    : '';

  const webContext = searchResult
    ? `ข้อมูลจากอินเทอร์เน็ต (ใช้เป็นข้อมูลเสริม):\n${searchResult}\n\n`
    : '';

  const honestyGuard = !weatherFetched
    ? `⚠️ สำคัญ: ระบบไม่สามารถดึงข้อมูลสภาพอากาศแบบเรียลไทม์สำหรับเมืองนี้ได้ในขณะนี้ ห้ามเดาตัวเลขอุณหภูมิ ค่า AQI หรือค่าอื่นๆ ที่เป็นตัวเลขเฉพาะ บอกผู้ใช้ตรงๆ ว่าไม่สามารถตรวจสอบข้อมูลได้ และแนะนำให้ลองเมืองอื่นหรือตรวจสอบจากแอปพลิเคชันสภาพอากาศโดยตรง\n\n`
    : '';

  const prompt = `คุณเป็นผู้ช่วยอัจฉริยะด้านสุขภาพและสภาพอากาศ ตอบเป็นภาษาไทยเท่านั้น สั้น กระชับ มีประโยชน์ ใช้ตัวเลขจากข้อมูลสภาพอากาศของแอปเป็นหลัก ถ้าไม่มีข้อมูลจากแอป ให้ใช้ข้อมูลจากอินเทอร์เน็ต

${honestyGuard}${appContext}${webContext}คำถาม: ${cleanQuestion}`;

  return callTyphoon(prompt, 'typhoon-v2.5-30b-a3b-instruct', 1000);
}
