'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Strain } from '@/types';
import { X, Sparkles, Dna, Award, MapPin, Compass } from 'lucide-react';

interface StrainModalProps {
  strain: Strain | null;
  onClose: () => void;
}

export function StrainModal({ strain, onClose }: StrainModalProps) {
  if (!strain) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b13] shadow-2xl shadow-purple-950/80 z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full border border-white/10 bg-black/60 p-2 text-white/70 hover:text-white hover:bg-black/80 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
          <Image
            src={strain.image}
            alt={strain.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b13] via-[#0c0b13]/50 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-wizard-purple px-3 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-white">
                {strain.type}
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3 py-0.5 font-mono text-xs font-bold text-emerald-400">
                THC {strain.thc}
              </span>
              {strain.badge && (
                <span className="rounded-full border border-white/20 bg-black/60 px-3 py-0.5 font-mono text-xs text-white">
                  {strain.badge}
                </span>
              )}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {strain.name}
            </h2>
            {strain.aka && (
              <p className="font-mono text-xs text-wizard-muted mt-0.5">
                {strain.aka}
              </p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Lineage & Genetics Card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h4 className="font-mono text-xs uppercase tracking-widest text-wizard-purple-glow flex items-center gap-2 mb-3">
              <Dna className="w-4 h-4" />
              <span>Genetic Lineage & Breeding</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <p className="text-white/40">Pedigree Lineage:</p>
                <p className="text-base font-semibold text-white mt-0.5">{strain.lineage}</p>
              </div>
              <div>
                <p className="text-white/40">Collaborative Breeders:</p>
                <p className="text-base font-semibold text-white mt-0.5">{strain.breeder}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
              Cultivar Dossier
            </h4>
            <p className="text-sm text-wizard-muted leading-relaxed">
              {strain.description}
            </p>
          </div>

          {/* Terpene Lab Breakdown */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-3 flex items-center justify-between">
              <span>Analytical Terpene Spectrum</span>
              <span className="text-wizard-purple-glow font-bold">{strain.dominantTerpene}</span>
            </h4>
            <div className="space-y-3">
              {strain.terpenes.map((terp, idx) => (
                <div key={idx} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="font-semibold text-white">{terp.name}</span>
                    <span className="text-wizard-lime font-bold">{terp.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-wizard-purple to-wizard-lime"
                      style={{ width: `${Math.min(terp.percentage * 50, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-wizard-muted">{terp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flavors & Effects Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
                Aroma & Flavor Notes
              </h4>
              <div className="flex flex-wrap gap-2">
                {strain.flavors.map((flavor) => (
                  <span
                    key={flavor}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/80"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
                Reported Effects
              </h4>
              <div className="flex flex-wrap gap-2">
                {strain.effects.map((effect) => (
                  <span
                    key={effect}
                    className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs text-emerald-300"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Awards */}
          {strain.awards && strain.awards.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-amber-300 flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Awards & Distinctions</span>
              </h4>
              <ul className="space-y-1 font-mono text-xs text-white/80">
                {strain.awards.map((a, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-[#08080c] flex flex-col sm:flex-row gap-3">
          <Link
            href={`/shop?strain=${strain.slug}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 px-6 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Shop {strain.name} Flower & Gear</span>
          </Link>
          <Link
            href="/locations"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 px-6 font-mono text-xs font-semibold uppercase tracking-widest text-white hover:border-white/30 hover:bg-white/10 transition"
          >
            <MapPin className="w-4 h-4 text-wizard-purple-glow" />
            <span>Find In Dispensaries</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

