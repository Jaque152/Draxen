"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';
import { useCurrency } from '@/hooks/use-currency';

export default function CartPage() {
  const { items, total, removeFromCart } = useCart();
  const locale = useLocale();
  const isEs = locale === 'es';
  const { formatPrice, isLoading } = useCurrency();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-mesh pt-32 pb-24 flex items-center justify-center px-4 relative">
        <div className="text-center relative z-10 max-w-md mx-auto glass-panel p-12 rounded-3xl">
          <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[var(--accent-purple)]" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-[var(--text-main)]">
            {isEs ? 'Tu carrito está vacío' : 'Your cart is empty'}
          </h1>
          <p className="text-[var(--text-main)]/60 mb-8 font-medium">
            {isEs 
              ? 'Parece que aún no has seleccionado ninguna estrategia para potenciar tu marca.' 
              : 'It looks like you haven\'t selected any strategy to boost your brand yet.'}
          </p>
          <Button asChild className="w-full bg-[var(--accent-dark)] hover:opacity-90 text-white h-14 rounded-xl font-bold shadow-lg">
            <Link href={`/${locale}/services`}>
              {isEs ? 'Explorar Catálogo' : 'Explore Catalog'}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mesh pt-32 pb-24 text-[var(--text-main)] relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-[var(--text-main)] tracking-tight">
          {isEs ? 'Tu Carrito' : 'Your Cart'}
        </h1>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel rounded-3xl overflow-hidden shadow-xl border-white/60">
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-[var(--text-main)]/10 text-sm font-bold text-[var(--text-main)]/50 uppercase tracking-wider">
                <div className="col-span-6">{isEs ? 'Servicio' : 'Service'}</div>
                <div className="col-span-2 text-center">{isEs ? 'Cantidad' : 'Quantity'}</div>
                <div className="col-span-3 text-right">{isEs ? 'Precio' : 'Price'}</div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y divide-[var(--text-main)]/10">
                {items.map((item: CartItem) => {
                  const itemPrice = item.custom_price !== null 
                    ? Number(item.custom_price) 
                    : Number(item.cb_plans?.price || 0);  
                  return (
                    <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-white/30 transition-colors">
                      <div className="col-span-1 md:col-span-6">
                        <h3 className="...">
                          {item.cb_plans?.title || (isEs ? 'Estrategia Personalizada' : 'Custom Strategy')}
                        </h3> 
                        {item.quote_id && (
                          <span className="inline-block bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] text-xs px-2 py-1 rounded-md font-mono font-bold mt-1">
                            Ref: {item.quote_id}
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-2 md:text-center text-[var(--text-main)]/60 font-medium">
                        <span className="md:hidden font-bold mr-2 text-[var(--text-main)]">{isEs ? 'Cantidad:' : 'Quantity:'}</span> 
                        {item.quantity}
                      </div>

                      <div className="col-span-1 md:col-span-3 md:text-right font-bold text-lg text-[var(--text-main)]">
                        <span className="md:hidden font-bold text-[var(--text-main)]/60 font-medium mr-2">{isEs ? 'Precio:' : 'Price:'}</span>
                        {isLoading ? '...' : formatPrice(itemPrice * item.quantity)}
                      </div>

                      <div className="col-span-1 md:col-span-1 flex md:justify-end mt-4 md:mt-0">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[var(--text-main)]/40 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                          title={isEs ? 'Eliminar del carrito' : 'Remove from cart'}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 glass-panel p-8 border border-white/60 rounded-3xl shadow-xl sticky top-32">
            <h2 className="text-xl font-bold mb-6 border-b border-[var(--text-main)]/10 pb-4">
              {isEs ? 'Resumen del Pedido' : 'Order Summary'}
            </h2>
            
            <div className="space-y-4 mb-6 font-medium">
              <div className="flex justify-between items-center text-[var(--text-main)]/60">
                <span>Subtotal</span>
                <span>{isLoading ? '...' : formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-main)]/60">
                <span>{isEs ? 'IVA (16%)' : 'Tax (16%)'}</span>
                <span>{isLoading ? '...' : formatPrice(total * 0.16)}</span>
              </div>
              <div className="border-t border-[var(--text-main)]/10 pt-4 mt-4 flex justify-between items-center text-xl font-bold text-gradient-pop">
                <span>{isEs ? 'Total Final' : 'Final Total'}</span>
                <span>{isLoading ? '...' : formatPrice(total * 1.16)}</span>
              </div>
            </div>
            
            <Button asChild
              className="w-full bg-[var(--accent-dark)] hover:scale-105 text-white font-bold h-14 rounded-xl text-lg group transition-all p-0 shadow-lg" >
              <Link href={`/${locale}/checkout`} className="flex items-center justify-center w-full h-full">
                {isEs ? 'Proceder al Pago' : 'Proceed to Checkout'} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <div className="mt-6 text-center">
              <Link href={`/${locale}/services`} className="text-sm font-semibold text-[var(--text-main)]/50 hover:text-[var(--accent-magenta)] transition-colors">
                {isEs ? 'Continuar explorando el catálogo' : 'Continue exploring catalog'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}