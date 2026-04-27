'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ETOMIN_EMAIL = process.env.ETOMIN_EMAIL!;
const ETOMIN_PASSWORD = process.env.ETOMIN_PASSWORD!;
const ETOMIN_BASE_URL = process.env.ETOMIN_BASE_URL!;

const getEtominHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'NinjaCreatives/1.0',
  ...extraHeaders
});

async function safeEtominFetch(url: string, options: RequestInit, stepName: string) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Error en ${stepName}: ${text.slice(0, 50)}`);
  }
}

export async function processCheckout(formData: any) {
  try {
    const { locale, contactInfo, billingInfo, cardInfo, items, total } = formData;
    const supabase = await createClient();

    // 1. LOGIN ETOMIN
    const signinData = await safeEtominFetch(`${ETOMIN_BASE_URL}/signin`, {
      method: 'POST',
      headers: getEtominHeaders(),
      body: JSON.stringify({ email: ETOMIN_EMAIL, password: ETOMIN_PASSWORD })
    }, 'Login Etomin');

    if (!signinData.authToken) throw new Error("Falla de autenticación con el procesador.");
    const authToken = signinData.authToken;

    // 2. TOKENIZAR TARJETA
    const tokenData = await safeEtominFetch(`${ETOMIN_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify({
        cardData: {
          cardNumber: cardInfo.number,
          cardholderName: cardInfo.name,
          expirationMonth: cardInfo.expiry.split('/')[0],
          expirationYear: cardInfo.expiry.split('/')[1],
        }
      })
    }, 'Tokenización');

    if (!tokenData.cardNumberToken) throw new Error("Tarjeta no válida.");

    // 3. PROCESAR VENTA
    const salePayload = {
      amount: Number(total.toFixed(2)),
      currency: 484, // MXN
      reference: `NC-${Date.now()}`,
      customerInformation: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone1: contactInfo.phone,
        city: billingInfo.localidad,
        address1: billingInfo.direccion,
        postalCode: billingInfo.codigo_postal,
        state: billingInfo.estado,
        country: 'MX'
      },
      cardData: {
        cardNumberToken: tokenData.cardNumberToken,
        cvv: cardInfo.cvv
      },
      items: items.map((i: any) => ({
        title: i.plans_nc?.title || 'Estrategia Personalizada',
        amount: i.custom_price || i.plans_nc?.price,
        quantity: i.quantity,
        id: i.plan_id.toString()
      }))
    };

    const saleData = await safeEtominFetch(`${ETOMIN_BASE_URL}/sale`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');

    if (saleData.status !== 'APPROVED') {
      throw new Error(saleData.message || "Pago declinado.");
    }

    const { error: dbError } = await supabase.from('bookings_nc').insert({
      customer_email: contactInfo.email,
      total_amount: total,
      transaction_id: saleData.transactionId,
      status: 'paid',
      payload: saleData 
    });

    if (dbError) console.error("Error BD:", dbError);

    // 5. ENVÍO DE EMAIL CON RESEND
    await resend.emails.send({
      from: 'Ninja Creatives <pagos@ninjacreatives.com>',
      to: [contactInfo.email],
      subject: locale === 'es' ? 'Confirmación de tu Estrategia' : 'Strategy Purchase Confirmation',
      html: `<p>¡Hola ${contactInfo.firstName}! Tu pago de ${total} MXN ha sido procesado con éxito.</p>`
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}