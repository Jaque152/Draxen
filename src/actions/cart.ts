'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function addToCart(planId: number, customPrice?: number, quoteId?: string) {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) return { error: 'Sesión no válida' };

  // Avisamos a la BD quién es el usuario para el RLS
  await supabase.rpc('set_session_id', { s_id: sessionId });

  // Verificamos si el item ya existe en el carrito
  const { data: existingItem } = await supabase
    .from('cart_items_nc')
    .select('id, quantity')
    .eq('plan_id', planId)
    .eq('session_id', sessionId)
    .maybeSingle();

  if (existingItem && !customPrice) {
    // Si ya existe y es un plan normal, aumentamos cantidad
    await supabase
      .from('cart_items_nc')
      .update({ quantity: existingItem.quantity + 1 })
      .eq('id', existingItem.id);
  } else {
    // Si es nuevo o es un plan personalizado, creamos registro nuevo
    await supabase.from('cart_items_nc').insert({
      plan_id: planId,
      session_id: sessionId,
      quantity: 1,
      custom_price: customPrice || null,
      quote_id: quoteId || null
    });
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function removeFromCart(itemId: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('cart_items_nc').delete().eq('id', itemId);
  
  revalidatePath('/', 'layout');
  return { success: !error };
}

export async function updateQuantity(itemId: number, quantity: number) {
  if (quantity < 1) return removeFromCart(itemId);
  
  const supabase = await createClient();
  await supabase.from('cart_items_nc').update({ quantity }).eq('id', itemId);
  
  revalidatePath('/', 'layout');
}