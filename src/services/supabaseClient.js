import { createClient } from "@supabase/supabase-js";

// Konfigurasi Supabase BaaS (dari environment variables .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-metabody.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Safe client initialization: Aplikasi tidak akan crash jika env belum diisi
let supabase = null;

try {
  if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase Realtime Hub terhubung.");
  } else {
    console.log("ℹ️ Mode Offline Standalone aktif (Supabase env belum dikonfigurasi).");
  }
} catch (error) {
  console.warn("Supabase init error:", error);
}

export { supabase };
