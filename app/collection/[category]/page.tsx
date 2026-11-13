'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Product, ProductCategory } from '@/types';
import { PRODUCTS_DATA } from '@/lib/mockData';
import { fetchCompanyProducts, DbProduct } from '@/lib/supabase/products';
import { fetchCompanyCategories } from '@/lib/supabase/categories';
import { CollectionProductCard } from '@/components/shop/CollectionProductCard';
import { CollectionProductSkeleton } from '@/components/shop/CollectionProductSkeleton';
import { ProductModal } from '@/components/shop/ProductModal';
import {
  ChevronDown,
  LayoutGrid,
  Grid3X3,
  Check,
  SlidersHorizontal,
  PackageX,
} from 'lucide-react';

function mapDbProductToProduct(db: DbProduct): Product {
  const catSlug = db.category_data?.slug || db.category || 'flower';
  const catName = db.category_data?.name || db.category.toUpperCase();

  return {
    id: db.id,
    slug: db.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    name: db.name,
    subtitle: db.lineage || `${catName} // CRAFT`,
    lineage: db.lineage || undefined,
    category: (catSlug as ProductCategory) || 'flower',
    price: Number(db.price),
    image: db.images?.[0] || '/images/wizard_trees_photo.png',
    galleryImages: db.images?.length ? db.images : ['/images/wizard_trees_photo.png'],
    description: db.description || 'Artisanal cultivar from Wizard Trees Los Angeles cleanroom facilities.',
    stockStatus: db.quantity <= 0 ? 'sold_out' : db.quantity <= 5 ? 'low_stock' : 'in_stock',
    badge: db.availability ? 'AVAILABLE' : 'ARCHIVED',
    createdAt: db.created_at,
  };
}

const CATEGORY_TITLES: Record<string, { title: string; subtitle: string }> = {
  flower: {
    title: 'FLOWER',
    subtitle: 'DISCOVER OUR PRODUCT',
  },
  seeds: {
    title: 'SEEDS',
    subtitle: 'OFFICIAL WIZARD TREES GENETICS',
  },
  other: {
    title: 'OTHER',
    subtitle: 'PRE-ROLLS, CONES & EXCLUSIVE MERCH',
  },
  others: {
    title: 'OTHER',
    subtitle: 'PRE-ROLLS, CONES & EXCLUSIVE MERCH',
  },
};

type AvailabilityFilter = 'all' | 'in_stock' | 'out_of_stock';
type SortOption = 'featured' | 'alpha_asc' | 'alpha_desc' | 'price_low' | 'price_high';

export default function CollectionCategoryPage() {
  const params = useParams();
  const categoryParam = ((params?.category as string) || 'flower').toLowerCase();

  // Filters & layout state
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridCols, setGridCols] = useState<4 | 5>(5); // default 5 matching screenshot
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch live categories
  const { data: dbCategories = [] } = useQuery({
    queryKey: ['public_categories'],
    queryFn: fetchCompanyCategories,
  });

  // Fetch live products from Supabase
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['public_products'],
    queryFn: () => fetchCompanyProducts({ status: 'published' }),
  });

  // Display only real products gotten directly from Supabase
  const allProducts = useMemo(() => {
    return dbProducts.map(mapDbProductToProduct);
  }, [dbProducts]);

  // Determine header texts
  const headerMeta = useMemo(() => {
    if (CATEGORY_TITLES[categoryParam]) {
      return CATEGORY_TITLES[categoryParam];
    }
    const matchingDbCat = dbCategories.find(
      (c) => c.slug.toLowerCase() === categoryParam
    );
    if (matchingDbCat) {
      return {
        title: matchingDbCat.name.toUpperCase(),
        subtitle: 'DISCOVER OUR PRODUCT',
      };
    }
    return {
      title: categoryParam.toUpperCase(),
      subtitle: 'DISCOVER OUR PRODUCT',
    };
  }, [categoryParam, dbCategories]);

  // Filter products by category
  const categoryProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const pCat = product.category?.toLowerCase() || '';
      if (categoryParam === 'flower') {
        return pCat === 'flower' || pCat === 'flowers';
      }
      if (categoryParam === 'seeds') {
        return pCat === 'seeds' || pCat === 'seed';
      }
      if (categoryParam === 'other' || categoryParam === 'others') {
        return (
          pCat === 'other' ||
          pCat === 'others' ||
          pCat === 'preroll' ||
          pCat === 'streetwear' ||
          pCat === 'accessories'
        );
      }
      return pCat === categoryParam;
    });
  }, [allProducts, categoryParam]);

  // Apply availability and sorting
  const processedProducts = useMemo(() => {
    let result = [...categoryProducts];

    // Availability Filter
    if (availabilityFilter === 'in_stock') {
      result = result.filter((p) => p.stockStatus !== 'sold_out');
    } else if (availabilityFilter === 'out_of_stock') {
      result = result.filter((p) => p.stockStatus === 'sold_out');
    }

    // Sort
    switch (sortBy) {
      case 'alpha_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        // maintain default sequence
        break;
    }

    return result;
  }, [categoryProducts, availabilityFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#242426] text-white">
      {/* Outer Container with top navbar spacing */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-24">
        {/* ======================================================== */}
        {/* HEADER SECTION (FLOWER / DISCOVER OUR PRODUCT)            */}
        {/* ======================================================== */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
            {headerMeta.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-semibold tracking-[0.25em] text-white/70 uppercase">
            {headerMeta.subtitle}
          </p>
        </div>

        {/* ======================================================== */}
        {/* TOOLBAR CONTROLS BAR (Availability, Count, Sort, Grid)  */}
        {/* ======================================================== */}
        <div className="relative flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-white/[0.08] z-20">
          {/* Left: Availability Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAvailabilityOpen((prev) => !prev);
                setIsSortOpen(false);
              }}
              className="inline-flex items-center gap-1.5 text-sm sm:text-[15px] font-normal text-white/90 hover:text-white transition py-1"
              aria-expanded={isAvailabilityOpen}
            >
              <span>Availability</span>
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isAvailabilityOpen ? 'rotate-180' : ''
                  }`}
              />
              {availabilityFilter !== 'all' && (
                <span className="w-1.5 h-1.5 rounded-full bg-wizard-purple-glow ml-0.5" />
              )}
            </button>

            {/* Availability Dropdown */}
            {isAvailabilityOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsAvailabilityOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#1e1e20] p-1.5 shadow-2xl z-30">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'in_stock', label: 'In Stock' },
                    { id: 'out_of_stock', label: 'Out of Stock' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setAvailabilityFilter(opt.id as AvailabilityFilter);
                        setIsAvailabilityOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-md transition ${availabilityFilter === opt.id
                        ? 'bg-white/15 text-white font-medium'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span>{opt.label}</span>
                      {availabilityFilter === opt.id && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Item Counter, Sort Filter, Grid View Switcher */}
          <div className="flex items-center gap-5 sm:gap-6 ml-auto">
            {/* Item Counter */}
            <span className="text-sm font-normal text-white/70">
              {isLoading ? (
                <span className="inline-block w-14 h-4 bg-white/10 rounded animate-pulse align-middle" />
              ) : (
                `${processedProducts.length} items`
              )}
            </span>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSortOpen((prev) => !prev);
                  setIsAvailabilityOpen(false);
                }}
                className="inline-flex items-center gap-1.5 text-sm sm:text-[15px] font-normal text-white/90 hover:text-white transition py-1"
                aria-expanded={isSortOpen}
              >
                <span>Sort</span>
                <ChevronDown
                  className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {/* Sort Menu */}
              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-52 rounded-lg border border-white/10 bg-[#1e1e20] p-1.5 shadow-2xl z-30">
                    {[
                      { id: 'featured', label: 'Featured' },
                      { id: 'alpha_asc', label: 'Alphabetically, A-Z' },
                      { id: 'alpha_desc', label: 'Alphabetically, Z-A' },
                      { id: 'price_low', label: 'Price, low to high' },
                      { id: 'price_high', label: 'Price, high to low' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id as SortOption);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-md transition ${sortBy === opt.id
                          ? 'bg-white/15 text-white font-medium'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Grid Layout View Switcher */}
            <div className="hidden sm:flex items-center gap-1 border-l border-white/15 pl-4">
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded transition ${gridCols === 4
                  ? 'text-white bg-white/15'
                  : 'text-white/40 hover:text-white/80'
                  }`}
                title="4 Columns View"
                aria-label="4 Columns View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(5)}
                className={`p-1.5 rounded transition ${gridCols === 5
                  ? 'text-white bg-white/15'
                  : 'text-white/40 hover:text-white/80'
                  }`}
                title="5 Columns View"
                aria-label="5 Columns View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PRODUCT GRID SECTION                                     */}
        {/* ======================================================== */}
        {isLoading ? (
          <div
            className={`mt-8 sm:mt-10 grid gap-x-6 sm:gap-x-7 gap-y-12 sm:gap-y-14 ${gridCols === 4
                ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              }`}
          >
            {[...Array(gridCols === 4 ? 8 : 10)].map((_, i) => (
              <CollectionProductSkeleton key={i} />
            ))}
          </div>
        ) : processedProducts.length > 0 ? (
          <div
            className={`mt-8 sm:mt-10 grid gap-x-6 sm:gap-x-7 gap-y-12 sm:gap-y-14 ${gridCols === 4
                ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              }`}
          >
            {processedProducts.map((product) => (
              <CollectionProductCard
                key={product.id}
                product={product}
                href={`/products/${product.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <PackageX className="w-12 h-12 text-white/30 mb-3" />
            <h3 className="text-lg font-medium text-white">No products found</h3>
            <p className="text-sm text-white/60 mt-1 max-w-sm">
              We couldn&apos;t find any items matching your current filters in this collection.
            </p>
            <button
              onClick={() => {
                setAvailabilityFilter('all');
                setSortBy('featured');
              }}
              className="mt-4 px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick View Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

