'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Award, ShieldCheck, Microscope, ArrowRight } from 'lucide-react';

export function BrandStory() {
  const stats = [
    { value: '10+', label: 'Cannabis Cup Awards', sub: 'Global Recognition' },
    { value: '100%', label: 'In-House Pheno-Hunts', sub: 'Zero White-Labeling' },
    { value: 'Tier 1', label: 'Cleanroom Standard', sub: 'Hospital Grade Airflow' },
    { value: '35%+', label: 'Peak Cannabinoids', sub: 'Verified COA Testing' },
  ];

  return (
    <section className="py-24 border-b border-white/10 bg-[#060609] relative overflow-hidden">
      {/* Background radial purple glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-wizard-purple-glow font-bold flex items-center gap-2">
              <Microscope className="w-3.5 h-3.5" />
              <span>04 // THE ETHOS</span>
            </p>

            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              A CULTURE ROOTED IN BOTANICAL OBSESSION.
            </h2>

            <p className="text-sm sm:text-base text-wizard-muted leading-relaxed">
              Wizard Trees was forged in the competitive underground craft scene of Los Angeles. While industrial operations chased commercial yields, our focus remained singular: hunting the most fragrant, exotic terpene expressions on earth.
            </p>

            <p className="text-sm sm:text-base text-wizard-muted leading-relaxed">
              Through collaborative breeding projects alongside legendary masters like Deep East and Fiya Farmer, we birthed modern icons like <strong className="text-white">ZOAP</strong> and <strong className="text-white">RS-11</strong>. Every batch is grown under ceramic metal-halide lighting, hand-trimmed by specialized artisans, and cold-cured in dark UV glass.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <ShieldCheck className="w-5 h-5 text-wizard-lime flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase text-white">
                    Zero Synthetic PGRs
                  </h4>
                  <p className="text-xs text-wizard-muted mt-1">
                    Organic, terpene-forward living nutrition schedules.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase text-white">
                    Verified Pedigrees
                  </h4>
                  <p className="text-xs text-wizard-muted mt-1">
                    100% genuine genetics with batch COA QR verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-white hover:text-wizard-purple-glow transition"
              >
                <span>Read The Full Cultivation Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Image & Stats Banner */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black">
              <Image
                src="https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=1000&q=80"
                alt="Wizard Trees Cultivation Cleanroom"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold uppercase tracking-wider">
                  CANOPY CANAL // ROOM 04
                </span>
                <span className="text-wizard-purple-glow">
                  FLUSH CYCLE DAY 56
                </span>
              </div>
            </div>

            {/* Stat Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((st, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center backdrop-blur-md"
                >
                  <p className="font-display text-2xl sm:text-3xl font-black text-white">
                    {st.value}
                  </p>
                  <p className="font-mono text-[10px] uppercase font-bold text-wizard-purple-glow mt-1">
                    {st.label}
                  </p>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {st.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

