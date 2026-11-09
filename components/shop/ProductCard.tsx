'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Plus, Eye, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultWeight = product.weights?.[0];
    const defaultSize = product.sizes?.[0];
    addToCart(
      product,
      {
        weight: defaultWeight,
        size: defaultSize,
        quantity: 1,
      },
      { x: e.clientX, y: e.clientY }
    );
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0e0d16]/70 backdrop-blur-md transition-all duration-300 hover:border-wizard-purple-glow/40 hover:shadow-2xl hover:shadow-purple-950/40 hover:-translate-y-1 cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d16] via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.badge && (
            <span className="rounded-full bg-wizard-purple/80 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {product.stockStatus === 'sold_out' && (
            <span className="rounded-full bg-red-950/80 border border-red-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-red-200">
              Sold Out
            </span>
          )}
          {product.stockStatus === 'low_stock' && (
            <span className="rounded-full bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-200">
              Low Stock
            </span>
          )}
        </div>

        {/* THC Badge if available */}
        {product.thc && (
          <div className="absolute top-3 right-3 z-10 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 backdrop-blur-md">
            THC {product.thc}
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px]">
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-black transition">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Info Content */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-wizard-purple-glow">
            {product.category}
          </p>
          <h3 className="mt-1 font-display text-base font-bold text-white transition-colors group-hover:text-purple-200">
            {product.name}
          </h3>
          {product.lineage ? (
            <p className="mt-1 line-clamp-1 font-mono text-[11px] text-purple-300">
              {product.lineage}
            </p>
          ) : product.subtitle ? (
            <p className="mt-1 line-clamp-1 text-xs text-wizard-muted">
              {product.subtitle}
            </p>
          ) : null}

          {/* Variants info preview */}
          <div className="mt-2 flex flex-wrap gap-1">
            {product.weights?.map((w) => (
              <span
                key={w}
                className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/60"
              >
                {w}
              </span>
            ))}
            {product.sizes?.map((s) => (
              <span
                key={s}
                className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/60"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row: Price & Action */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="font-mono text-xs text-white/40 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stockStatus === 'sold_out'}
            className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 py-1.5 px-3 font-mono text-xs font-semibold text-white transition-all hover:bg-white hover:text-black hover:border-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white"
            aria-label="Add to bag"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { CollectionProductCard } from './CollectionProductCard';


