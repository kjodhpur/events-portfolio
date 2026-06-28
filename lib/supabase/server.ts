import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Read-only server client for the public page (anon key, RLS allows public read).
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() { /* no-op: public page does not mutate auth */ },
      },
    }
  );
}
