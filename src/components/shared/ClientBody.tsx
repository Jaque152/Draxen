"use client";
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/hooks/use-cart';

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CartDrawer />
      {children}
    </CartProvider>
  );
}