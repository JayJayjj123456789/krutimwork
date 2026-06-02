import { createClient, SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_KEY || '';

const isPlaceholder =
  !url || !key || url.includes('YOUR_') || key.includes('YOUR_');

export const supabase: SupabaseClient<any, 'public', any> | null = isPlaceholder
  ? null
  : createClient<any, 'public', any>(url, key, {
      realtime: { transport: ws as any },
      auth: { persistSession: false },
    });

export function requireSupabase(): SupabaseClient<any, 'public', any> {
  if (!supabase) {
    const err: Error & { status?: number } = new Error(
      'Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY in .env'
    );
    err.status = 503;
    throw err;
  }
  return supabase;
}
