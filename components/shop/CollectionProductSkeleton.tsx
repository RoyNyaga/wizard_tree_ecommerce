'use client';

import React from 'react';

export function CollectionProductSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Square Image Box Skeleton */}
      <div className="relative aspect-square w-full rounded-xl bg-black/30 border border-white/[0.05] p-3 flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-white/[0.03] animate-pulse" />
      </div>

      {/* Metadata & Pricing Skeleton */}
      <div className="mt-3 flex flex-col space-y-2">
        {/* Product Title */}
        <div className="h-3.5 w-4/5 rounded bg-white/[0.08]" />

        {/* 5 Stars Rating Placeholder */}
        <div className="flex items-center gap-1 py-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-white/[0.05]" />
          ))}
        </div>

        {/* Price Tag */}
        <div className="h-4 w-16 rounded bg-white/[0.08]" />
      </div>
    </div>
  );
}
