import { createClient } from '@supabase/supabase-js';

/** cPanel / Node: app.js injects window.__AUTOWISE_SUPABASE__ from server env before the bundle runs. */
function getClientConfig() {
  const injected =
    typeof window !== 'undefined' && window.__AUTOWISE_SUPABASE__ && window.__AUTOWISE_SUPABASE__.url
      ? window.__AUTOWISE_SUPABASE__
      : null;
  if (injected?.url && injected?.anonKey) {
    return { url: injected.url, anonKey: injected.anonKey };
  }
  return {
    url: import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getClientConfig();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'AutoWise: Supabase URL/key missing. Either set VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY in .env before npm run build, or set those same names (or SUPABASE_URL + SUPABASE_KEY) in cPanel → Node.js app → Environment Variables so app.js can inject them.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
