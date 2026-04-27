import { NextResponse, type NextRequest } from 'next/server';
import createI18nMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';

// 1. Configuración de Idiomas
const locales = ['es', 'en'];
const defaultLocale = 'es';

const i18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // Asegura que la URL siempre tenga /es/ o /en/
});

export async function middleware(request: NextRequest) {
  // --- A. LÓGICA DE INTERNACIONALIZACIÓN ---
  const response = i18nMiddleware(request);

  // --- B. LÓGICA DE SESIÓN ANÓNIMA (CARRITO) ---
  let sessionId = request.cookies.get('session_id')?.value;
  let isNewSession = false;

  if (!sessionId) {
    // Generación un ID único si el usuario no tiene uno
    sessionId = crypto.randomUUID();
    isNewSession = true;

    response.cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true, // No accesible desde JS del cliente
      maxAge: 60 * 60 * 24 * 1, // Persiste por 24 horas
      sameSite: 'lax',
    });
  }

  // --- C. SINCRONIZACIÓN CON SUPABASE (RLS) ---
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 'app.current_session_id' identifique al dueño del carrito
  await supabase.rpc('set_session_id', { s_id: sessionId });

  return response;
}

export const config = {
  //  el middleware se ejecuta en todas las rutas 
  // excepto estáticos, imágenes y archivos del sistema
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};