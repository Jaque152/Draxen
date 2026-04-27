"use client";

import { useCart } from "@/hooks/use-cart";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { CartItemComponent } from "@/components/cart/CartItem";

export default function CartPage() {
  const { items, total } = useCart();
  const locale = useLocale();

  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);

  return (
    <main className="min-h-screen bg-[var(--navy)] bg-grain pt-32 pb-24 text-[var(--cream)] relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl relative z-10">
        
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-12 flex items-center gap-4">
          <ShoppingBag className="w-10 h-10 text-[var(--copper)]" />
          Tu Carrito
        </h1>

        {items.length === 0 ? (
          <div className="bg-[var(--charcoal)] border border-[var(--copper)]/10 rounded-2xl p-16 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4 font-serif">Tu carrito está vacío</h2>
            <p className="text-[var(--cream)]/60 font-sans mb-8">Descubre nuestras estrategias y lleva tu marca al siguiente nivel.</p>
            <Button asChild className="bg-[var(--copper)] hover:bg-[var(--amber)] text-[var(--navy)] font-bold px-8 h-12 rounded-lg transition-all">
              <Link href={`/${locale}/services`}>Ver Estrategias</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>

            <div className="lg:col-span-1 bg-[var(--charcoal)] border border-[var(--copper)]/20 rounded-2xl p-8 sticky top-32 shadow-xl">
              <h3 className="text-xl font-bold font-serif mb-6 border-b border-[var(--copper)]/10 pb-4">Resumen</h3>
              
              <div className="space-y-4 mb-8 font-sans">
                <div className="flex justify-between items-center text-[var(--cream)]/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(total / 1.16)}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--cream)]/60">
                  <span>IVA (16%)</span>
                  <span>{formatPrice(total - (total / 1.16))}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-gradient mt-4 pt-4 border-t border-[var(--copper)]/10">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-[var(--copper)] to-[var(--amber)] text-[var(--navy)] font-bold h-14 rounded-lg group transition-all hover:opacity-90">
                <Link href={`/${locale}/checkout`}>
                  Proceder al Pago
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}