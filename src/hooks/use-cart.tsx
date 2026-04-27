'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CartItem } from '@/types'; // Confirma que la ruta a tus tipos es correcta

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const supabase = createClient();
  const refreshCart = useCallback(async () => {
    const { data, error } = await supabase
      .from('cart_items_nc')
      .select('*, plans_nc(*)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error al obtener el carrito:", error);
      return;
    }

    setItems((data as unknown as CartItem[]) || []);
  }, [supabase]);

  const clearCart = useCallback(() => {
    setItems([]); 
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = item.custom_price !== null 
        ? Number(item.custom_price) 
        : Number(item.plans_nc?.price || 0);
        
      return acc + (price * item.quantity);
    }, 0);
  }, [items]);

  const value = useMemo<CartContextType>(() => ({
    items,
    isOpen,
    setIsOpen,
    refreshCart,
    clearCart,
    total
  }), [items, isOpen, refreshCart, clearCart, total]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse estrictamente dentro de un CartProvider');
  }
  return context;
};