'use client';

import React from 'react';
import Link from 'next/link';
import { X, ArrowRight, Instagram, Youtube, MapPin, Sparkles } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { num: '01', label: 'HOME', href: '/' },
  { num: '02', label: 'GENETICS & STRAINS', href: '/strains' },
  { num: '03', label: 'SHOP ALL PRODUCTS', href: '/shop' },
  { num: '04', label: 'STREETWEAR & MERCH', href: '/shop?cat=streetwear' },
  { num: '05', label: 'STORE LOCATOR', href: '/locations' },
  { num: '06', label: 'LOOKBOOK & GALLERY', href: '/gallery' },
  { num: '07', label: 'ABOUT THE CULTIVATION', href: '/about' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08080c]/98 backdrop-blur-2xl p-6 sm:p-12 overflow-y-auto animate-fade-in">
      {/* Cosmic background blur accents */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-wizard-purple/20 flex items-center justify-center text-wizard-purple-glow">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-[0.25em] text-white">
              WIZARD TREES
            </span>
            <span className="block text-[10px] font-mono tracking-widest text-wizard-muted">
              LOS ANGELES CULTIVATION
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 px-4 font-mono text-xs text-white transition hover:border-white/30 hover:bg-white/10"
          aria-label="Close menu"
        >
          <span className="tracking-widest">CLOSE</span>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation Index (The Signature Wizard Trees Numbered Menu) */}
      <div className="relative z-10 my-auto py-8">
        <ul className="space-y-4 sm:space-y-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.num} className="group">
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-4 sm:gap-6 text-white/70 transition-all duration-300 group-hover:text-white group-hover:translate-x-2"
              >
                <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-wizard-purple-glow group-hover:text-wizard-lime transition-colors">
                  {item.num}.
                </span>
                <span className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-widest transition-colors group-hover:text-white">
                  {item.label}
                </span>
                <ArrowRight className="h-5 w-5 sm:h-7 sm:w-7 opacity-0 transition-all duration-300 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 text-wizard-purple-glow" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Meta & Socials */}
      <div className="relative z-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-wizard-lime animate-pulse" />
          <span className="font-mono text-xs text-wizard-muted uppercase tracking-widest">
            Drop Status: Wave 04 Live in CA & FL
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-wizard-muted">
          <Link
            href="/locations"
            onClick={onClose}
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <MapPin className="w-3.5 h-3.5 text-wizard-purple-glow" />
            <span>Store Locator</span>
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@wizardtrees</span>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </a>
        </div>
      </div>
    </div>
  );
}

