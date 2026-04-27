import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos Service Role para poder insertar sin restricciones de RLS en el backend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
// Si tu cuenta es gratuita usa: https://api-free.deepl.com/v2/translate
// Si es Pro: https://api.deepl.com/v2/translate
const DEEPL_URL = "https://api-free.deepl.com/v2/translate";

export async function POST(req: Request) {
  let text = ""; 
  try {
    const { text: rawText, targetLang } = await req.json();
    text = rawText;

    if (targetLang === 'es') return NextResponse.json({ translated: text });

    // 1. Buscar en Caché (Supabase)
    const { data: existing } = await supabase
      .from('translations')
      .select('translated_text')
      .eq('key_text', text)
      .eq('lang', targetLang)
      .single();

    if (existing) return NextResponse.json({ translated: existing.translated_text });

    // 2. Llamada a DeepL 
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

    const translatedText = data.translations[0].text;

    // 3. Guardar en Supabase para persistencia
    await supabase.from('translations').insert({
      key_text: text,
      lang: targetLang,
      translated_text: translatedText
    });

    return NextResponse.json({ translated: translatedText });
  } catch (error) {
    console.error("Error i18n:", error);
    return NextResponse.json({ translated: text }, { status: 500 });
  }
}