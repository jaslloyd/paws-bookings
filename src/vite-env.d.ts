/// <reference types="vite/client" />

// Type our custom env vars so import.meta.env.VITE_SUPABASE_* are `string`.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
