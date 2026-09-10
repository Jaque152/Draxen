import { NextResponse, type NextRequest } from 'next/server';
import createI18nMiddleware from 'next-intl/middleware';

// Configuración de Idiomas
const locales = ['es', 'en'];
const defaultLocale = 'es';

const i18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export function middleware(request: NextRequest) {
  // Solo conservamos la lógica de internacionalización
  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};