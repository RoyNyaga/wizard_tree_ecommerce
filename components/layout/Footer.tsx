'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Sparkles, ArrowRight, ShieldAlert, Instagram, Youtube, Twitter } from 'lucide-react';

export function Footer() {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Welcome to the Inner Circle. Watch your inbox for secret drops.');
    setEmail('');
  };

  return (
    <footer className="border-t border-white/10 bg-[#060609] pt-16 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-wizard-purple-glow">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-display font-black text-2xl tracking-[0.25em] text-white">
                WIZARD TREES
              </span>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-wizard-purple-glow">
              Artisanal Genetics. Uncompromising Cultivation.
            </p>
            <p className="text-sm text-wizard-muted max-w-md leading-relaxed">
              Pioneering craft genetics from Los Angeles, California. Home of world-renowned cultivars including ZOAP, RS-11, Zangria, Studio 54, and Black Magic.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="h-2 w-2 rounded-full bg-wizard-lime animate-pulse" />
              <span className="font-mono text-xs text-wizard-muted tracking-widest uppercase">
                Cultivation Facility: Los Angeles, CA // Tier 1 Cleanroom
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
                Directory
              </p>
              <ul className="space-y-2.5 font-mono text-xs text-white/70">
                <li>
                  <Link href="/strains" className="hover:text-wizard-purple-glow transition">
                    Genetics & Strains
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=flower" className="hover:text-wizard-purple-glow transition">
                    Craft Flower
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=preroll" className="hover:text-wizard-purple-glow transition">
                    Hash Holes
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=seeds" className="hover:text-wizard-purple-glow transition">
                    Breeder Seeds
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=streetwear" className="hover:text-wizard-purple-glow transition">
                    Streetwear Merch
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
                Company
              </p>
              <ul className="space-y-2.5 font-mono text-xs text-white/70">
                <li>
                  <Link href="/locations" className="hover:text-wizard-purple-glow transition">
                    Store Locator
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-wizard-purple-glow transition">
                    Lookbook
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-wizard-purple-glow transition">
                    Our Story
                  </Link>
                </li>
                <li>
                  <span className="text-white/40 cursor-not-allowed">
                    Lab Results (COA)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Inner Circle Lead Capture */}
          <div className="lg:col-span-4 space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-wizard-purple-glow">
              VIP Drops Access
            </p>
            <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Join the Inner Circle
            </h3>
            <p className="text-xs text-wizard-muted leading-relaxed">
              Receive private drop notifications for seed lines, limited apparel capsules, and partner dispensary releases before public announcement.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-white px-4 py-2.5 font-mono text-xs font-bold uppercase text-black hover:bg-wizard-purple-glow hover:text-white transition"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Regulatory & Compliance Disclaimers */}
        <div className="my-8 rounded-xl border border-white/5 bg-white/[0.02] p-5 text-left text-xs text-white/40 font-mono space-y-2">
          <div className="flex items-center gap-2 text-wizard-muted">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white/70 uppercase">Mandatory Compliance & Prop 64 Notice</span>
          </div>
          <p className="leading-relaxed">
            For use only by adults twenty-one years of age and older (or eighteen years of age or older for medical patients). Keep out of reach of children. Cannabis products have intoxicating effects and may be habit-forming. Cannabis can impair concentration, coordination, and judgment. Do not operate a vehicle or machinery under the influence. State License: C11-0000984-LIC.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs font-mono text-white/50">
          <p>© {new Date().getFullYear()} Wizard Trees Inc. All rights reserved. Cultivated in Los Angeles.</p>
          <div className="flex items-center gap-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

