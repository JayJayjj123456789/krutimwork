import axios from 'axios';
import { withRetry } from '../../utils/retry';

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyResponse {
  results: TavilyResult[];
  answer?: string;
}

const MAX_QUERY_LENGTH = 500;

export async function searchWeb(query: string): Promise<string> {
  // Validate input
  if (!query || typeof query !== 'string') {
    console.warn('[search.service] invalid query: empty or not a string');
    return 'Search unavailable: invalid query.';
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    console.warn('[search.service] empty query after trimming');
    return 'Search unavailable: empty query.';
  }

  const safeQuery = trimmedQuery.slice(0, MAX_QUERY_LENGTH);
  console.log(`[search.service] tavily searching: "${safeQuery.slice(0, 80)}..."`);

  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.error('[search.service] TAVILY_API_KEY is not set');
    return 'Search unavailable: API key not configured.';
  }
  try {
    const res = await withRetry(() => axios.post<TavilyResponse>(
      'https://api.tavily.com/search',
      {
        api_key: apiKey,
        query: safeQuery,
        search_depth: 'basic',
        max_results: 5,
      },
      { timeout: 15_000 }
    ), {
      retries: 2,
      baseDelay: 1000,
      onRetry: (err, attempt) => console.warn(`[search.service] retry ${attempt} after:`, (err as Error)?.message),
    });

    const results = res.data.results;
    if (!results || results.length === 0) {
      console.warn('[search.service] no results found');
      return 'No search results found.';
    }

    const formatted = results.map((r, i) =>
      `${i + 1}. ${r.title}\n   ${r.content?.slice(0, 200) ?? ''}\n   ${r.url}`
    ).join('\n\n');

    if (res.data.answer) {
      return `${res.data.answer}\n\n${formatted}`;
    }

    console.log(`[search.service] ${results.length} results for "${query}"`);
    return formatted;
  } catch (err) {
    console.error('[search.service] tavily search failed:', (err as Error)?.message);
    return 'Search unavailable due to a network error.';
  }
}
