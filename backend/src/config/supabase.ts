import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_KEY || '';

const isPlaceholder =
  !url || !key || url.includes('YOUR_') || key.includes('YOUR_');

export const supabase = isPlaceholder
  ? (null as any)
  : createClient(url, key, {
      realtime: { transport: ws as any },
      auth: { persistSession: false },
    });

export function requireSupabase() {
  if (!supabase) {
    const err: any = new Error(
      'Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY in .env'
    );
    err.status = 503;
    throw err;
  }
  return supabase;
}
