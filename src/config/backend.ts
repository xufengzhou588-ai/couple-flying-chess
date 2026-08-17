const DEFAULT_SUPABASE_URL = 'https://bnsjavvleyxstnvvhgnj.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_4H6h1mp4GKNN20AaytlAKQ_2wq3Sudi';

export const supabasePublicConfig = {
  url: (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim(),
  publishableKey: (
    import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY
  ).trim()
} as const;
