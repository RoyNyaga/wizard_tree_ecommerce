'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GalleryItem } from '@/types';
import { Camera, ArrowRight } from 'lucide-react';

interface LookbookPreviewProps {
  items: GalleryItem[];
}

export function LookbookPreview({ items }: LookbookPreviewProps) {
  const previewItems = items.slice(0, 4);

  return (
    <section className="py-24 border-b border-white/10 bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-wizard-purple-glow font-bold flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" />
              <span>05 // THE VISUAL ARCHIVE</span>
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              CULTURE & LOOKBOOK
            </h2>
            <p className="text-sm text-wizard-muted max-w-xl font-normal">
              A behind-the-scenes glimpse into our Los Angeles facilities, high-fashion streetwear capsules, and macro trichome photography.
            </p>
          </div>

          <Link
            href="/gallery"
            className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-white hover:text-wizard-purple-glow transition"
          >
            <span>View Full Visual Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Column Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewItems.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black/60 transition-all hover:border-wizard-purple-glow/50 hover:shadow-2xl hover:shadow-purple-950/40"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-wizard-purple-glow">
                  {item.category}
                </span>
                <h4 className="font-display text-base font-bold text-white mt-0.5">
                  {item.title}
                </h4>
                <p className="font-mono text-[11px] text-wizard-muted line-clamp-1 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

