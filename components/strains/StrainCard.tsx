'use client';

import React from 'react';
import Image from 'next/image';
import { Strain } from '@/types';
import { Sparkles, Dna, ArrowUpRight } from 'lucide-react';

interface StrainCardProps {
  strain: Strain;
  onSelect: (strain: Strain) => void;
}

export function StrainCard({ strain, onSelect }: StrainCardProps) {
  return (
    <div
      onClick={() => onSelect(strain)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b13]/80 backdrop-blur-md transition-all duration-300 hover:border-wizard-purple-glow/50 hover:shadow-2xl hover:shadow-purple-950/50 hover:-translate-y-1 cursor-pointer"
    >
      {/* Background Image Container */}
      <div className="relative aspect-video sm:aspect-[4/3] w-full overflow-hidden bg-black/60">
        <Image
          src={strain.image}
          alt={strain.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b13] via-[#0c0b13]/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {strain.badge && (
            <span className="rounded-full bg-wizard-purple px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              {strain.badge}
            </span>
          )}
          <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
            {strain.type}
          </span>
        </div>

        {/* Potency THC */}
        <div className="absolute top-3 right-3 z-10 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 backdrop-blur-md">
          {strain.thc} THC
        </div>
      </div>

      {/* Info Content */}
      <div className="p-6 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-black text-white group-hover:text-wizard-purple-glow transition-colors">
              {strain.name}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          {strain.aka && (
            <p className="font-mono text-xs text-wizard-muted">
              {strain.aka}
            </p>
          )}
        </div>

        {/* Lineage & Breeder */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-white/80">
            <Dna className="w-3.5 h-3.5 text-wizard-purple-glow flex-shrink-0" />
            <span className="text-white/40">Lineage:</span>
            <span className="truncate">{strain.lineage}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80">
            <Sparkles className="w-3.5 h-3.5 text-wizard-lime flex-shrink-0" />
            <span className="text-white/40">Breeder:</span>
            <span className="truncate">{strain.breeder}</span>
          </div>
        </div>

        {/* Flavors preview */}
        <div className="flex flex-wrap gap-1.5">
          {strain.flavors.slice(0, 3).map((f) => (
            <span
              key={f}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-wizard-muted"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Terpene Profile Bar Preview */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex justify-between font-mono text-[11px] text-white/70 mb-1.5">
            <span>Dominant Terpenes:</span>
            <span className="text-wizard-purple-glow font-bold">{strain.dominantTerpene}</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden flex gap-0.5">
            {strain.terpenes.map((t, idx) => (
              <div
                key={idx}
                className="h-full bg-gradient-to-r from-wizard-purple to-purple-400"
                style={{ width: `${t.percentage * 25}%` }}
                title={`${t.name}: ${t.percentage}%`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

