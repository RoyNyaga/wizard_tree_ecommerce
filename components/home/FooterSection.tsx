'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export function FooterSection() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="w-full bg-black text-white overflow-hidden border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 pt-16 sm:pt-20 pb-10">

        {/* Top Left: Telegram Announcement */}
        <div className="mb-10 sm:mb-14">
          <a
            href="https://t.me/wizardtree420"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block group"
          >
            <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider font-sans group-hover:text-purple-300 transition-colors">
              TELEGRAM ANNOUCEMENT
            </h3>
            <p className="text-white/70 text-xs sm:text-sm mt-1 group-hover:text-white transition-colors">
              Get exclusive deals and early access to new products.
            </p>
          </a>
        </div>

        {/* Center: Subscribe to our emails */}
        <div className="max-w-xl mx-auto text-center flex flex-col items-center mb-16 sm:mb-24">
          <h2 className="text-white font-bold text-3xl sm:text-4xl md:text-[44px] tracking-tight font-sans leading-tight">
            Subscribe to our emails
          </h2>
          <p className="text-white/75 text-xs sm:text-sm mt-3 font-sans">
            Be the first to know about new collections and special offers.
          </p>

          {/* Email input field matching the screenshot */}
          <form onSubmit={handleSubmit} className="mt-8 w-full max-w-[520px]">
            <div className="relative flex items-center w-full shadow-2xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-white text-black placeholder-neutral-500 text-sm px-5 py-3.5 pr-12 rounded-[3px] border-none focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <button
                type="submit"
                aria-label="Submit email address"
                className="absolute right-3.5 p-1 text-black hover:opacity-70 transition-opacity"
              >
                <ArrowRight className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>

            {submitted && (
              <p className="text-emerald-400 text-xs mt-3 font-sans animate-fade-in">
                Thank you for subscribing! You will receive our latest updates.
              </p>
            )}
          </form>
        </div>

        {/* Bottom Horizontal Divider Line */}
        <div className="w-full border-t border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-white/50 font-sans gap-4">
          <p>© 2026 Wizard Trees, Powered by Shopify</p>

          <div className="flex items-center gap-6">
            <a
              href="/about"
              className="hover:text-white transition-colors"
            >
              Terms and Policies
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

