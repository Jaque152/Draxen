import Link from 'next/link';
import { T } from "@/components/shared/T";
import { ArrowRight } from 'lucide-react';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {

  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <main className="flex flex-col min-h-screen bg-[var(--navy)] bg-grain">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Luces de fondo estilo agencia de élite */}
        <div className="absolute top-1/4 left-10 w-[40vw] h-[40vw] bg-[var(--copper)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[var(--amber)]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="max-w-4xl">
            <span className="text-[var(--copper)] text-sm font-bold uppercase tracking-[0.3em] font-sans mb-6 block animate-fade-in">
              {isEs ? 'Agencia de Marketing' : 'Marketing Agency'}
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif leading-[1.1] text-[var(--cream)] mb-8">
              <T>Estrategias</T> <br />
              <span className="text-gradient"><T>Dirigidas.</T></span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--cream)]/60 font-sans mb-12 max-w-2xl leading-relaxed">
              {isEs 
                ? 'Nuestra misión es proporcionar soluciones de marketing personalizadas y de alta calidad para ayudar a las empresas a destacar en un mercado competitivo.'
                : 'Our mission is to provide high-quality, custom marketing solutions to help businesses stand out in a competitive market.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 font-sans">
              <Link 
                href={`/${locale}/services`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[var(--copper)] to-[var(--amber)] text-[var(--navy)] font-bold text-lg hover:scale-105 transition-transform"
              >
                {isEs ? 'Ver Estrategias' : 'View Strategies'}
              </Link>
              
              <Link 
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-[var(--copper)]/30 text-[var(--cream)] font-bold text-lg hover:bg-[var(--copper)]/10 transition-colors group"
              >
                {isEs ? 'Hablemos' : "Let's Talk"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform text-[var(--copper)]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}