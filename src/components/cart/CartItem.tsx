'use client';

import { useTransition } from 'react';
import { CartItem } from '@/types';
import { updateQuantity, removeFromCart } from '@/actions/cart';
import { useCart } from '@/hooks/use-cart';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

export function CartItemComponent({ item }: { item: CartItem }) {
  const { refreshCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const isEs = locale === 'es';

  const price = item.custom_price !== null ? item.custom_price : (item.plans_nc?.price || 0);
  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);

  const handleUpdateQty = (newQty: number) => {
    if (newQty < 1) return;
    startTransition(async () => {
      await updateQuantity(item.id, newQty);
      await refreshCart(); 
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCart(item.id);
      await refreshCart();
    });
  };

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border bg-background relative overflow-hidden group transition-all hover:border-primary/50">
      
      {isPending && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}

      <div className="flex-1 flex flex-col justify-between">
        <div className="pr-6">
          <h4 className="font-serif text-lg font-bold text-foreground leading-tight">
            {/* VUELVE A LA NORMALIDAD: Muestra el título real o el fallback */}
            {item.plans_nc?.title || (isEs ? 'Estrategia Personalizada' : 'Custom Strategy')}
          </h4>
          
          {item.quote_id && (
            <p className="text-xs text-primary font-sans mt-1 uppercase tracking-wider">
              {isEs ? 'Folio:' : 'Ref:'} {item.quote_id}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 bg-muted rounded-full p-1 border border-border">
            <button
              onClick={() => handleUpdateQty(item.quantity - 1)}
              disabled={item.quantity <= 1 || isPending}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus className="w-3 h-3" />
            </button>
            
            <span className="font-sans text-sm font-bold text-foreground w-4 text-center">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleUpdateQty(item.quantity + 1)}
              disabled={isPending}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <div className="font-sans text-lg font-bold text-foreground">
              {formatPrice(price * item.quantity)}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleRemove}
        disabled={isPending}
        title={isEs ? "Eliminar" : "Remove"}
        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}