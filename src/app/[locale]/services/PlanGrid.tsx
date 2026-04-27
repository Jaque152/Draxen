"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Plan } from "@/types";

export function PlanGrid({ plans, locale }: { plans: Plan[], locale: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div 
      ref={ref}
      className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {plans.map((plan, index) => (
        <PlanCard 
          key={plan.id} 
          plan={plan} 
          index={index} 
          isInView={isInView} 
          locale={locale} 
        />
      ))}
    </div>
  );
}

function PlanCard({ 
  plan, 
  index, 
  isInView, 
  locale 
}: { 
  plan: Plan; 
  index: number; 
  isInView: boolean; 
  locale: string;
}) {
  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full flex"
    >
      <div className="relative flex flex-col w-full p-1 rounded-3xl bg-gradient-to-b from-[var(--charcoal)] to-[var(--navy)] border border-[var(--copper)]/10 hover:border-[var(--copper)]/30 transition-all duration-500 overflow-hidden">
        
        {/* Fondo animado al hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--copper)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Imagen del Plan (Placeholder de lujo si no hay URL) */}
        <div className="relative h-48 w-full rounded-t-[1.3rem] overflow-hidden bg-[var(--navy)] border-b border-[var(--copper)]/10">
          {plan.image_url ? (
            <img 
              src={plan.image_url} 
              alt={plan.title} 
              className="w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] to-[var(--navy)] flex items-center justify-center">
              <span className="text-[var(--cream)]/10 font-serif text-6xl font-bold">NC</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="relative z-10 p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-[var(--cream)] group-hover:text-[var(--copper)] transition-colors duration-300 font-serif">
            {plan.title}
          </h3>
          
          <div className="mt-2 mb-6">
            <span className="text-2xl font-bold text-gradient font-sans">
              {formatPrice(plan.price)}
            </span>
            <span className="text-[10px] text-[var(--cream)]/40 ml-2 uppercase tracking-widest font-sans">
              MXN / IVA Inc.
            </span>
          </div>

          <div className="mt-auto pt-6 border-t border-[var(--copper)]/10">
            <Link 
              href={`/${locale}/services/${plan.slug}`}
              className="inline-flex items-center gap-2 text-[var(--amber)] group-hover:gap-4 transition-all duration-300 font-sans text-sm uppercase tracking-widest font-semibold"
            >
              {locale === 'es' ? 'Ver Detalles' : 'View Details'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
