'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { sendReceiptEmail } from '@/lib/mail';

// --- CREDENCIALES KEYCOP ---
const KEYCOP_EMAIL = process.env.KEYCOP_EMAIL!;
const KEYCOP_PASSWORD = process.env.KEYCOP_PASSWORD!;
const KEYCOP_BASE_URL = 'https://pagos.keycop.com.mx/api/v1';

const getKeycopHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': 'https://marketingresultados.com', 
  ...extraHeaders
});

export async function processCheckout(formData: any) {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) throw new Error("Sesión expirada. Recarga la página.");

    // 1. OBTENER ITEMS DEL CARRITO DIRECTO DE LA BD (Seguridad)
    await supabase.rpc('set_session_id', { s_id: sessionId });
    const { data: cartItems } = await supabase
      .from('cart_items_nc')
      .select('*, plans_nc(title, price)');

    if (!cartItems || cartItems.length === 0) throw new Error("El carrito está vacío.");

    // 2. CALCULAR TOTALES (Con IVA incluido)
    let totalEstimado = 0;
    const orderItems = cartItems.map((item) => {
      const unitPrice = item.custom_price !== null ? item.custom_price : item.plans_nc.price;
      totalEstimado += (unitPrice * item.quantity);
      return {
        plan_id: item.plan_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        custom_price: item.custom_price,
        quote_id: item.quote_id,
      };
    });

    const subtotal = totalEstimado / 1.16;
    const impuesto = totalEstimado - subtotal;
    const tempReferenceId = `NC-REF-${Date.now()}`;

    // 3. KEYCOP: LOGIN Y TOKENIZACIÓN
    const signinRes = await fetch(`${KEYCOP_BASE_URL}/signin`, {
      method: 'POST',
      headers: getKeycopHeaders(),
      body: JSON.stringify({ email: KEYCOP_EMAIL, password: KEYCOP_PASSWORD })
    });
    const signinData = await signinRes.json();
    if (!signinData.authToken) throw new Error("Fallo de autenticación Keycop.");

    const tokenRes = await fetch(`${KEYCOP_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getKeycopHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify({
        cardData: {
          cardNumber: formData.cardInfo.number,
          cardholderName: formData.cardInfo.name,
          expirationMonth: formData.cardInfo.expiry.split('/')[0],
          expirationYear: formData.cardInfo.expiry.split('/')[1],
        }
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.cardNumberToken) throw new Error("Tarjeta declinada o inválida.");

    // 4. KEYCOP: PROCESAR VENTA
    const saleRes = await fetch(`${KEYCOP_BASE_URL}/sale`, {
      method: 'POST',
      headers: getKeycopHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify({
        amount: Number(totalEstimado.toFixed(2)),
        currency: 484, // MXN
        reference: tempReferenceId,
        customerInformation: {
          firstName: formData.contactInfo.firstName,
          lastName: formData.contactInfo.lastName || 'NC Cliente',
          email: formData.contactInfo.email,
          phone1: formData.contactInfo.phone,
          city: formData.billingInfo.localidad,
          address1: formData.billingInfo.direccion,
          postalCode: formData.billingInfo.codigo_postal,
          state: formData.billingInfo.estado,
          country: 'MX',
        },
        cardData: {
          cardNumberToken: tokenData.cardNumberToken,
          cvv: formData.cardInfo.cvv
        },
        items: cartItems.map(item => ({
          title: item.plans_nc.title,
          amount: item.custom_price !== null ? item.custom_price : item.plans_nc.price,
          quantity: item.quantity,
          id: item.plan_id.toString()
        }))
      })
    });
    const saleData = await saleRes.json();
    if (saleData.status !== 'APPROVED') throw new Error(saleData.message || "Pago declinado por el banco.");

    // 5. GUARDAR EN SUPABASE
    const { data: checkoutData, error: checkoutError } = await supabase
      .from('checkouts_nc')
      .insert({
        session_id: sessionId,
        nombre: formData.contactInfo.firstName,
        apellidos: formData.contactInfo.lastName || '',
        pais_region: formData.billingInfo.pais,
        direccion_calle: formData.billingInfo.direccion,
        localidad_ciudad: formData.billingInfo.localidad,
        region_estado: formData.billingInfo.estado,
        codigo_postal: formData.billingInfo.codigo_postal,
        telefono: formData.contactInfo.phone,
        correo_electronico: formData.contactInfo.email,
        subtotal: Number(subtotal.toFixed(2)),
        impuesto: Number(impuesto.toFixed(2)),
        total_estimado: Number(totalEstimado.toFixed(2)),
        payment_status: 'paid', // ¡Pagado vía Keycop!
      }).select('id').single();

    if (checkoutError) throw new Error("Error registrando la orden.");

    // Insertar items y vaciar carrito
    await supabase.from('checkout_items_nc').insert(
      orderItems.map(item => ({ ...item, checkout_id: checkoutData.id }))
    );
    await supabase.from('cart_items_nc').delete().eq('session_id', sessionId);

    // 6. ENVIAR RECIBOS POR CORREO
    await sendReceiptEmail(
      { ...formData.contactInfo, total_estimado: totalEstimado, nombre: formData.contactInfo.firstName, correo_electronico: formData.contactInfo.email, telefono: formData.contactInfo.phone },
      cartItems,
      formData.locale === 'en'
    );

    return { success: true };
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { success: false, message: error.message || "Error procesando el pago." };
  }
}