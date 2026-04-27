"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";


export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 overflow-hidden bg-gradient-to-b from-[#0F0F1A] to-[#1A1B2E]"
    >
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C87941]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-[#C87941] uppercase tracking-[0.3em] text-sm font-medium">
            About Us
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F0E8] max-w-3xl leading-tight">
            A Marketing Agency{" "}
            <span className="text-gradient">Focused on Your Goals</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Mission */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <p className="text-xl text-[#F5F0E8]/80 leading-relaxed">
              Our mission is to provide personalized and high-quality marketing
              solutions to help businesses grow and stand out in an increasingly
              competitive market.
            </p>


          </motion.div>

          {/* Right Column - Vision */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="relative">
              <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-[#C87941] to-[#E8B86D] rounded-full" />
              <h3 className="text-3xl font-bold text-[#F5F0E8] mb-6">
                Our Vision
              </h3>
              <div className="space-y-6 text-[#F5F0E8]/70 leading-relaxed">
                <p>
                  At Digital Marketing, our vision is to become the most reliable
                  and successful marketing agency in the market. We strive to be
                  industry leaders and be recognized for our creativity,
                  innovation, and excellence in customer service.
                </p>
                <p>
                  We believe in the importance of collaboration and constant
                  communication with our clients to ensure their business
                  objectives are met and exceeded.
                </p>
                <p>
                  If you're looking for a reliable, creative, and innovative
                  marketing agency, contact us today!
                </p>
              </div>
            </div>

            {/* CTA */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 mt-8 group"
            >
              <span className="text-[#E8B86D] font-medium group-hover:text-[#C87941] transition-colors">
                Start Your Project
              </span>
              <div className="w-10 h-10 rounded-full border border-[#E8B86D] flex items-center justify-center group-hover:bg-[#E8B86D] group-hover:border-[#E8B86D] transition-all duration-300">
                <svg
                  className="w-4 h-4 text-[#E8B86D] group-hover:text-[#0F0F1A] group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.a>
          </motion.div>
        </div>

        {/* Image Strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 relative"
        >
          <div className="grid grid-cols-3 gap-4 h-64 lg:h-80">
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A]/80 to-transparent" />
            </div>
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                alt="Creative process"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A]/80 to-transparent" />
            </div>
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop"
                alt="Strategy meeting"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A]/80 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
