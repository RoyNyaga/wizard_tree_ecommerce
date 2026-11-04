'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown, Sparkles, Dna, ShoppingBag, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-12 overflow-hidden border-b border-white/10">
      {/* Background Cosmic Radial Glows & Grid Pattern */}
      <div className="absolute inset-0 bg-[#07070a] pointer-events-none">
        {/* Deep Violet & Emerald Cosmic Nebula Bloom */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-900/25 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -left-40 w-[450px] h-[450px] bg-indigo-950/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-950/15 rounded-full blur-[140px]" />

        {/* Minimal Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }} 
        />
      </div>

      {/* Top Banner Tag */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-500/30 bg-purple-950/20 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-wizard-purple-glow animate-pulse" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-200">
            WAVE 04 HARVEST & APPAREL DROP LIVE
          </span>
        </div>
      </div>

      {/* Main Center Typography */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="max-w-4xl space-y-6">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-wizard-purple-glow font-bold">
            01 // LOS ANGELES CRAFT HORTICULTURE
          </p>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[1.05]">
            ARTISANAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-600">GENETICS.</span><br />
            UNCOMPROMISING CULTIVATION.
          </h1>

          <p className="text-sm sm:text-lg text-wizard-muted max-w-2xl font-normal leading-relaxed">
            World-renowned cultivars bred with visionary collaborators. Creators of the iconic <span className="text-white font-semibold">ZOAP</span>, <span className="text-white font-semibold">RS-11</span>, and <span className="text-white font-semibold">ZANGRIA</span> — setting the global benchmark for boutique flower and streetwear.
          </p>

          {/* Action Button Row */}
          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <Link
              href="/strains"
              className="flex items-center gap-2.5 rounded-xl bg-white px-7 py-4 font-mono text-xs font-bold uppercase tracking-widest text-black shadow-xl shadow-purple-950/40 hover:bg-wizard-purple-glow hover:text-white transition-all active:scale-95"
            >
              <Dna className="w-4 h-4" />
              <span>EXPLORE GENETICS</span>
            </Link>

            <Link
              href="/shop"
              className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-mono text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md hover:bg-white hover:text-black hover:border-white transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>SHOP DROPS</span>
            </Link>

            <Link
              href="/locations"
              className="flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-widest text-wizard-muted hover:text-white transition"
            >
              <MapPin className="w-3.5 h-3.5 text-wizard-lime" />
              <span>FIND IN STORES</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Ticker & Scroll Prompt */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-white/5 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-wizard-muted">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="uppercase tracking-widest">
            FACILITY: LOS ANGELES, CA // TIER 1 INDOOR CLEANROOM
          </span>
        </div>

        <div className="flex items-center gap-2 text-white/50 hover:text-white transition">
          <span className="uppercase tracking-widest">SCROLL TO DISCOVER</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-wizard-purple-glow" />
        </div>
      </div>
    </section>
  );
}

