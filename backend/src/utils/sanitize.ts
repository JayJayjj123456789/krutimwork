const MAX_INPUT_LENGTH = 2000;

export function sanitizeForPrompt(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/```/g, '')
    .replace(/system\s*:/gi, '')
    .replace(/assistant\s*:/gi, '')
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}
