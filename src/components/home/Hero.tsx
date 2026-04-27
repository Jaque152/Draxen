"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const headlines = [
  { word: "Disruptive", accent: "Communication" },
  { word: "Strategic", accent: "Events" },
  { word: "Targeted", accent: "Strategies" },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-grain"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F1A] via-[#1A1B2E] to-[#0F0F1A]" />

      {/* Animated Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C87941]/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#E8B86D]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(232, 184, 109, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 184, 109, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2"
            >
              <span className="w-12 h-px bg-gradient-to-r from-[#C87941] to-transparent" />
              <span className="text-[#C87941] uppercase tracking-[0.3em] text-sm font-medium">
                Creative Agency
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1]">
                    <span className="text-gradient">{headlines[currentIndex].accent}</span>
                  </h1>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#F5F0E8] leading-[1.1] mt-2">
                    {headlines[currentIndex].word}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-[#F5F0E8]/60 max-w-md leading-relaxed"
            >
              We craft bold marketing solutions that help your brand stand out
              in an increasingly competitive marketplace.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#services"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#C87941] to-[#E8B86D] rounded-full overflow-hidden"
              >
                <span className="relative z-10 font-semibold text-[#0F0F1A]">
                  Explore Services
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </a>
              <a
                href="#about"
                className="group px-8 py-4 border border-[#F5F0E8]/20 rounded-full hover:border-[#C87941]/50 transition-colors duration-300"
              >
                <span className="font-medium text-[#F5F0E8] group-hover:text-[#E8B86D] transition-colors">
                  Learn More
                </span>
              </a>
            </motion.div>

            {/* Slide Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3 pt-8"
            >
              {headlines.map((_, i) => (
                <button
                  key={_?.word}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`relative h-1 transition-all duration-500 ${
                    i === currentIndex ? "w-12 bg-[#C87941]" : "w-4 bg-[#F5F0E8]/20 hover:bg-[#F5F0E8]/40"
                  } rounded-full`}
                />
              ))}
            </motion.div>
          </div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Geometric shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border border-[#C87941]/30 rounded-3xl rotate-12 animate-float" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square border border-[#E8B86D]/20 rounded-3xl -rotate-6" style={{ animationDelay: "1s" }} />

              {/* Center Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C87941]/20 to-[#E8B86D]/20" />
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=800&fit=crop"
                  alt="Creative Team"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-[#C87941] to-[#E8B86D] rounded-2xl flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-[#0F0F1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute bottom-20 left-10 px-4 py-2 bg-[#1A1B2E] border border-[#C87941]/30 rounded-xl"
              >
                <span className="text-[#E8B86D] text-sm font-medium">100+ Projects</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[#F5F0E8]/40 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#C87941] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
