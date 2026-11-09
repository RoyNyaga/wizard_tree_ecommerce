'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, ShieldCheck, Sparkles, ShoppingBag, Dna } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<string | undefined>(
    product?.weights?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const handleAdd = (e: React.MouseEvent) => {
    addToCart(
      product,
      {
        size: selectedSize,
        weight: selectedWeight,
        quantity,
      },
      { x: e.clientX, y: e.clientY }
    );
    onClose();
  };

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b13] shadow-2xl shadow-purple-950/60 z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full border border-white/10 bg-black/60 p-2 text-white/70 hover:text-white hover:bg-black/80 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Gallery */}
          <div className="relative flex flex-col bg-black/40 p-6 border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10">
              <Image
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 rounded-full bg-wizard-purple/90 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-wizard-purple-glow'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & Purchase */}
          <div className="flex flex-col justify-between p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-wizard-purple-glow">
                  {product.category}
                </span>
                {product.thc && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                    THC {product.thc}
                  </span>
                )}
              </div>

              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
                {product.name}
              </h2>
              {product.lineage && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 px-2.5 py-1 text-xs font-mono text-purple-200">
                  <Dna className="w-3.5 h-3.5 text-wizard-purple-glow" />
                  <span>Lineage: <strong className="text-white">{product.lineage}</strong></span>
                </div>
              )}
              {product.subtitle && !product.lineage && (
                <p className="mt-1 font-mono text-xs text-wizard-muted">
                  {product.subtitle}
                </p>
              )}

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="font-mono text-sm text-white/40 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Weight Selector */}
              {product.weights && product.weights.length > 0 && (
                <div className="mt-6">
                  <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                    Select Weight
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.weights.map((wt) => (
                      <button
                        key={wt}
                        onClick={() => setSelectedWeight(wt)}
                        className={`rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition ${
                          selectedWeight === wt
                            ? 'border-wizard-purple-glow bg-wizard-purple/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
                        }`}
                      >
                        {wt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                  <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                    Select Streetwear Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-10 rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition ${
                          selectedSize === sz
                            ? 'border-wizard-purple-glow bg-wizard-purple/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="mt-6 text-sm text-wizard-muted leading-relaxed">
                {product.description}
              </p>

              {/* Technical Details list */}
              {product.details && product.details.length > 0 && (
                <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <ul className="space-y-1.5 font-mono text-xs text-white/70">
                    {product.details.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-wizard-purple-glow" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions & Quantity */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded-xl bg-white/5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-white/70 hover:text-white transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-mono text-sm text-white font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-white/70 hover:text-white transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.stockStatus === 'sold_out'}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {product.stockStatus === 'sold_out'
                      ? 'SOLD OUT'
                      : `ADD TO BAG • $${(product.price * quantity).toFixed(2)}`}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-white/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Cleanroom Cultivation // Los Angeles, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

