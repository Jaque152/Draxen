'use server';
import { CheckoutPayload, CartItem, Checkout } from '@/types';
import { createClient } from '@supabase/supabase-js'; 
import { sendReceiptEmail } from '@/lib/mail';

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
    // 1. Extraemos currency y exchangeRate 
    const { locale, contactInfo, billingInfo, cardInfo, items, total, currency = 'MXN', exchangeRate = 1 } = formData;
    
    const supabaseAdmin = createClient(
      requireEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnvVar('SUPABASE_SERVICE_ROLE_KEY')
    );

    const ETOMIN_BASE_URL = requireEnvVar('ETOMIN_BASE_URL');
    const ETOMIN_EMAIL = requireEnvVar('ETOMIN_EMAIL');
    const ETOMIN_PASSWORD = requireEnvVar('ETOMIN_PASSWORD');

    // 1. LOGIN
    const signinData = await safeEtominFetch(`${ETOMIN_BASE_URL}/signin`, {
      method: 'POST',
      headers: getEtominHeaders(),
      body: JSON.stringify({ email: ETOMIN_EMAIL, password: ETOMIN_PASSWORD })
    }, 'Login Etomin');

    if (!signinData.authToken) throw new Error("Credenciales del procesador rechazadas.");
    
    // 2. TOKENIZAR
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
    const subtotalCalc = total; // Valor base en MXN
    const impuestoCalc = subtotalCalc * 0.16;
    const totalFinalMXN = subtotalCalc + impuestoCalc;
    
    const isUsd = currency === 'USD';
    const etominCurrencyCode = isUsd ? 840 : 484;

    // Calculamos el monto a cobrar en la pasarela en la moneda exacta
    const amountToCharge = isUsd && exchangeRate > 1 
      ? Number((totalFinalMXN / exchangeRate).toFixed(2)) 
      : Number(totalFinalMXN.toFixed(2));

    const salePayload = {
      amount: amountToCharge,
      currency: etominCurrencyCode, // Código de moneda dinámico
      reference: `DX-${Date.now()}`, 
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
      items: items.map((i: CartItem) => {
        // También convertimos el precio individual para que el desglose de Etomin cuadre
        const basePrice = i.custom_price !== null ? i.custom_price : (i.cb_plans?.price || 0);
        const itemPrice = isUsd && exchangeRate > 1 ? basePrice / exchangeRate : basePrice;
        
        return {
          title: i.cb_plans?.title || 'Estrategia Personalizada',
          amount: Number(itemPrice.toFixed(2)),
          quantity: i.quantity,
          id: i.plan_id.toString() 
        };
      })
    };

    const saleData = await safeEtominFetch(`${ETOMIN_BASE_URL}/sale`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');

    if (saleData.status !== 'APPROVED') {
      console.error("\n❌ [ERROR DE ETOMIN DETALLADO]:", JSON.stringify(saleData, null, 2), "\n");
      const reason = saleData.message || saleData.responseCode || "Transacción declinada.";
      throw new Error(`El banco rechazó el pago: ${reason}`);
    }

    // 4. GUARDAR EN BD (Guardamos en MXN como divisa base contable)
    const { data: checkoutRecord, error: dbError } = await supabaseAdmin
      .from('cb_orders')
      .insert({
        nombre: contactInfo.firstName,
        apellidos: contactInfo.lastName,
        pais_region: billingInfo.pais,
        direccion_calle: billingInfo.direccion,
        localidad_ciudad: billingInfo.localidad,
        region_estado: billingInfo.estado,
        codigo_postal: billingInfo.codigo_postal,
        telefono: contactInfo.phone,
        correo_electronico: contactInfo.email,
        subtotal: subtotalCalc,
        impuesto: impuestoCalc,
        total_estimado: totalFinalMXN,
        status: 'paid'
      })
      .select()
      .single();

    if (dbError || !checkoutRecord) {
      console.error("[CRÍTICO] Detalle del error al insertar Checkout:", dbError);
      throw new Error("Pago exitoso, pero falló la generación del recibo.");
    }

    // 5. GUARDAR ITEMS
    const checkoutItems = items.map((item: CartItem) => ({
      order_id: checkoutRecord.id,
      plan_id: item.plan_id,
      quantity: item.quantity,
      custom_price: item.custom_price,
      quote_id: item.quote_id
    }));

    const { error: itemsError } = await supabaseAdmin.from('cb_order_items').insert(checkoutItems);
    if (itemsError) console.error("[CRÍTICO] Detalle del error en Items:", itemsError);

    // 6. ENVIAR CORREO (Pasamos los datos de la divisa para que el correo se envíe visualmente en USD/MXN)
    await sendReceiptEmail(checkoutRecord as Checkout, items, locale === 'en', currency, exchangeRate);

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado.";
    return { success: false, message: errorMessage };
  }
}