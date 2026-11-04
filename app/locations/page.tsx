import React from 'react';
import { getStoreLocations } from '@/lib/services';
import { StoreLocator } from '@/components/locations/StoreLocator';
import { MapPin, Sparkles, Navigation, ShieldCheck } from 'lucide-react';

export default async function LocationsPage() {
  const locations = await getStoreLocations();

  const stateRollouts = [
    { state: 'California', status: 'Active Statewide // Flagships Open', active: true },
    { state: 'Michigan', status: 'Active // Select Partner Dispensaries', active: true },
    { state: 'Florida', status: 'Active // Medical Partner Drops', active: true },
    { state: 'Arizona', status: 'Active // Licensed Dispensaries', active: true },
    { state: 'New York', status: 'Expanding 2026 // Adult-Use Wave', active: false },
    { state: 'Pennsylvania', status: 'Expanding 2026 // Medical Rollout', active: false },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-3.5 py-1 mb-4">
            <MapPin className="w-3.5 h-3.5 text-wizard-purple-glow" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-200">
              04 // RETAIL DISPENSARY NETWORK
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-white">
            STORE LOCATOR
          </h1>

          <p className="mt-2 text-sm sm:text-base text-wizard-muted max-w-2xl font-normal leading-relaxed">
            Locate authorized partner dispensaries carrying verified, fresh-drop Wizard Trees craft flower jars and live rosin hash holes.
          </p>
        </div>

        {/* State Rollout Tracker Banner */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0b13] p-6 sm:p-8">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-wizard-purple-glow" />
            <span>State Availability & Rollout Tracker</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stateRollouts.map((r, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center justify-between font-mono text-xs"
              >
                <div>
                  <p className="font-bold text-white">{r.state}</p>
                  <p className="text-[11px] text-wizard-muted mt-0.5">{r.status}</p>
                </div>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    r.active ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400/50'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Locator Component */}
        <StoreLocator locations={locations} />
      </div>
    </div>
  );
}

