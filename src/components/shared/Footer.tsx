"use client";

import { motion } from "framer-motion";
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isEs = locale === 'es';

  const switchLocale = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale; 
    router.push(segments.join('/'));
  };

  const footerLinks = {
    explorar: [
      { name: isEs ? "Punto de Partida" : "Start Line", href: `/${locale}` },
      { name: isEs ? "Nuestra Esencia" : "Our Essence", href: `/${locale}/about` },
      { name: isEs ? "Soluciones a Tu Medida" : "Custom Solutions", href: `/${locale}/soluciones` },
      { name: isEs ? "Fórmulas de Éxito" : "Success Formulas", href: `/${locale}/services` },
    ],
    empresa: [
      { name: isEs ? "Hablemos" : "Let's Talk", href: `/${locale}/contact` },
      { name: isEs ? "Cotizador" : "Pricing", href: `/${locale}/pricing` },
    ],
    legal: [
      { name: isEs ? "Política de Privacidad" : "Privacy Policy", href: `/${locale}/legal/privacy` },
      { name: isEs ? "Términos y condiciones" : "Terms of Service", href: `/${locale}/legal/terms-conditions` },
      { name: isEs ? "Política de reembolsos y cancelaciones" : "Cancellation Policy", href: `/${locale}/legal/cancellation` },
    ],
  };

  return (
    <footer className="relative bg-[var(--accent-dark)] border-t border-white/10 font-sans overflow-hidden">
      {/* Resplandor de fondo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--accent-purple)]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Column (Logo + Texto) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-4 group">
              {/* LOGO DRAXEN INTEGRADO */}
              <div className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="draxen-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="draxen-grad2" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="12" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <g filter="url(#neon-glow)">
                    <path d="M 120 256 L 310 70 L 370 130 L 210 256 Z" fill="url(#draxen-grad1)" />
                    <path d="M 392 256 L 202 442 L 142 382 L 302 256 Z" fill="url(#draxen-grad2)" />
                    <polygon points="256,176 336,256 256,336 176,256" fill="#ffffff" opacity="0.95" />
                    <polygon points="256,200 312,256 256,312 200,256" fill="#020617" opacity="0.8" />
                  </g>
                </svg>
              </div>
              <span className="font-bold text-3xl tracking-tight text-white">
                DRAXEN<span className="text-[var(--accent-cyan)]">.</span>
              </span>
            </Link>
            <p className="text-white/60 max-w-sm leading-relaxed font-medium">
              {isEs 
                ? 'Diseñando sistemas de adquisición y estrategias disruptivas para dominar el mercado digital.'
                : 'Designing acquisition systems and disruptive strategies to dominate the digital market.'}
            </p>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">{isEs ? 'Explorar' : 'Explore'}</h4>
            <ul className="space-y-4">
              {footerLinks.explorar.map((link) => (
                <li key={link.name}><Link href={link.href} className="text-white/60 hover:text-[var(--accent-magenta)] font-medium transition-colors text-sm">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">{isEs ? 'Empresa' : 'Company'}</h4>
            <ul className="space-y-4">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}><Link href={link.href} className="text-white/60 hover:text-[var(--accent-magenta)] font-medium transition-colors text-sm">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}><Link href={link.href} className="text-white/60 hover:text-[var(--accent-magenta)] font-medium transition-colors text-sm">{link.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Inferior */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium order-2 md:order-1 text-center md:text-left">
            © {new Date().getFullYear()} Draxen Digital. {isEs ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 order-1 md:order-2">
            
            {/* SELECTOR DE IDIOMA (AHORA CIBER-AUDAZ) */}
            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
              <Globe className="w-5 h-5 text-white/50 ml-2" />
              <button
                onClick={() => switchLocale('es')}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                  locale === 'es' 
                    ? 'bg-[var(--accent-cyan)] text-[var(--accent-dark)] shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => switchLocale('en')}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                  locale === 'en' 
                    ? 'bg-[var(--accent-cyan)] text-[var(--accent-dark)] shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Payment Icons */}
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
                 <svg className="h-4" viewBox="0 0 780 500" fill="none"><rect width="780" height="500" rx="40" fill="white"/><path fill="#1434CB" d="M293.2 348.7l33.3-190.4h53.3l-33.3 190.4h-53.3zM500.8 163c-10.5-3.9-27-8.1-47.6-8.1-52.4 0-89.3 26.4-89.6 64.2-.3 28 26.5 43.6 46.7 52.9 20.7 9.5 27.7 15.6 27.6 24.1-.1 13-16.6 19-31.9 19-21.3 0-32.6-3-50.1-10.3l-6.9-3.1-7.5 43.8c12.4 5.4 35.5 10.1 59.4 10.4 55.7 0 91.9-26.1 92.3-66.5.2-22.2-14-39.1-44.6-53-18.6-9-30-15-29.9-24.1 0-8.1 9.6-16.7 30.5-16.7 17.4-.3 30 3.5 39.8 7.5l4.8 2.3 7.2-42.4h.8zM581.8 158.3h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.2h55.7l11.1-29.1h68.1l6.5 29.1H624l-42.2-194.4zm-65.6 125.2c4.4-11.2 21.3-54.4 21.3-54.4-.3.5 4.4-11.4 7.1-18.7l3.6 16.9s10.2 46.6 12.4 56.2h-44.4z"/><path fill="#1434CB" d="M239.5 158.3L187.4 289l-5.5-26.8c-9.6-30.7-39.5-64-73-80.6l47.5 166.9h56l83.2-190.2h-56.1z"/><path fill="#F7B600" d="M146.9 158.3H61.3l-.6 3.5c66.4 16 110.3 54.7 128.5 101.2l-18.5-88.8c-3.2-12.1-12.5-15.5-23.8-15.9z"/></svg>
              </div>
              <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
                <svg className="h-4" viewBox="0 0 152 100" fill="none"><rect width="152" height="100" rx="8" fill="white"/><circle cx="55" cy="50" r="30" fill="#EB001B"/><circle cx="97" cy="50" r="30" fill="#F79E1B"/><path d="M76 27.5C82.6 32.8 87 40.8 87 50C87 59.2 82.6 67.2 76 72.5C69.4 67.2 65 59.2 65 50C65 40.8 69.4 32.8 76 27.5Z" fill="#FF5F00"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBO DE CONTACTO (AHORA NEON PÚRPURA/MAGENTA) */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Link 
          href={`/${locale}/contact`}
          className="w-14 h-14 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-magenta)] rounded-full flex items-center justify-center shadow-xl shadow-[var(--accent-purple)]/40 hover:scale-110 active:scale-95 transition-transform"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </Link>
      </motion.div>
    </footer>
  );
}