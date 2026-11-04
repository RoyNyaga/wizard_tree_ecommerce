'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

export function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface border border-wizard-purple-glow/50 px-5 py-3.5 rounded-lg shadow-2xl shadow-purple-950/50 backdrop-blur-md animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-wizard-purple/20 flex items-center justify-center text-wizard-purple-glow">
        <Sparkles className="w-4 h-4 animate-spin-slow" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-wizard-purple-glow font-mono">Status Update</p>
        <p className="text-sm font-medium text-white">{toastMessage}</p>
      </div>
    </div>
  );
}

