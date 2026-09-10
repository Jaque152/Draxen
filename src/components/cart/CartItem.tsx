'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCart, LocalCartItem } from '@/hooks/use-cart'; // Extraemos de nuestro hook
import { plans } from '@/data/plans'; // Importamos para obtener título
import { useCurrency } from '@/hooks/use-currency';

interface CartItemProps {
  item: LocalCartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const locale = useLocale();
  const isEs = locale === 'es';

  // Obtenemos los datos del diccionario
  const planDict = plans.find(p => p.id === item.plan_id);
  const title = planDict ? (isEs ? planDict.es.title : planDict.en.title) : 'Custom Plan';
  const price = item.custom_price !== null ? item.custom_price : (planDict?.price || 0);

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--text-main)]/10">
      <div className="flex-1">
        <h4 className="font-bold text-[var(--text-main)] mb-1">
          {title}
          {item.quote_id && (
            <span className="block text-xs font-normal text-[var(--accent-cyan)] opacity-80 mt-1">
              Ref: {item.quote_id}
            </span>
          )}
        </h4>
        <div className="text-[var(--accent-magenta)] font-bold">
          {formatPrice(price)}
        </div>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border border-[var(--text-main)]/20 rounded-lg">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 hover:text-[var(--accent-cyan)] transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 hover:text-[var(--accent-cyan)] transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-[var(--text-main)]/50 hover:text-red-500 transition-colors p-2"
            aria-label="Eliminar item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}