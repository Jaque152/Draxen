import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { AddToCartButton } from './AddToCartButton';
import { ArrowRight } from 'lucide-react';
import { ClientPrice } from '@/components/shared/ClientPrice';

export default async function ServicesCatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from('cb_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  // SOLUCIÓN: Filtro robusto que busca la palabra "personalizado" o "custom" en el título
  const standardPlans = plans?.filter(plan => 
    !plan.title.toLowerCase().includes('personalizado') && 
    !plan.title.toLowerCase().includes('custom')
  ) || [];

  // Buscamos el plan personalizado para el banner inferior
  const customPlan = plans?.find(plan => 
    plan.title.toLowerCase().includes('personalizado') || 
    plan.title.toLowerCase().includes('custom')
  );

  return (
    <main className="min-h-screen bg-mesh pt-32 pb-24 text-[var(--text-main)] relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-[var(--accent-cyan)]/30 mb-6">
            <span className="text-[var(--accent-cyan)] uppercase tracking-[0.2em] text-xs font-bold">
              Fórmulas de Éxito
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-[var(--text-main)]">
            El Garage De Opciones
          </h1>
        </div>

        {/* Grid de Planes Estándar (Con la info oculta que se revela en Hover) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {standardPlans.map((plan) => (
            <div 
              key={plan.id} 
              className="glass-panel rounded-3xl p-8 border border-white/50 shadow-xl flex flex-col bg-white/40 relative group h-fit transition-all duration-500 hover:shadow-2xl hover:bg-white/60 hover:-translate-y-2 overflow-hidden"
            >
              <div className="mb-4 relative z-10">
                <h3 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mb-2 leading-tight">
                  {plan.title}
                </h3>
                
                {/* REVELACIÓN AL PASAR EL CURSOR (Hover Reveal) */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                  <div className="overflow-hidden">
                    <p className="text-[var(--text-main)]/70 font-medium text-[13px] leading-relaxed pt-2 pb-4">
                      {plan.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-[var(--text-main)]/10 flex items-end justify-between relative z-10">
                <div>
                  <span className="text-2xl font-bold text-[var(--text-main)] block mb-1 tracking-tight">
                    <ClientPrice amount={plan.price} />
                  </span>
                  <span className="text-[10px] text-[var(--text-main)]/50 font-bold uppercase tracking-widest">
                    + IVA
                  </span>
                </div>
                
                <div className="relative z-20">
                  <AddToCartButton planId={plan.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN PLAN PERSONALIZADO (Separado y Premium) */}
        {customPlan && (
          <div className="mt-20 glass-panel rounded-[2.5rem] p-10 md:p-14 border border-[var(--accent-cyan)] shadow-2xl flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-white/60 to-[var(--accent-cyan)]/10 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--accent-cyan)]/20 rounded-full blur-[80px] pointer-events-none transition-all duration-500 group-hover:scale-150" />
            
            <div className="mb-8 md:mb-0 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-[var(--accent-cyan)]/30 mb-4">
                <span className="text-[var(--accent-cyan)] uppercase tracking-[0.2em] text-xs font-bold">Exclusivo</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)] mb-4 leading-tight">
                {customPlan.title}
              </h3>
              <p className="text-[var(--text-main)]/70 font-medium text-lg leading-relaxed">
                {customPlan.description}
              </p>
            </div>

            <div className="w-full md:w-auto relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Botón Primario: Iniciar Cotización */}
              <Link 
                href={`/${locale}/contact`} 
                className="w-full sm:w-auto bg-[var(--accent-dark)] text-white px-8 md:px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-3"
              >
                {isEs ? 'Iniciar Cotización' : 'Start Quote'}
                <ArrowRight className="w-6 h-6" />
              </Link>

              {/* Botón Secundario: Pagar Cotización */}
              <Link 
                href={`/${locale}/pricing`} 
                className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-[var(--accent-cyan)] text-[var(--text-main)] px-8 md:px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[var(--accent-cyan)] hover:text-[var(--accent-dark)] hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-3"
              >
                {isEs ? 'Pagar Cotización' : 'Pay Quote'}
                <ArrowRight className="w-6 h-6" />
              </Link>
              
            </div>
          </div>
        )}

      </div>
    </main>
  );
}