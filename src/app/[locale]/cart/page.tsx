'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useCurrency } from '@/hooks/use-currency';
import { plans } from '@/data/plans';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { formatPrice } = useCurrency();
  const locale = useLocale();
  const isEs = locale === 'es';

  const subtotal = total;
  const tax = subtotal * 0.16;
  const finalTotal = subtotal + tax;

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center">
        <div className="bg-white p-12 rounded-[2rem] text-center max-w-lg shadow-sm w-full">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{isEs ? 'Tu carrito está vacío' : 'Your cart is empty'}</h1>
          <p className="text-gray-500 mb-8">
            {isEs 
              ? 'Aún no has seleccionado ningún sistema.' 
              : 'You haven\'t selected any system yet.'}
          </p>
          <Link 
            href={`/${locale}/services`}
            className="inline-flex items-center justify-center gap-2 bg-[#0a0f2c] text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors"
          >
            {isEs ? 'Explorar Catálogo' : 'Explore Catalog'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-900 tracking-tight">
          {isEs ? 'Tu Carrito' : 'Your Cart'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: TARJETA DE PRODUCTOS */}
          <div className="w-full lg:w-[65%] bg-white rounded-[2rem] p-8 shadow-sm">
            
            {/* Encabezados de tabla */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-900">
              <div className="col-span-6">{isEs ? 'Service' : 'Service'}</div>
              <div className="col-span-3 text-center">{isEs ? 'Quantity' : 'Quantity'}</div>
              <div className="col-span-3 text-right pr-10">{isEs ? 'Price' : 'Price'}</div>
            </div>

            {/* Items del Carrito */}
            <div className="flex flex-col">
              {items.map((item) => {
                const planDict = plans.find(p => p.id === item.plan_id);
                const title = planDict 
                  ? (isEs ? planDict.es.title : planDict.en.title) 
                  : (isEs ? 'Estrategia Personalizada' : 'Custom Strategy');
                const price = item.custom_price !== null ? item.custom_price : (planDict?.price || 0);

                return (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-100 last:border-0">
                    
                    {/* Título */}
                    <div className="col-span-1 md:col-span-6">
                      <h3 className="font-semibold text-gray-900 text-[15px]">{title}</h3>
                      {item.quote_id && (
                        <span className="text-xs text-gray-500 font-medium mt-1 block">
                          Ref: {item.quote_id}
                        </span>
                      )}
                      {/* Precio móvil */}
                      <div className="md:hidden text-gray-900 font-bold mt-2 text-sm">
                        {formatPrice(price)}
                      </div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-gray-900 transition-colors text-xl font-medium px-2"
                        >
                          −
                        </button>
                        <span className="w-4 text-center font-semibold text-gray-900 text-[15px]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-gray-900 transition-colors text-xl font-medium px-2"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Precio Total y Basurero */}
                    <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-6">
                      <span className="hidden md:block font-bold text-gray-900 text-[15px]">
                        {formatPrice(price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN DE ORDEN */}
          <div className="w-full lg:w-[35%] bg-white rounded-[2rem] p-8 shadow-sm lg:sticky lg:top-32">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{isEs ? 'Resumen de Orden' : 'Order Summary'}</h2>
            
            <div className="space-y-4 text-[15px] text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEs ? 'Impuestos (16%)' : 'Tax (16%)'}</span>
                <span className="font-semibold text-gray-900">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-[17px] text-gray-900">{isEs ? 'Total Final' : 'Final Total'}</span>
                <span className="text-[22px] font-black text-[#c026d3]"> {/* Color magenta/púrpura original */}
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <Link 
              href={`/${locale}/checkout`}
              className="w-full flex items-center justify-center gap-2 bg-[#0a0f2c] text-white px-6 py-4 rounded-xl font-bold hover:bg-black transition-colors"
            >
              {isEs ? 'Proceder al Pago' : 'Proceed to Checkout'}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="mt-6 text-center">
              <Link 
                href={`/${locale}/services`}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {isEs ? 'Continuar explorando el catálogo' : 'Continue exploring catalog'}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}