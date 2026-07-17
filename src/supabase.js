import { createClient } from "@supabase/supabase-js";

// Set these in Vercel (Project → Settings → Environment Variables)
// and locally in a .env.local file. Vite exposes only VITE_-prefixed vars.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Null when not configured — the app shows a setup banner instead of crashing.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
