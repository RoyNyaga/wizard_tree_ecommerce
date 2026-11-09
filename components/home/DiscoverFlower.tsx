'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function DiscoverFlower() {
  return (
    <section className="relative w-full bg-[#07040d] overflow-hidden flex items-center justify-center">
      {/* Container with widescreen height so jar scales out vertically */}
      <div className="relative w-full h-[480px] sm:h-[560px] md:h-[640px] lg:h-[720px] overflow-hidden flex items-center justify-center">

        {/* Background Image: Scaled out so only the middle half of the vertical jar is visible */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full scale-[1.65] sm:scale-[1.95] md:scale-[2.2] lg:scale-[2.35] transition-transform duration-500">
            <Image
              src="/images/wizard_trees_photo.png"
              alt="Discover our Flower - Wizard Trees"
              fill
              priority
              sizes="100vw"
              className="object-contain object-center"
            />
          </div>
        </div>

        {/* Dark Purple Atmospheric Vignette & Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(76,29,149,0.22)_0%,_rgba(35,10,55,0.45)_55%,_rgba(7,4,13,0.92)_100%)] pointer-events-none" />

        {/* Subtle Top & Bottom dark fade edges */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#07040d] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07040d] to-transparent pointer-events-none" />

        {/* Text and Button Overlay (Centered over the lower half of the jar) */}
        <div className="absolute bottom-10 sm:bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center gap-2.5 sm:gap-3 w-full px-4">
          {/* Headline */}
          <h2 className="text-white font-extrabold text-xs sm:text-sm md:text-base tracking-[0.22em] uppercase font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            DISCOVER OUR FLOWER
          </h2>

          {/* View Button */}
          <Link
            href="/collection/flower"
            className="px-5 py-1.5 sm:px-6 sm:py-2 rounded-md border border-white/75 bg-black/40 backdrop-blur-sm text-white font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-200 active:scale-95 shadow-xl shadow-black/80"
          >
            VIEW
          </Link>
        </div>
      </div>
    </section>
  );
}
