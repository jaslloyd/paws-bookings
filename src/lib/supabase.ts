import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase config. Copy .env.example to .env.local and set " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Supabase dashboard → " +
      "Project Settings → API).",
  );
}

// Single shared client. The anon key is public — Row Level Security is what
// actually protects the data.
export const supabase = createClient(url, anonKey);
