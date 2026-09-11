'use server';
import { CheckoutPayload } from '@/types';
import { sendReceiptEmail } from '@/lib/mail';
import { plans } from '@/data/plans';

// Definimos un tipo local para que coincida con lo enviado desde el frontend
interface CheckoutItem {
  plan_id: string;
  quantity: number;
  custom_price: number | null;
  quote_id: string | null;
}

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[CRÍTICO] Variable de entorno faltante: ${name}`);
    throw new Error(`Error de configuración en el servidor.`);
  }
  return value;
}

const getEtominHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Draxen Digital Recursos/1.0',
  ...extraHeaders
});

async function safeEtominFetch(url: string, options: RequestInit, stepName: string) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    
    if (!res.ok) console.warn(`⚠️ [Etomin] Código HTTP ${res.status} en ${stepName}`);

    try {
      return JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Error ${res.status}: La ruta de pago es incorrecta o está bloqueada.`);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Falla de red en: ${stepName}.`);
  }
}

export async function processCheckout(formData: CheckoutPayload) {
  try {
    const { locale, contactInfo, billingInfo, cardInfo, items, total, currency = 'MXN', exchangeRate = 1 } = formData;
    
    const ETOMIN_BASE_URL = requireEnvVar('ETOMIN_BASE_URL');
    const ETOMIN_EMAIL = requireEnvVar('ETOMIN_EMAIL');
    const ETOMIN_PASSWORD = requireEnvVar('ETOMIN_PASSWORD');

    // 1. LOGIN EN ETOMIN
    const signinData = await safeEtominFetch(`${ETOMIN_BASE_URL}/signin`, {
      method: 'POST',
      headers: getEtominHeaders(),
      body: JSON.stringify({ email: ETOMIN_EMAIL, password: ETOMIN_PASSWORD })
    }, 'Login Etomin');

    if (!signinData.authToken) throw new Error("Credenciales del procesador rechazadas.");
    
    // 2. TOKENIZAR TARJETA
    const tokenData = await safeEtominFetch(`${ETOMIN_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify({
        cardData: {
          cardNumber: cardInfo.number,
          cardholderName: cardInfo.name,
          expirationMonth: cardInfo.expiry.split('/')[0],
          expirationYear: cardInfo.expiry.split('/')[1],
        }
      })
    }, 'Tokenización');

    if (!tokenData.cardNumberToken) throw new Error("Tarjeta declinada o inválida.");

    // 3. VENTA Y CONVERSIÓN DE DIVISAS
    const subtotalCalc = total; 
    const impuestoCalc = subtotalCalc * 0.16;
    const totalFinalMXN = subtotalCalc + impuestoCalc;
    
    const isUsd = currency === 'USD';
    const etominCurrencyCode = isUsd ? 840 : 484;
    const amountToCharge = isUsd && exchangeRate > 1 
      ? Number((totalFinalMXN / exchangeRate).toFixed(2)) 
      : Number(totalFinalMXN.toFixed(2));

    const orderReferenceId = `DX-${Date.now()}`; // Creamos un ID de orden propio

    const salePayload = {
      amount: amountToCharge,
      currency: etominCurrencyCode,
      reference: orderReferenceId, 
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
      items: items.map((i: CheckoutItem) => {
        // BUSCAMOS LOS DATOS EN EL DICCIONARIO
        const plan = plans.find(p => p.id === i.plan_id);
        const basePrice = i.custom_price !== null ? i.custom_price : (plan?.price || 0);
        const itemPrice = isUsd && exchangeRate > 1 ? basePrice / exchangeRate : basePrice;
        
        return {
          title: plan ? plan.en.title : 'Custom Plan', // Etomin procesa mejor en EN
          amount: Number(itemPrice.toFixed(2)),
          quantity: i.quantity,
          id: i.plan_id 
        };
      })
    };

    const saleData = await safeEtominFetch(`${ETOMIN_BASE_URL}/sale`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');

    if (saleData.status !== 'APPROVED') {
      const reason = saleData.message || saleData.responseCode || "Transacción declinada.";
      throw new Error(`El banco rechazó el pago: ${reason}`);
    }

    // 4. CREAMOS UN REGISTRO EN MEMORIA PARA EL CORREO
    const mockCheckoutRecord = {
      id: orderReferenceId,
      nombre: contactInfo.firstName,
      apellidos: contactInfo.lastName,
      correo_electronico: contactInfo.email,
      telefono: contactInfo.phone,
      subtotal: subtotalCalc,
      impuesto: impuestoCalc,
      total_estimado: totalFinalMXN
    };

    // 5. ENVIAR CORREOS
    await sendReceiptEmail(mockCheckoutRecord, items, locale === 'en', currency, exchangeRate);

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado.";
    return { success: false, message: errorMessage };
  }
}