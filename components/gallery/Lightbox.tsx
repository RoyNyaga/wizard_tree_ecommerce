'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/types';
import { X, ChevronLeft, ChevronRight, Sparkles, ZoomIn } from 'lucide-react';

interface LightboxProps {
  items: GalleryItem[];
}

export function Lightbox({ items }: LightboxProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Artisanal Genetics', 'Grow Facility', 'Streetwear Drop', 'Events & Culture'];

  const filteredItems = activeCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const activeItem = selectedIdx !== null ? filteredItems[selectedIdx] : null;

  const handleNext = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
              activeCategory === cat
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-Style Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedIdx(idx)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/60 cursor-pointer transition-all hover:border-wizard-purple-glow/50 hover:shadow-2xl hover:shadow-purple-950/40"
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Zoom Icon indicator */}
            <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </div>

            {/* Caption */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-wizard-purple-glow">
                {item.category}
              </span>
              <h3 className="font-display text-lg font-bold text-white mt-0.5">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-wizard-muted line-clamp-1 mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal Lightbox */}
      {activeItem && selectedIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          {/* Close button */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-6 right-6 z-20 rounded-full border border-white/20 bg-white/10 p-2.5 text-white hover:bg-white hover:text-black transition"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full border border-white/20 bg-white/10 p-3 text-white hover:bg-white hover:text-black transition"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full border border-white/20 bg-white/10 p-3 text-white hover:bg-white hover:text-black transition"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Media Container */}
          <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden border border-white/10 bg-black">
              <Image
                src={activeItem.imageUrl}
                alt={activeItem.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Bottom Caption */}
            <div className="mt-4 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-wizard-purple-glow">
                {activeItem.category} // {selectedIdx + 1} of {filteredItems.length}
              </span>
              <h2 className="font-display text-2xl font-bold text-white mt-1">
                {activeItem.title}
              </h2>
              <p className="font-mono text-sm text-wizard-muted mt-1">
                {activeItem.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

