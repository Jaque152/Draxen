import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 1. Definimos los idiomas soportados como tipos literales constantes
const locales = ['es', 'en'] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // 2. Esperamos el locale (Next.js 15 lo maneja como promesa)
  const locale = await requestLocale;

  // 3. Validamos que el locale exista y sea uno de nuestros permitidos
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    // 4. Forzamos el tipo a Locale para que TS sepa que no es un "string cualquiera"
    locale: locale as Locale,
    // Enviamos un objeto vacío tipado para evitar el error de mensajes
    messages: {} 
  };
});