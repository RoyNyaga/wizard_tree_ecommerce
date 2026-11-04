'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function DiscoverFlower() {
  return (
    <section className="relative w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Container with responsive height to showcase the jar */}
      <div className="relative w-full h-[450px] sm:h-[580px] md:h-[680px] lg:h-[780px] max-h-[90vh]">
        {/* Background Image: Wizard Trees Black Magic Jar */}
        <Image
          src="/images/wizard_trees_photo.png"
          alt="Discover our Flower - Wizard Trees"
          fill
          priority
          sizes="100vw"
          className="object-contain object-center scale-105 sm:scale-100"
        />

        {/* Text and Button Overlay */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center gap-3 w-full px-4">
          {/* Title */}
          <h2 className="text-white font-extrabold text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-sans drop-shadow-md">
            DISCOVER OUR FLOWER
          </h2>

          {/* View Button */}
          <Link
            href="/shop?cat=flower"
            className="px-5 py-1.5 sm:px-6 sm:py-2 rounded-lg border border-white/70 bg-transparent text-white font-sans text-[11px] sm:text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-200 active:scale-95 shadow-lg"
          >
            VIEW
          </Link>
        </div>
      </div>
    </section>
  );
}

