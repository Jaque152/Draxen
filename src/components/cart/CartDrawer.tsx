'use client';

import { useCart } from '@/hooks/use-cart';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItemComponent } from './CartItem';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useCurrency } from '@/hooks/use-currency';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, total } = useCart();
  const locale = useLocale();
  const isEs = locale === 'es';
  const { formatPrice, isLoading, currency, toggleCurrency } = useCurrency();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay oscuro para contrastar con el panel claro */}
      <div 
        className="absolute inset-0 bg-[var(--accent-dark)]/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* Panel lateral: Glassmorphism Ultra Claro */}
      <div className="relative w-full max-w-md glass-panel bg-white/90 h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col border-l border-white/50">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--text-main)]/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)]/10 flex items-center justify-center">
              <ShoppingBag className="text-[var(--accent-purple)] w-5 h-5" />
            </div>
            {isEs ? 'Tu Carrito' : 'Your Cart'}
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-[var(--text-main)]/50 hover:text-[var(--accent-magenta)] transition-colors p-2 bg-white/50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center text-[var(--accent-cyan)] shadow-inner">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <p className="text-[var(--text-main)]/60 font-medium text-lg">
                {isEs ? 'Aún no has seleccionado ninguna estrategia.' : 'You haven\'t selected any strategy yet.'}
              </p>
            </div>
          ) : (
            items.map((item) => <CartItemComponent key={item.id} item={item} />)
          )}
        </div>
        {/* Footer del Drawer */}
        {items.length > 0 && (
          <div className="p-6 sm:p-8 border-t border-[var(--text-main)]/10 bg-white/50 backdrop-blur-md">
            
            {/* NUEVO CONTENEDOR: Moneda y Total */}
            <div className="flex flex-row justify-between items-end mb-8 font-sans">
              
              {/* Selector de Moneda (Segmented Control) */}
              <div className="flex flex-col gap-2">
                <span className="text-[var(--text-main)]/50 text-[10px] font-bold uppercase tracking-widest">
                  {isEs ? 'Moneda' : 'Currency'}
                </span>
                <div className="flex items-center bg-black/5 p-1 rounded-xl border border-[var(--text-main)]/10">
                  <button
                    type="button"
                    onClick={() => currency !== 'MXN' && toggleCurrency()}
                    className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${
                      currency === 'MXN' 
                        ? 'bg-white text-[var(--accent-dark)] shadow-sm' 
                        : 'text-[var(--text-main)]/40 hover:text-[var(--text-main)]/70'
                    }`}
                  >
                    MXN
                  </button>
                  <button
                    type="button"
                    onClick={() => currency !== 'USD' && toggleCurrency()}
                    className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${
                      currency === 'USD' 
                        ? 'bg-white text-[var(--accent-dark)] shadow-sm' 
                        : 'text-[var(--text-main)]/40 hover:text-[var(--text-main)]/70'
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>

              {/* Total Final */}
              <div className="text-right">
                  <span className="text-[var(--text-main)]/60 text-xs sm:text-sm font-bold uppercase tracking-widest block mb-1">
                    {isEs ? 'Total de Inversión' : 'Total Investment'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-gradient-pop block">
                    {isLoading ? '...' : formatPrice(total * 1.16)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[var(--text-main)]/50 font-bold uppercase tracking-tighter">
                    {isEs ? 'Subtotal + 16% de IVA' : 'Subtotal + 16% VAT'}
                  </span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full h-14 rounded-xl font-bold border border-[var(--accent-purple)]/30 bg-white/50 text-[var(--accent-purple)] hover:bg-white transition-all p-0 shadow-sm">
                <Link href={`/${locale}/cart`} onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full h-full">
                  {isEs ? 'Ver carrito completo' : 'View full cart'}
                </Link>
              </Button>

              <Button asChild className="w-full bg-[var(--accent-dark)] hover:scale-105 text-white h-14 rounded-xl shadow-xl shadow-[var(--accent-dark)]/20 transition-all p-0 group">
                <Link href={`/${locale}/checkout`} onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full h-full font-bold text-lg">
                  {isEs ? 'Continuar al Checkout' : 'Proceed to Checkout'} 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}