'use client';

import React, { useState } from 'react';
import { STRAINS_DATA } from '@/lib/mockData';
import { Strain } from '@/types';
import { StrainCard } from '@/components/strains/StrainCard';
import { StrainModal } from '@/components/strains/StrainModal';
import { Dna, Sparkles, Search, Award } from 'lucide-react';

export default function StrainsPage() {
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = STRAINS_DATA.filter((s) => {
    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'POPULAR' && s.isPopular) ||
      (filterType === 'INDICA' && s.type.includes('indica')) ||
      (filterType === 'HYBRID' && s.type === 'hybrid');

    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lineage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.breeder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.flavors.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-3.5 py-1 mb-4">
            <Dna className="w-3.5 h-3.5 text-wizard-purple-glow" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-200">
              02 // BREEDING ARCHIVE & LAB
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-white">
            GENETICS & CULTIVARS
          </h1>

          <p className="mt-2 text-sm sm:text-base text-wizard-muted max-w-2xl font-normal leading-relaxed">
            The pedigree that defined an era. Inspect our full genetic library, collaborative breeding pedigrees with Deep East and Fiya Farmer, and exact analytical terpene spectrums.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="py-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-white/5">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All Cultivars' },
              { id: 'POPULAR', label: 'Hall of Fame' },
              { id: 'INDICA', label: 'Indica Dominant' },
              { id: 'HYBRID', label: 'True Hybrids' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
                  filterType === tab.id
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, lineage, flavor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 font-mono text-xs text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
            />
          </div>
        </div>

        {/* Strains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {filtered.map((strain) => (
            <StrainCard
              key={strain.id}
              strain={strain}
              onSelect={(s) => setSelectedStrain(s)}
            />
          ))}
        </div>

        {/* Breeder Collaborators Spotlight */}
        <div className="mt-20 rounded-2xl border border-white/10 bg-[#0c0b13] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-wizard-purple-glow font-bold">
              Collaborative Pedigree
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1 uppercase">
              BRED IN LOS ANGELES // RESPECTED GLOBALLY
            </h3>
            <p className="text-sm text-wizard-muted mt-3 leading-relaxed">
              We believe elite genetics are created when visionary breeders unite. Our historical collaborations with <strong className="text-white">Deep East</strong> and <strong className="text-white">Fiya Farmer</strong> have produced some of the highest-testing and most awarded cultivars across California, Michigan, and Europe.
            </p>
          </div>
        </div>

        {/* Strain Modal */}
        <StrainModal
          strain={selectedStrain}
          onClose={() => setSelectedStrain(null)}
        />
      </div>
    </div>
  );
}

