'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { getTipoCambioDolar } from '@/lib/dollar';

interface CurrencyContextType {
    currency: 'MXN' | 'USD';
    exchangeRate: number;
    isLoading: boolean;
    convertPrice: (amountInMXN: number) => number;
    formatPrice: (amountInMXN: number) => string;
    toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
const CACHE_DURATION = 4 * 60 * 60 * 1000;
const CACHE_KEY = 'banxico_exchange_rate';

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const locale = useLocale();
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currency, setCurrency] = useState<'MXN' | 'USD'>(locale === 'en' ? 'USD' : 'MXN');

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { rate, timestamp } = JSON.parse(cachedData);
                    if (Date.now() - timestamp < CACHE_DURATION) {
                        setExchangeRate(rate);
                        setIsLoading(false);
                        return;
                    }
                }
                
                setIsLoading(true);
                const { tipoDeCambio } = await getTipoCambioDolar();
                const validRate = tipoDeCambio > 0 ? tipoDeCambio : 1;
                
                setExchangeRate(validRate);
                localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: validRate, timestamp: Date.now() }));
            } catch (error) {
                const staleCache = localStorage.getItem(CACHE_KEY);
                setExchangeRate(staleCache ? JSON.parse(staleCache).rate : 1);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRate();
    }, []);
    const toggleCurrency = () => {
        setCurrency((prev) => (prev === 'MXN' ? 'USD' : 'MXN'));
    };

    const convertPrice = (amount: number) => (currency === 'USD' && exchangeRate > 1) ? amount / exchangeRate : amount;

    const formatPrice = (amount: number) => {
        const finalAmount = convertPrice(amount);
        const isUsd = currency === 'USD';
        const formatted = new Intl.NumberFormat(isUsd ? 'en-US' : 'es-MX', {
            style: 'currency', currency: isUsd ? 'USD' : 'MXN', minimumFractionDigits: 2
        }).format(finalAmount);
        return `${formatted} ${currency}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, exchangeRate, isLoading, convertPrice, formatPrice, toggleCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('Debe usarse dentro de CurrencyProvider');
    return context;
};