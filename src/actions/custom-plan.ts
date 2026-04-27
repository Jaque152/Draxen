'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

interface CustomPlanData {
  nombre: string;
  apellidos: string;
  correo_electronico: string;
  id_cotizacion: string;
  monto_a_pagar: number;
}

export async function processCustomPlan(data: CustomPlanData) {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) return { success: false, error: 'Sesión inválida o expirada.' };

    // Setear el contexto de seguridad en BD
    await supabase.rpc('set_session_id', { s_id: sessionId });

    // 1. Guardamos el registro EXACTAMENTE como lo pide tu tabla
    const { error: customError } = await supabase
      .from('custom_plan_payments_nc')
      .insert({
        nombre: data.nombre,
        apellidos: data.apellidos,
        correo_electronico: data.correo_electronico,
        id_cotizacion: data.id_cotizacion,
        monto_a_pagar: data.monto_a_pagar,
        payment_status: 'pending' // Valor por default de tu BD
      });

    if (customError) {
      console.error("Error en custom_plan_payments_nc:", customError);
      return { success: false, error: 'No se pudo registrar la cotización.' };
    }

    // 2. Buscamos el ID del "Plan Personalizado" base que insertamos en SQL (precio 0)
    const { data: planBase } = await supabase
      .from('plans_nc')
      .select('id')
      .eq('slug', 'plan-personalizado')
      .single();

    // 3. Lo inyectamos al carrito para unificar el flujo de pago
    if (planBase) {
      await supabase.from('cart_items_nc').insert({
        session_id: sessionId,
        plan_id: planBase.id,
        quantity: 1,
        custom_price: data.monto_a_pagar, // Sobrescribe el precio 0
        quote_id: data.id_cotizacion      // Guarda la referencia
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error interno del servidor.' };
  }
}