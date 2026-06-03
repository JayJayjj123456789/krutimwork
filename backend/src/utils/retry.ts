export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { retries?: number; baseDelay?: number; onRetry?: (err: unknown, attempt: number) => void }
): Promise<T> {
  const retries = options?.retries ?? 2;
  const baseDelay = options?.baseDelay ?? 1000;
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) throw err;
      const status = (err as any)?.response?.status;
      if (status && status < 500 && status !== 429) throw err;
      if (status === 429) {
        const retryAfter = (err as any)?.response?.headers?.["retry-after"];
        const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt);
        console.warn(`[retry] 429 rate limited, waiting ${delayMs}ms before retry ${attempt + 1}`);
        await new Promise(r => setTimeout(r, delayMs));
      }
      options?.onRetry?.(err, attempt + 1);
      await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)));
    }
  }
}
