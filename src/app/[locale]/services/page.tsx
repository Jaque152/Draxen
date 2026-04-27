import { createClient } from '@/lib/supabase/server';
import { Plan } from '@/types';
import { PlanGrid } from './PlanGrid';

export default async function ServicesPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const supabase = await createClient();
  

  const { data: plans } = await supabase
    .from('plans_nc')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: false });

  // Textos según el idioma
  const isEs = locale === 'es';
  const tagText = isEs ? 'Nuestras Estrategias' : 'Our Strategies';
  const title1 = isEs ? 'Planes de' : 'Marketing';
  const title2 = isEs ? 'Élite' : 'Plans';
  const descText = isEs 
    ? 'Soluciones integrales diseñadas para elevar el posicionamiento de tu marca y generar resultados medibles.'
    : 'Comprehensive solutions designed to elevate your brand positioning and drive measurable results.';

  return (
    <main className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-[var(--navy)] bg-grain">
      {/* Elementos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[var(--copper)]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--amber)]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Cabecera de la sección */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-[var(--copper)] uppercase tracking-[0.3em] text-sm font-medium font-sans">
            {tagText}
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--cream)] font-serif">
            {title1} <span className="text-gradient">{title2}</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--cream)]/60 max-w-2xl mx-auto font-sans">
            {descText}
          </p>
        </div>

        {plans && plans.length > 0 ? (
          <PlanGrid plans={plans as Plan[]} locale={locale} />
        ) : (
          <div className="text-center text-[var(--cream)]/50 py-20 font-sans">
            {isEs ? 'No hay planes disponibles en este momento.' : 'No plans available at the moment.'}
          </div>
        )}
      </div>
    </main>
  );
}