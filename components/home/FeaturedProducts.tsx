'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductModal } from '@/components/shop/ProductModal';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => p.category === activeTab);

  return (
    <section className="py-24 border-b border-white/10 bg-[#08080c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-wizard-purple-glow font-bold flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>03 // DROPS & CATALOG</span>
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              CRAFT COLLECTIONS
            </h2>
            <p className="text-sm text-wizard-muted max-w-xl font-normal">
              From cold-cured single-source indoor flower jars to French Terry streetwear and certified breeder genetics.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'flower', label: 'Flower Jars' },
              { id: 'preroll', label: 'Hash Holes' },
              { id: 'streetwear', label: 'Streetwear' },
              { id: 'seeds', label: 'Breeder Seeds' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>

        {/* View All Store Link */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition active:scale-95"
          >
            <span>VIEW COMPLETE ONLINE SHOP</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}

