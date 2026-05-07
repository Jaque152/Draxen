import Link from 'next/link';
import { Gauge, Gem, Zap, Target, Share2, LineChart, ArrowRight } from 'lucide-react';

export default async function SolucionesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  const soluciones = [
    {
      icono: <Gauge className="w-10 h-10 text-[var(--accent-cyan)]" />,
      titulo: "Estrategia digital: Ferrari",
      resumen: "Velocidad y precisión para alcanzar la meta en tiempo récord mediante análisis de mercado y planes disruptivos.",
      texto: "Comenzamos analizando tu mercado, competencia y audiencia para identificar oportunidades. Diseñamos estrategias multicanal que combinan redes sociales, publicidad pagada, marketing de contenidos y SEO. Con Ferrari, tu marca toma la delantera en la carrera digital, aumentando visibilidad y engagement de manera sostenida."
    },
    {
      icono: <Gem className="w-10 h-10 text-[var(--accent-purple)]" />,
      titulo: "Branding y diseño: Lamborghini",
      resumen: "Poder visual y elegancia. Construimos identidades que reflejan la esencia y personalidad única de tu empresa.",
      texto: "Creamos identidades visuales completas: logotipos, paletas de color, tipografía y manuales de marca. Fusionamos creatividad y estrategia para construir una narrativa visual que conecte emocionalmente. Tu marca se convierte en un símbolo de reconocimiento y diferenciación duradera."
    },
    {
      icono: <Zap className="w-10 h-10 text-[var(--accent-magenta)]" />,
      titulo: "Marketing de contenidos: Porsche",
      resumen: "Combustible de alta calidad. Contenido ágil y eficiente enfocado en atraer, educar y fidelizar a tu audiencia.",
      texto: "Creamos blogs, newsletters, videos e infografías que transmiten mensajes claros. Aplicamos storytelling y técnicas de SEO para optimizar el alcance. Monitoreamos métricas de rendimiento y ajustamos estrategias para mejorar continuamente la eficacia de tus acciones."
    },
    {
      icono: <Target className="w-10 h-10 text-[var(--accent-cyan)]" />,
      titulo: "Publicidad pagada: Tesla",
      resumen: "Energía innovadora y precisa. Maximizamos el retorno de inversión con segmentación exacta y conversiones inmediatas.",
      texto: "Campañas en Google Ads, Facebook e Instagram diseñadas para generar resultados medibles. Aplicamos pruebas A/B y estrategias de remarketing para ajustar anuncios en tiempo real. Tu marca acelera su alcance atrayendo clientes de forma inmediata y sostenible."
    },
    {
      icono: <Share2 className="w-10 h-10 text-[var(--accent-purple)]" />,
      titulo: "Gestión de redes sociales: Bugatti",
      resumen: "Estilo y velocidad en el circuito social. Fomentamos el crecimiento de comunidad y relaciones auténticas.",
      texto: "Gestionamos tus plataformas con precisión. Creamos calendarios de contenido, publicamos material creativo y respondemos a la audiencia estratégicamente. Adaptamos cada publicación al tono de tu marca, garantizando consistencia y relevancia en todos los canales."
    },
    {
      icono: <LineChart className="w-10 h-10 text-[var(--accent-magenta)]" />,
      titulo: "Análisis y optimización: Jeep",
      resumen: "Resistencia en cualquier terreno. Supervisamos y ajustamos cada acción para garantizar un rendimiento estable.",
      texto: "Analizamos métricas de campañas y resultados generales para mejorar continuamente. Identificamos oportunidades de mejora y optimizamos recursos. Tu estrategia digital se vuelve flexible y resistente, lista para superar cualquier desafío del mercado."
    }
  ];

  return (
    <main className="min-h-screen bg-mesh pt-32 pb-24 text-[var(--text-main)] relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-[var(--accent-purple)]/30 mb-6">
            <span className="text-[var(--accent-purple)] uppercase tracking-[0.2em] text-xs font-bold">Portafolio Estratégico</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-[var(--text-main)]">Soluciones a Tu Medida</h1>
          <p className="text-xl text-[var(--text-main)]/70 max-w-3xl mx-auto font-medium">
            Ingeniería de alto rendimiento. Pasa el cursor sobre cada solución para conocer los detalles del motor.
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