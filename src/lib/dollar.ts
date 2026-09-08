// lib/dollar.ts
'use server';

interface BanxicoResponse {
  tipoDeCambio: number;
  fecha: string;
  error?: string;
}

export async function getTipoCambioDolar(): Promise<BanxicoResponse> {
  const token = process.env.BANXICO_TOKEN;
  const SERIE_DOLAR_FIX = 'SF43718';

  if (!token) {
    console.error('El BANXICO_TOKEN no está configurado.');
    return { tipoDeCambio: 0, fecha: '', error: 'Token no configurado' };
  }

  try {
    const res = await fetch(
      `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${SERIE_DOLAR_FIX}/datos/oportuno`,
      { headers: { 'Bmx-Token': token }, next: { revalidate: 14400 } }
    );

    if (!res.ok) throw new Error(`Error Banxico: ${res.status}`);

    const data = await res.json();
    const ultimoDato = data?.bmx?.series?.[0]?.datos?.[0];

    return { tipoDeCambio: parseFloat(ultimoDato.dato), fecha: ultimoDato.fecha };
  } catch (error) {
    return { tipoDeCambio: 0, fecha: '', error: 'Error al obtener tipo de cambio' };
  }
}