'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, ProductCategory } from '@/types';
import { PRODUCTS_DATA } from '@/lib/mockData';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductModal } from '@/components/shop/ProductModal';
import { ShoppingBag, Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';
  const initialStrain = searchParams.get('strain') || '';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (searchParams.get('cat')) {
      setActiveCategory(searchParams.get('cat')!);
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'flower', label: 'Flower Jars' },
    { id: 'preroll', label: 'Hash Holes & Cones' },
    { id: 'seeds', label: 'Breeder Seeds' },
    { id: 'streetwear', label: 'Streetwear & Merch' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.subtitle && product.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.strainName && product.strainName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStrain =
      !initialStrain ||
      (product.strainId && product.strainId.toLowerCase().includes(initialStrain.toLowerCase())) ||
      (product.strainName && product.strainName.toLowerCase().includes(initialStrain.toLowerCase()));

    return matchesCategory && matchesSearch && matchesStrain;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // 'featured' retains mock ordering
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-3.5 py-1 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-wizard-purple-glow" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-200">
              03 // COMPLETE CATALOG
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-white">
            THE VAULT & APPAREL
          </h1>

          <p className="mt-2 text-sm sm:text-base text-wizard-muted max-w-2xl font-normal leading-relaxed">
            Authentic Wizard Trees flower, hand-crafted live rosin hash holes, authenticated souvenir breeder seed packs, and custom 500 GSM heavyweight streetwear.
          </p>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="py-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-white/5">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
                  activeCategory === cat.id
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 font-mono text-xs text-white placeholder-white/30 outline-none focus:border-wizard-purple-glow"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white outline-none focus:border-wizard-purple-glow cursor-pointer"
            >
              <option value="featured" className="bg-[#0b0a12] text-white">Featured</option>
              <option value="price-low" className="bg-[#0b0a12] text-white">Price: Low to High</option>
              <option value="price-high" className="bg-[#0b0a12] text-white">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Strain Filter Indicator */}
        {initialStrain && (
          <div className="my-4 inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-950/20 px-3 py-1 font-mono text-xs text-purple-200">
            <span>Filtering products matching: <strong>{initialStrain}</strong></span>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/30 mb-4">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white">
              No products found
            </h3>
            <p className="mt-1 font-mono text-xs text-wizard-muted">
              Try adjusting your category filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Quick View Modal */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07070a] pt-32 text-center font-mono text-xs text-white">Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}

