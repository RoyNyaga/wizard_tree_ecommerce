import React from 'react';
import { getGalleryItems } from '@/lib/services';
import { Lightbox } from '@/components/gallery/Lightbox';
import { Camera, Sparkles } from 'lucide-react';

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-3.5 py-1 mb-4">
            <Camera className="w-3.5 h-3.5 text-wizard-purple-glow" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-200">
              05 // VISUAL VAULT
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-white">
            LOOKBOOK & GALLERY
          </h1>

          <p className="mt-2 text-sm sm:text-base text-wizard-muted max-w-2xl font-normal leading-relaxed">
            High-resolution visual documentation of our cleanroom grows, macro trichome structures, solventless crafting sessions, and limited streetwear drops. Click any image for full-screen inspection.
          </p>
        </div>

        {/* Lightbox Masonry Component */}
        <Lightbox items={items} />
      </div>
    </div>
  );
}

