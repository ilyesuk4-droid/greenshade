import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

const FALLBACK_SUPABASE_URL = "";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "";

function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process?.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

function createSupabaseClient() {
  // Check environment variable sources (Vite, standard Node, Next.js format, Vercel)
  const SUPABASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.SUPABASE_URL) ||
    getEnv('VITE_SUPABASE_URL') ||
    getEnv('SUPABASE_URL') ||
    getEnv('NEXT_PUBLIC_SUPABASE_URL') ||
    FALLBACK_SUPABASE_URL;

  const SUPABASE_PUBLISHABLE_KEY =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.SUPABASE_PUBLISHABLE_KEY) ||
    getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') ||
    getEnv('SUPABASE_PUBLISHABLE_KEY') ||
    getEnv('SUPABASE_ANON_KEY') ||
    getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
    FALLBACK_SUPABASE_PUBLISHABLE_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
