import { unstable_cache } from 'next/cache';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = "https://api-free.deepl.com/v2/translate";

// Función privada que hace la petición real a DeepL
async function fetchDeepL(text: string, targetLang: string): Promise<string> {
  if (!DEEPL_API_KEY) return text;

  const response = await fetch(DEEPL_URL, {
    method: 'POST',
    headers: { 
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang.toUpperCase() === 'EN' ? 'EN-US' : targetLang.toUpperCase(),
      source_lang: 'ES'
    }),
  });

  const data = await response.json();
  if (!data.translations) throw new Error("Falla en DeepL");
  return data.translations[0].text;
}

// Función principal exportada con Caché de Next.js
export async function getTranslation(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'es') return text;

  try {
    // Creamos una función cacheada con llaves únicas por texto e idioma
    const cachedTranslation = unstable_cache(
      async () => fetchDeepL(text, targetLang),
      [`translation-${targetLang}-${text}`], // Llaves de caché
      { revalidate: false } // No expira nunca, como tu tabla original
    );

    return await cachedTranslation();
  } catch (error) {
    console.error("Error en getTranslation:", error);
    return text; 
  }
}