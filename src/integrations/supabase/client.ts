// Supabase client for browser/SSR.
// The publishable key is safe to ship to the browser; database access remains protected by RLS.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

// Public browser configuration for this Supabase project. Never put a service-role key here.
// Environment variables still take precedence when Lovable provides them.
const PUBLIC_SUPABASE_URL = 'https://xqnclfobyqduccefgljh.supabase.co';
const PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_e1upiHJF0hYWYRKRWw4sKw_zQ5_yZ6r';

function createSupabaseClient() {
  const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    PUBLIC_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
