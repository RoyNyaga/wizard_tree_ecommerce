'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Strain } from '@/types';
import { StrainCard } from '@/components/strains/StrainCard';
import { StrainModal } from '@/components/strains/StrainModal';
import { ArrowRight, Sparkles, Dna } from 'lucide-react';

interface StrainShowcaseProps {
  strains: Strain[];
}

export function StrainShowcase({ strains }: StrainShowcaseProps) {
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredStrains = strains.filter((s) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'POPULAR') return s.isPopular;
    if (activeFilter === 'INDICA') return s.type.includes('indica');
    if (activeFilter === 'HYBRID') return s.type === 'hybrid';
    return true;
  });

  return (
    <section className="py-24 border-b border-white/10 bg-[#07070a] relative overflow-hidden">
      {/* Cosmic background glow */}
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-wizard-purple-glow font-bold flex items-center gap-2">
              <Dna className="w-3.5 h-3.5" />
              <span>02 // THE FOUNDATION</span>
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              LEGENDARY GENETICS
            </h2>
            <p className="text-sm text-wizard-muted max-w-xl font-normal">
              Bred from rare phenotype selections in partnership with world-class breeders. Click any cultivar to inspect its full genetic dossier and terpene profile.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['ALL', 'POPULAR', 'INDICA', 'HYBRID'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
                  activeFilter === f
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Strains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrains.map((strain) => (
            <StrainCard
              key={strain.id}
              strain={strain}
              onSelect={(s) => setSelectedStrain(s)}
            />
          ))}
        </div>

        {/* Bottom Link to Strains Directory */}
        <div className="mt-12 text-center">
          <Link
            href="/strains"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-wizard-purple-glow" />
            <span>EXPLORE FULL GENETICS LAB & LINEAGES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Detail Modal */}
      <StrainModal
        strain={selectedStrain}
        onClose={() => setSelectedStrain(null)}
      />
    </section>
  );
}

