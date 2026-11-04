'use client';

import React from 'react';
import Link from 'next/link';
import { DropAnnouncement } from '@/types';
import { Sparkles, ArrowRight, BellRing } from 'lucide-react';

interface DropBannerProps {
  drops: DropAnnouncement[];
}

export function DropBanner({ drops }: DropBannerProps) {
  return (
    <section className="border-b border-white/10 bg-[#0a0910] py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-wizard-lime animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-white">
              ACTIVE & UPCOMING DROPS
            </span>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 font-mono text-xs text-wizard-purple-glow hover:text-white transition uppercase tracking-wider"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {drops.map((drop) => (
            <div
              key={drop.id}
              className="relative rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md transition-all hover:border-wizard-purple-glow/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded bg-wizard-purple/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-wizard-purple-glow">
                  {drop.tag}
                </span>
                <span className="font-mono text-[11px] text-wizard-lime font-semibold">
                  {drop.date}
                </span>
              </div>

              <h4 className="font-display text-base font-bold text-white mt-1">
                {drop.title}
              </h4>

              <p className="font-mono text-xs text-wizard-muted mt-2 line-clamp-2 leading-relaxed">
                {drop.description}
              </p>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>{drop.location}</span>
                <span className="text-white hover:text-wizard-purple-glow flex items-center gap-1">
                  Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

