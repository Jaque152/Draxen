'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { plans } from '@/data/plans'; 

export interface LocalCartItem {
  id: string; 
  plan_id: string; 
  quantity: number;
  custom_price: number | null;
  quote_id: string | null;
}

interface CartContextType {
  items: LocalCartItem[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clearCart: () => void;
  total: number;
  addToCart: (planId: string, quantity?: number, customPrice?: number | null, quoteId?: string | null) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void; // NUEVA FUNCIÓN
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'dx_local_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error leyendo el carrito local:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = useCallback((planId: string, quantity: number = 1, customPrice: number | null = null, quoteId: string | null = null) => {
    setItems((prev) => {
      // 1. Buscamos coincidencia EXACTA (mismo servicio, mismo precio, misma cotización)
      const existingItemIndex = prev.findIndex(
        item => item.plan_id === planId && 
                item.custom_price === customPrice && 
                item.quote_id === quoteId
      );

      if (existingItemIndex >= 0) {
        // 2. CREACIÓN INMUTABLE: Clonamos el arreglo y el objeto específico para forzar el re-render de React
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        return newItems;
      }

      // 3. Si no existe, agregamos el nuevo item
      const newItem: LocalCartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        plan_id: planId,
        quantity,
        custom_price: customPrice,
        quote_id: quoteId
      };
      
      return [newItem, ...prev];
    });
    
    setIsOpen(true);
    return true;
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter(item => item.id !== cartItemId));
  }, []);

  // NUEVA LÓGICA PARA ACTUALIZAR CANTIDAD EN MEMORIA
  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) => prev.map(item => 
      item.id === cartItemId ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]); 
  }, []);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const dictionaryPlan = plans.find(p => p.id === item.plan_id);
      const price = item.custom_price !== null 
        ? Number(item.custom_price) 
        : Number(dictionaryPlan?.price || 0);
        
      return acc + (price * item.quantity);
    }, 0);
  }, [items]);

  const value = useMemo<CartContextType>(() => ({
    items,
    isOpen,
    setIsOpen,
    clearCart,
    total,
    addToCart,
    removeFromCart,
    updateQuantity // EXPORTAMOS LA FUNCIÓN
  }), [items, isOpen, clearCart, total, addToCart, removeFromCart, updateQuantity]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse estrictamente dentro de un CartProvider');
  }
  return context;
};