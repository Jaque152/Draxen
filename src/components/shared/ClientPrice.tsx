'use client';

import { useCurrency } from '@/hooks/use-currency'; 

export function ClientPrice({ amount }: { amount: number }) {
  const { formatPrice, isLoading } = useCurrency();

  if (isLoading) {
    return <span className="animate-pulse opacity-50">...</span>;
  }

  return <>{formatPrice(amount)}</>;
}