"use client";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const locale = useLocale();
  const pathname = usePathname();
  const { items, setIsOpen: openCart } = useCart();

 
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Inicio", href: `/${locale}` },
    { name: "Agencia", href: `/${locale}/about` },
    { name: "Estrategias", href: `/${locale}/services` },
    { name: "A tu medida", href: `/${locale}/pricing` },
    { name: "Contacto", href: `/${locale}/contact` },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--navy)]/90 backdrop-blur-xl py-4 shadow-2xl shadow-black/20"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png" 
                  alt="MR Logo"
                  fill
                  className="object-contain"
                  priority 
                />
              </div>

            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 font-sans ${
                        isActive ? "text-[var(--amber)]" : "text-[var(--cream)]/70 hover:text-[var(--cream)]"
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--amber)] rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Acciones Right: Botón CTA & Carrito */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => openCart(true)}
                className="relative p-2 text-[var(--cream)]/80 hover:text-[var(--cream)] transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-[var(--copper)] text-[var(--navy)] text-xs font-bold flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="hidden md:block">
                <Link
                  href={`/${locale}/plan-personalizado`}
                  className="relative overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--copper)] to-[var(--amber)] text-[var(--navy)] font-semibold text-sm group inline-block"
                >
                  <span className="relative z-10 font-sans">Cotizar Proyecto</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center"
              >
                <div className="flex flex-col gap-1.5">
                  <motion.span
                    animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }}
                    className="w-6 h-0.5 bg-[var(--cream)] origin-center"
                  />
                  <motion.span
                    animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                    className="w-6 h-0.5 bg-[var(--cream)]"
                  />
                  <motion.span
                    animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }}
                    className="w-6 h-0.5 bg-[var(--cream)] origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-24 bg-[var(--navy)]/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-serif text-[var(--cream)] hover:text-[var(--amber)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}