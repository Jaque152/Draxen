import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AddToCartButton } from './AddToCartButton';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

// === 1. METADATOS SEO DINÁMICOS ===
export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: plan } = await supabase.from('plans_nc').select('title, description').eq('slug', slug).single();
  
  if (!plan) return { title: 'Plan no encontrado | Marketing Diital' };
  
  return {
    title: `${plan.title} | Marketing Digital`,
    description: plan.description,
  };
}

// === 2. PÁGINA DEL SERVIDOR ===
export default async function PlanDetailPage({ 
  params: { locale, slug } 
}: { 
  params: { locale: string, slug: string } 
}) {
  const supabase = await createClient();

  // Buscamos el plan específico
  const { data: plan } = await supabase
    .from('plans_nc')
    .select('*, categories_nc(name)')
    .eq('slug', slug)
    .single();

  if (!plan || !plan.is_active) {
    notFound(); // Muestra la página 404 automática de Next.js
  }

  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);
  
  // En Supabase, features suele guardarse como array JSON o string JSON. Lo parseamos seguro:
  let featuresList: string[] = [];
  try {
    if (typeof plan.features === 'string') featuresList = JSON.parse(plan.features);
    else if (Array.isArray(plan.features)) featuresList = plan.features;
  } catch (e) {
    console.error("Error parseando features", e);
  }

  const isEs = locale === 'es';

  return (
    <main className="min-h-screen bg-[var(--navy)] bg-grain pt-32 pb-24 text-[var(--cream)] relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Botón de Regreso */}
        <Link 
          href={`/${locale}/services`}
          className="inline-flex items-center gap-2 text-[var(--cream)]/60 hover:text-[var(--copper)] transition-colors mb-12 font-sans font-medium uppercase tracking-widest text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEs ? 'Volver al catálogo' : 'Back to catalog'}
        </Link>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: Detalles del Plan */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <span className="text-[var(--copper)] text-sm font-bold uppercase tracking-[0.3em] font-sans mb-4 block">
                {plan.categories_nc?.name || 'Marketing'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight">
                {plan.title}
              </h1>
              <p className="mt-6 text-xl text-[var(--cream)]/70 font-sans leading-relaxed max-w-3xl">
                {plan.description}
              </p>
            </div>

            {/* Lista de características */}
            <div className="bg-[var(--charcoal)] border border-[var(--copper)]/10 rounded-[2rem] p-8 md:p-12">
              <h3 className="text-2xl font-serif font-bold mb-8 text-[var(--amber)]">
                {isEs ? '¿Qué incluye esta estrategia?' : 'What is included in this strategy?'}
              </h3>
              <ul className="space-y-6">
                {featuresList.map((feature, idx) => (
                  <li key={idx} className="flex gap-4 items-start font-sans">
                    <CheckCircle2 className="w-6 h-6 text-[var(--copper)] shrink-0 mt-0.5" />
                    <span className="text-lg text-[var(--cream)]/80 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMNA DERECHA: Tarjeta Sticky de Compra */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-[var(--charcoal)] border border-[var(--copper)]/20 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-black/50">
              
              {/* Efecto de luz sutil */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--copper)]/10 to-transparent rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="mb-2">
                  <span className="text-[var(--cream)]/50 uppercase tracking-widest text-xs font-bold font-sans">
                    {isEs ? 'Inversión' : 'Investment'}
                  </span>
                </div>
                
                <div className="mb-8">
                  <div className="text-4xl font-bold text-gradient font-sans mb-1">
                    {formatPrice(plan.price)}
                  </div>
                  <div className="text-[var(--cream)]/40 text-sm uppercase tracking-widest font-sans">
                    {isEs ? 'IVA (16%) Incluido' : 'Taxes Included'}
                  </div>
                </div>

                {/* Línea divisoria */}
                <div className="h-px w-full bg-gradient-to-r from-[var(--copper)]/30 to-transparent mb-8" />

                {/* El Botón Cliente */}
                <AddToCartButton planId={plan.id} />

                <div className="mt-6 text-center space-y-2 font-sans">
                  <p className="text-sm text-[var(--cream)]/50">
                    {isEs ? 'Pago 100% seguro y encriptado.' : '100% secure and encrypted payment.'}
                  </p>
                  <p className="text-xs text-[var(--cream)]/30">
                    Powered by Keycop
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}