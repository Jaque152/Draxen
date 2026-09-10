"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const locale = useLocale();
  const isEs = locale === 'es';


  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 overflow-hidden bg-mesh min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-[var(--accent-purple)]/30 mb-6">
            <span className="text-[var(--accent-purple)] uppercase tracking-[0.2em] text-xs font-bold">
              {isEs ? 'Sobre Nosotros' : 'About Us'}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-main)] max-w-3xl leading-[1.1] tracking-tight">
            Draxen Digital.{" "}
            <span className="text-gradient-pop block mt-2">
              {isEs ? 'Elevando el Potencial de tu Negocio.' : 'Elevating Your Business Potential.'}
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 glass-panel p-8 md:p-12 rounded-3xl"
          >
            <h3 className="text-3xl font-bold text-[var(--text-main)]">
              {isEs ? 'Nuestro Laboratorio de Ensamblaje' : 'Our Assembly Lab'}
            </h3>
            <div className="space-y-6 text-lg text-[var(--text-main)]/70 leading-relaxed font-medium text-justify">
              <p>
                {isEs ? 'Cada marca es una máquina con un ADN distinto. Desde la conceptualización visual hasta el despliegue digital, nuestro equipo afina cada engranaje para que tu proyecto acelere con fuerza y distinción.' : 'Every brand is a machine with a distinct DNA. From visual conceptualization to digital deployment, our team fine-tunes every gear so your project accelerates with strength and distinction.'}
              </p>
              <p>
                {isEs ? 'No usamos plantillas de fábrica; construimos motores de crecimiento adaptados al terreno de tu industria. Nuestra pasión es fusionar la creatividad estética con analítica pura para generar métricas que rompen los límites de velocidad.' : 'We don’t use factory templates; we build growth engines adapted to the terrain of your industry. Our passion is fusing aesthetic creativity with pure analytics to generate metrics that break speed limits.'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="relative pl-8 border-l-4 border-[var(--accent-cyan)]">
              <h3 className="text-3xl font-bold text-[var(--text-main)] mb-6 tracking-tight">
                {isEs ? 'De Motor a Pista' : 'From Engine to Track'}
              </h3>
              <ul className="space-y-6 text-[var(--text-main)]/70 leading-relaxed font-medium">
                <li><strong className="text-[var(--text-main)]">{isEs ? '1. Diagnóstico de Telemetría:' : '1. Telemetry Diagnosis:'}</strong> {isEs ? 'Inspeccionamos el estado actual de tu marca y trazamos la ruta más eficiente.' : 'We inspect the current state of your brand and map out the most efficient route.'}</li>
                <li><strong className="text-[var(--text-main)]">{isEs ? '2. Ingeniería y Trazado:' : '2. Engineering and Mapping:'}</strong> {isEs ? 'Ensamblamos tácticas personalizadas uniendo creatividad con tecnología de punta.' : 'We assemble custom tactics uniting creativity with cutting-edge technology.'}</li>
                <li><strong className="text-[var(--text-main)]">{isEs ? '3. Arranque Oficial:' : '3. Official Launch:'}</strong> {isEs ? 'Desplegamos activos visuales y campañas calibradas para conectar con tu público.' : 'We deploy visual assets and calibrated campaigns to connect with your audience.'}</li>
                <li><strong className="text-[var(--text-main)]">{isEs ? '4. Calibración Continua:' : '4. Continuous Calibration:'}</strong> {isEs ? 'Monitoreamos los tiempos de vuelta, ajustando tu estrategia para exprimir el máximo rendimiento.' : 'We monitor lap times, adjusting your strategy to squeeze out maximum performance.'}</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}