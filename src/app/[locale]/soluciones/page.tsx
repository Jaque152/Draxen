import Link from 'next/link';
import { Gauge, Gem, Zap, Target, Share2, LineChart, ArrowRight } from 'lucide-react';

export default async function SolucionesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  const soluciones = [
    {
      icono: <Gauge className="w-10 h-10 text-[var(--accent-cyan)]" />,
      titulo: isEs ? "Estrategia digital: Ferrari" : "Digital Strategy: Ferrari",
      resumen: isEs 
        ? "Velocidad y precisión para alcanzar la meta en tiempo récord mediante análisis de mercado y planes disruptivos." 
        : "Speed and precision to reach the goal in record time through market analysis and disruptive plans.",
      texto: isEs 
        ? "Comenzamos analizando tu mercado, competencia y audiencia para identificar oportunidades. Diseñamos estrategias multicanal que combinan redes sociales, publicidad pagada, marketing de contenidos y SEO. Con Ferrari, tu marca toma la delantera en la carrera digital, aumentando visibilidad y engagement de manera sostenida." 
        : "We start by analyzing your market, competition, and audience to identify opportunities. We design multi-channel strategies that combine social media, paid advertising, content marketing, and SEO. With Ferrari, your brand takes the lead in the digital race, increasing visibility and engagement in a sustainable way."
    },
    {
      icono: <Gem className="w-10 h-10 text-[var(--accent-purple)]" />,
      titulo: isEs ? "Branding y diseño: Lamborghini" : "Branding & Design: Lamborghini",
      resumen: isEs 
        ? "Poder visual y elegancia. Construimos identidades que reflejan la esencia y personalidad única de tu empresa." 
        : "Visual power and elegance. We build identities that reflect the unique essence and personality of your company.",
      texto: isEs 
        ? "Creamos identidades visuales completas: logotipos, paletas de color, tipografía y manuales de marca. Fusionamos creatividad y estrategia para construir una narrativa visual que conecte emocionalmente. Tu marca se convierte en un símbolo de reconocimiento y diferenciación duradera." 
        : "We create complete visual identities: logos, color palettes, typography, and brand manuals. We fuse creativity and strategy to build a visual narrative that connects emotionally. Your brand becomes a symbol of recognition and lasting differentiation."
    },
    {
      icono: <Zap className="w-10 h-10 text-[var(--accent-magenta)]" />,
      titulo: isEs ? "Marketing de contenidos: Porsche" : "Content Marketing: Porsche",
      resumen: isEs 
        ? "Combustible de alta calidad. Contenido ágil y eficiente enfocado en atraer, educar y fidelizar a tu audiencia." 
        : "High-quality fuel. Agile and efficient content focused on attracting, educating, and retaining your audience.",
      texto: isEs 
        ? "Creamos blogs, newsletters, videos e infografías que transmiten mensajes claros. Aplicamos storytelling y técnicas de SEO para optimizar el alcance. Monitoreamos métricas de rendimiento y ajustamos estrategias para mejorar continuamente la eficacia de tus acciones." 
        : "We create blogs, newsletters, videos, and infographics that convey clear messages. We apply storytelling and SEO techniques to optimize reach. We monitor performance metrics and adjust strategies to continuously improve the effectiveness of your actions."
    },
    {
      icono: <Target className="w-10 h-10 text-[var(--accent-cyan)]" />,
      titulo: isEs ? "Publicidad pagada: Tesla" : "Paid Advertising: Tesla",
      resumen: isEs 
        ? "Energía innovadora y precisa. Maximizamos el retorno de inversión con segmentación exacta y conversiones inmediatas." 
        : "Innovative and precise energy. We maximize return on investment with exact targeting and immediate conversions.",
      texto: isEs 
        ? "Campañas en Google Ads, Facebook e Instagram diseñadas para generar resultados medibles. Aplicamos pruebas A/B y estrategias de remarketing para ajustar anuncios en tiempo real. Tu marca acelera su alcance atrayendo clientes de forma inmediata y sostenible." 
        : "Campaigns on Google Ads, Facebook, and Instagram designed to generate measurable results. We apply A/B testing and remarketing strategies to adjust ads in real-time. Your brand accelerates its reach by attracting customers immediately and sustainably."
    },
    {
      icono: <Share2 className="w-10 h-10 text-[var(--accent-purple)]" />,
      titulo: isEs ? "Gestión de redes sociales: Bugatti" : "Social Media Management: Bugatti",
      resumen: isEs 
        ? "Estilo y velocidad en el circuito social. Fomentamos el crecimiento de comunidad y relaciones auténticas." 
        : "Style and speed on the social circuit. We foster community growth and authentic relationships.",
      texto: isEs 
        ? "Gestionamos tus plataformas con precisión. Creamos calendarios de contenido, publicamos material creativo y respondemos a la audiencia estratégicamente. Adaptamos cada publicación al tono de tu marca, garantizando consistencia y relevancia en todos los canales." 
        : "We manage your platforms with precision. We create content calendars, publish creative material, and respond to the audience strategically. We adapt each post to your brand's tone, ensuring consistency and relevance across all channels."
    },
    {
      icono: <LineChart className="w-10 h-10 text-[var(--accent-magenta)]" />,
      titulo: isEs ? "Análisis y optimización: Jeep" : "Analysis & Optimization: Jeep",
      resumen: isEs 
        ? "Resistencia en cualquier terreno. Supervisamos y ajustamos cada acción para garantizar un rendimiento estable." 
        : "Resistance on any terrain. We monitor and adjust every action to ensure stable performance.",
      texto: isEs 
        ? "Analizamos métricas de campañas y resultados generales para mejorar continuamente. Identificamos oportunidades de mejora y optimizamos recursos. Tu estrategia digital se vuelve flexible y resistente, lista para superar cualquier desafío del mercado." 
        : "We analyze campaign metrics and overall results to improve continuously. We identify areas for improvement and optimize resources. Your digital strategy becomes flexible and resilient, ready to overcome any market challenge."
    }
  ];

  return (
    <main className="min-h-screen bg-mesh pt-32 pb-24 text-[var(--text-main)] relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-[var(--accent-purple)]/30 mb-6">
            <span className="text-[var(--accent-purple)] uppercase tracking-[0.2em] text-xs font-bold">
              { isEs ? 'Portafolio Estratégico' : 'Strategic Portfolio' }
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-[var(--text-main)]">
            { isEs ? 'Soluciones a Tu Medida' : 'Solutions Tailored to Your Needs' }
          </h1>
          <p className="text-xl text-[var(--text-main)]/70 max-w-3xl mx-auto font-medium">
            { isEs 
              ? 'Ingeniería de alto rendimiento. Pasa el cursor sobre cada solución para conocer los detalles del motor.' 
              : 'High-performance engineering. Hover over each solution to learn about the engine details.' }
          </p>
        </div>

        {/* Grid de Soluciones con Efecto Hover Expandible */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
           {soluciones.map((solucion, idx) => (
             <div 
               key={idx} 
               className="group glass-panel p-8 rounded-3xl border border-white/50 hover:border-[var(--accent-cyan)]/50 transition-all duration-500 bg-white/40 shadow-xl flex flex-col h-fit"
             >
               <div className="mb-6 bg-white/50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-white/60 group-hover:scale-110 transition-transform duration-500">
                 {solucion.icono}
               </div>
               
               <h3 className="text-2xl font-bold mb-3 text-[var(--text-main)] tracking-tight group-hover:text-[var(--accent-cyan)] transition-colors">
                 {solucion.titulo}
               </h3>

               {/* Resumen siempre visible */}
               <p className="text-[var(--text-main)]/80 text-sm leading-relaxed font-bold mb-2">
                 {solucion.resumen}
               </p>

               {/* INFO COMPLETA: Solo visible en Hover */}
               <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                 <div className="overflow-hidden">
                   <p className="text-[var(--text-main)]/60 text-sm leading-relaxed pt-4 border-t border-[var(--text-main)]/10 mt-4 text-justify font-medium">
                     {solucion.texto}
                   </p>
                 </div>
               </div>
             </div>
           ))}
        </div>

      </div>
    </main>
  );
}