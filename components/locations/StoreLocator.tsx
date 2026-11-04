'use client';

import React, { useState } from 'react';
import { StoreLocation } from '@/types';
import { MapPin, Phone, Globe, Clock, ShieldCheck, Search, Navigation } from 'lucide-react';

interface StoreLocatorProps {
  locations: StoreLocation[];
}

const STATES = [
  { code: 'ALL', label: 'All States' },
  { code: 'CA', label: 'California' },
  { code: 'MI', label: 'Michigan' },
  { code: 'FL', label: 'Florida' },
  { code: 'AZ', label: 'Arizona' },
];

export function StoreLocator({ locations }: StoreLocatorProps) {
  const [selectedState, setSelectedState] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = locations.filter((loc) => {
    const matchesState = selectedState === 'ALL' || loc.state === selectedState;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.availableStrains.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesState && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-white/10 pb-6">
        {/* State Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATES.map((st) => (
            <button
              key={st.code}
              onClick={() => setSelectedState(st.code)}
              className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
                selectedState === st.code
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search dispensary, city, or strain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 font-mono text-xs text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
          />
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-wizard-muted">
              No verified dispensaries found matching your criteria.
            </p>
          </div>
        ) : (
          filteredLocations.map((store) => (
            <div
              key={store.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0e0d16]/80 p-6 backdrop-blur-md transition-all hover:border-wizard-purple-glow/40 hover:shadow-xl hover:shadow-purple-950/30"
            >
              <div>
                {/* Store Type Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-wizard-purple/20 border border-wizard-purple-glow/30 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-wizard-purple-glow">
                    {store.type}
                  </span>
                  {store.verifiedStock && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Stock</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-bold text-white">
                  {store.name}
                </h3>

                {/* Location Meta */}
                <div className="mt-4 space-y-2 text-xs font-mono text-wizard-muted">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-wizard-purple-glow flex-shrink-0 mt-0.5" />
                    <span>
                      {store.address}, {store.city}, {store.state} {store.zip}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <span>{store.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                </div>

                {/* Available Strains in Stock */}
                <div className="mt-5 pt-4 border-t border-white/5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/50 mb-2">
                    Current Verified Cuts in Stock:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {store.availableStrains.map((strain) => (
                      <span
                        key={strain}
                        className="rounded border border-emerald-500/20 bg-emerald-950/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300"
                      >
                        {strain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${store.name} ${store.address} ${store.city} ${store.state}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 px-3 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-wizard-purple-glow hover:text-white transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>

                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/70 hover:text-white hover:border-white/20 transition"
                  aria-label="Visit website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

