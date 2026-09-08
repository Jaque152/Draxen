"use client";

import { CartDrawer } from '@/components/cart/CartDrawer';

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartDrawer />
      {children}
    </>
  );
}