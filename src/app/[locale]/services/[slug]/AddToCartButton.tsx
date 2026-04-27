"use client";

import { useTransition } from "react";
import { useCart } from "@/hooks/use-cart";
import { addToCart } from "@/actions/cart";
import { Loader2, ShoppingBag } from "lucide-react";
import { useLocale } from "next-intl";

export function AddToCartButton({ planId }: { planId: number }) {
  const { refreshCart, setIsOpen } = useCart();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const handleAdd = () => {
    startTransition(async () => {
      // 1. Llamamos a la Server Action
      const res = await addToCart(planId);
      
      if (res.success) {
        // 2. Refrescamos el contexto global
        await refreshCart();
        // 3. Abrimos el cajón del carrito
        setIsOpen(true);
      } else {
        alert(res.error || "Hubo un problema al añadir el plan.");
      }
    });
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isPending}
      className="w-full relative overflow-hidden h-16 rounded-xl bg-gradient-to-r from-[var(--copper)] to-[var(--amber)] text-[var(--navy)] font-bold text-lg group flex items-center justify-center transition-transform active:scale-95 disabled:opacity-70"
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      <span className="relative z-10 flex items-center gap-3 font-sans uppercase tracking-widest">
        {isPending ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <ShoppingBag className="w-6 h-6" />
            {locale === 'es' ? 'Añadir al carrito' : 'Add to strategy'}
          </>
        )}
      </span>
    </button>
  );
}