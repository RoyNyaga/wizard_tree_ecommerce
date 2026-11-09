'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, Plus, Eye } from 'lucide-react';

export interface CollectionProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onCardClick?: (product: Product) => void;
  href?: string;
  className?: string;
  showQuickAdd?: boolean;
}

export function CollectionProductCard({
  product,
  onQuickView,
  onCardClick,
  href,
  className = '',
  showQuickAdd = true,
}: CollectionProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleCardClick = (e: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(product);
      return;
    }
    const targetUrl = href || `/products/${product.id}`;
    router.push(targetUrl);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* Product Image Container (Minimalist, dark/transparent background matching spec) */}
      <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/20 p-2 sm:p-3 transition-colors duration-300 group-hover:bg-white/[0.03]">
        <div className="relative w-full h-full">
          <Image
            src={product.image || '/images/wizard_trees_photo.png'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-xl"
          />
        </div>

        {/* Stock status overlay badge */}
        {product.stockStatus === 'sold_out' && (
          <div className="absolute top-2 left-2 z-10">
            <span className="rounded bg-red-950/80 border border-red-500/40 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-red-200">
              Sold Out
            </span>
          </div>
        )}

        {/* Hover quick action pill */}
        {showQuickAdd && (
          <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-center gap-1.5 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              disabled={product.stockStatus === 'sold_out'}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 py-2 px-3 text-xs font-semibold text-white hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              title="Add to Cart"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="flex items-center justify-center p-2 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all shadow-lg active:scale-95"
                title="Quick View"
                aria-label="Quick View"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Metadata & Pricing (formatted according to Annotation screenshot) */}
      <div className="mt-3 flex flex-col">
        {/* Title & Lineage line */}
        <h3 className="text-[13px] sm:text-sm font-medium text-white/95 leading-snug line-clamp-2 group-hover:text-purple-200 transition-colors">
          {product.name}
          {product.lineage ? (
            <span className="font-normal text-white/80"> Lineage: {product.lineage}</span>
          ) : null}
        </h3>

        {/* 5 Gold Stars Rating */}
        <div className="flex items-center gap-0.5 mt-1 text-amber-400" aria-label="5 star rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Price display */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-semibold text-white">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-white/40 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

