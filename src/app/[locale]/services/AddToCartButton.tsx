'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

// CORRECCIÓN: planId ahora es de tipo string (UUID)
export function AddToCartButton({ planId }: { planId: string }) {
  const { addToCart } = useCart();
  const [isPending, setIsPending] = useState(false);
  const locale = useLocale();
  const isEs = locale === 'es';

  const handleAdd = async () => {
    setIsPending(true);
    // Ahora coinciden los tipos perfectamente
    await addToCart(planId);
    setIsPending(false);
  };

  return (
    <Button 
      onClick={handleAdd} 
      disabled={isPending}
      className="bg-[var(--accent-dark)] hover:scale-105 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-xl hover:shadow-[var(--accent-dark)]/20 transition-all flex items-center gap-2"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      {isEs ? 'Añadir al carrito' : 'Add to cart'}
    </Button>
  );
}