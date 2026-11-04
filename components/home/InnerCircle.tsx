'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Sparkles, ArrowRight, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

export function InnerCircle() {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    showToast('You are now registered in the Inner Circle VIP ledger.');
  };

  return (
    <section className="py-24 bg-[#050508] relative overflow-hidden">
      {/* Background Cosmic Violet Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-4 py-1.5 backdrop-blur-md mb-6">
          <Sparkles className="w-3.5 h-3.5 text-wizard-purple-glow animate-pulse" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-200">
            06 // PRIVATE MEMBERSHIP
          </span>
        </div>

        <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          ENTER THE INNER CIRCLE
        </h2>

        <p className="mt-4 text-sm sm:text-base text-wizard-muted max-w-xl mx-auto leading-relaxed">
          The most coveted Wizard Trees drops never reach general retail. Join the encrypted direct-dispatch list for breeder seed lines, limited streetwear drops, and harvest notifications.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 max-w-md mx-auto text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white">
              ACCESS GRANTED
            </h3>
            <p className="text-xs font-mono text-emerald-300">
              Your contact details have been queued for next-wave seed allocations and private drops.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-3">
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1.5 focus-within:border-wizard-purple-glow transition">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent px-4 py-2.5 font-mono text-xs text-white placeholder-white/30 outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-white px-5 py-2.5 font-mono text-xs font-bold uppercase text-black hover:bg-wizard-purple-glow hover:text-white transition flex-shrink-0"
              >
                <span>JOIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-white/40 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strictly 0% Spam. Unsubscribe at any time.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

