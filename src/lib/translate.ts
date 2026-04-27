import * as deepl from 'deepl-node';
import { createClient } from '@/lib/supabase/server';

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);

export async function t(key: string, defaultText: string, locale: string) {
  const supabase = await createClient();

  // 1. Intentar obtener de la BD
  const { data } = await supabase
    .from('translations')
    .select('translated_text')
    .eq('key_text', key)
    .eq('lang', locale)
    .single();

  if (data) return data.translated_text;

  // 2. Si es español (idioma base), guardamos el original y listo
  if (locale === 'es') {
    await supabase.from('translations').upsert({
      key_text: key,
      lang: 'es',
      translated_text: defaultText
    });
    return defaultText;
  }

  // 3. Si es inglés y no existe, traducimos con DeepL
  try {
    const result = await translator.translateText(defaultText, null, 'en-US');
    const translatedText = result.text;

    // Guardamos en Supabase para no volver a pagar a DeepL por esta frase
    await supabase.from('translations').insert({
      key_text: key,
      lang: 'en',
      translated_text: translatedText
    });

    return translatedText;
  } catch (error) {
    console.error("DeepL Error:", error);
    return defaultText;
  }
}