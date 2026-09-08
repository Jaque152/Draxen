// src/components/shared/Providers.tsx
'use client';

import { ReactNode } from 'react';
import { CurrencyProvider } from '@/hooks/use-currency'; // Asegúrate de que la ruta sea correcta
import { CartProvider } from '@/hooks/use-cart'; // Asegúrate de que la ruta sea correcta

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </CurrencyProvider>
  );
}