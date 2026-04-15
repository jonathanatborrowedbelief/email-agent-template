import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialized so the build doesn't crash when env vars aren't set
let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }
  return _supabase;
}
