import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // El Browser Client usa las variables de entorno públicas
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}