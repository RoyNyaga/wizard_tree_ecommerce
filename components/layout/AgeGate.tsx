'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, Sparkles } from 'lucide-react';

export function AgeGate() {
  const pathname = usePathname();
  const { isAgeVerified, verifyAge } = useCart();
  const [remember, setRemember] = useState(true);

  // Do not block admin workspace with customer age gate
  if (pathname?.startsWith('/admin') || isAgeVerified) return null;

  const handleExit = () => {
    window.location.href = 'https://google.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      {/* Cosmic background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Modal card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b12]/90 p-8 sm:p-10 text-center shadow-2xl shadow-purple-950/80 backdrop-blur-xl">
        {/* Subtle top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wizard-purple-glow to-transparent" />

        {/* Brand Header Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-wizard-purple-glow">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>

        {/* Brand Name */}
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-wizard-muted">
          Los Angeles, California
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-widest text-white">
          WIZARD TREES
        </h1>
        <p className="mt-1 text-[11px] font-mono tracking-widest text-wizard-purple-glow">
          CRAFT GENETICS & STREETWEAR
        </p>

        {/* Age message */}
        <div className="my-8 rounded-xl border border-white/5 bg-white/[0.02] p-5 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-wizard-lime" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Age Verification Required
              </h2>
              <p className="mt-1 text-xs text-wizard-muted leading-relaxed">
                By entering this platform, you affirm and verify that you are at least 21 years of age, or a qualified medical cannabis patient under applicable state laws.
              </p>
            </div>
          </div>
        </div>

        {/* Remember me checkbox */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <input
            id="remember-age"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-black/40 text-wizard-purple accent-wizard-purple focus:ring-purple-500"
          />
          <label htmlFor="remember-age" className="text-xs text-wizard-muted cursor-pointer select-none">
            Remember my age verification on this device
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => verifyAge(remember)}
            className="w-full flex-1 rounded-xl bg-white py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-wizard-purple-glow hover:text-white hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
          >
            I am 21 or older
          </button>
          <button
            onClick={handleExit}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 py-3.5 px-6 font-mono text-xs font-semibold uppercase tracking-widest text-wizard-muted transition-all hover:border-white/20 hover:text-white active:scale-[0.98]"
          >
            Exit
          </button>
        </div>

        <p className="mt-6 text-[10px] text-white/30 font-mono">
          Prop 64 / CDPH-10002844 / For adult-use 21+ only
        </p>
      </div>
    </div>
  );
}

