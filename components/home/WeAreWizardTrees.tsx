'use client';

import React from 'react';
import Image from 'next/image';

export function WeAreWizardTrees() {
  return (
    <section className="relative w-full bg-[#07040d] overflow-hidden flex items-center justify-center border-t border-white/[0.04]">
      {/* Container with widescreen height matching the banner */}
      <div className="relative w-full h-[420px] sm:h-[500px] md:h-[580px] lg:h-[660px] overflow-hidden flex items-center justify-center">
        
        {/* Background Image: Mystical Wizard Trees Cottage Scene */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/home/9.jpg"
            alt="We Are Wizard Trees - Fantasy Landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Ambient Dark Overlay to match the website's moody contrast */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Top & Bottom dark fade edges for smooth section blending */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#07040d] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07040d] to-transparent pointer-events-none" />

        {/* Center Content: WE ARE WIZARD TREES + TELEGRAM Button */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 px-4 max-w-4xl mx-auto">
          {/* Two-line Headline */}
          <h2 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.16em] sm:tracking-[0.2em] uppercase font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-tight">
            WE ARE<br />WIZARD TREES
          </h2>

          {/* Telegram Button */}
          <a
            href="https://t.me/wizardtree420"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-1.5 sm:px-6 sm:py-2 rounded-md border border-white/75 bg-black/40 backdrop-blur-sm text-white font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-200 active:scale-95 shadow-xl shadow-black/80"
          >
            TELEGRAM
          </a>
        </div>
      </div>
    </section>
  );
}

