/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_PREMIUM?: string;
  readonly VITE_ENABLE_REMOTE_VIDEO?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
