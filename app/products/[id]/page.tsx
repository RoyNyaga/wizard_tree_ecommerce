'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Product, ProductCategory } from '@/types';
import { PRODUCTS_DATA } from '@/lib/mockData';
import { fetchCompanyProducts, DbProduct } from '@/lib/supabase/products';
import { CollectionProductCard } from '@/components/shop/CollectionProductCard';
import { useCart } from '@/context/CartContext';
import {
  Star,
  ArrowLeft,
  ChevronRight,
  Package,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Dna,
  Check,
  Minus,
  Plus,
} from 'lucide-react';

function mapDbProductToProduct(db: DbProduct): Product {
  const catSlug = db.category_data?.slug || db.category || 'flower';
  const catName = db.category_data?.name || db.category.toUpperCase();

  const allImgs: string[] = [];
  if (Array.isArray(db.images) && db.images.length > 0) {
    db.images.forEach((img) => {
      if (img && typeof img === 'string' && img.trim()) {
        allImgs.push(img.trim());
      }
    });
  }

  const primaryImage = allImgs[0] || '/images/wizard_trees_photo.png';

  return {
    id: db.id,
    slug: db.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    name: db.name,
    brand: db.brand || undefined,
    subtitle: db.lineage || `${catName} // LA CRAFT`,
    lineage: db.lineage || undefined,
    category: (catSlug as ProductCategory) || 'flower',
    price: Number(db.price),
    image: primaryImage,
    galleryImages: allImgs.length > 0 ? allImgs : [primaryImage],
    description: db.description || 'Artisanal cultivar from Wizard Trees Los Angeles cleanroom facilities.',
    stockStatus: db.quantity <= 0 ? 'sold_out' : db.quantity <= 5 ? 'low_stock' : 'in_stock',
    badge: db.availability ? 'AVAILABLE' : 'ARCHIVED',
    createdAt: db.created_at,
    flavors: db.flavors || undefined,
  };
}

export default function ProductShowPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';
  const { addToCart } = useCart();

  // State for active image lightbox or preview
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Vape specific state
  const [selectedFlavorIndex, setSelectedFlavorIndex] = useState(0);
  const [vapeQuantity, setVapeQuantity] = useState(1);

  // Fetch all published products from Supabase
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['public_products'],
    queryFn: () => fetchCompanyProducts({ status: 'published' }),
  });

  // Find product by id or slug
  // Vape products are excluded from mock fallback — they must come from the DB only
  const { currentProduct, allProductsList } = useMemo(() => {
    const liveItems: Product[] = dbProducts.map(mapDbProductToProduct);
    const mockFallback = PRODUCTS_DATA.filter((p) => p.category !== 'vapes');
    const combined = [...liveItems, ...mockFallback];

    const found = combined.find(
      (p) =>
        p.id === rawId ||
        p.slug === rawId ||
        p.id.toLowerCase() === rawId.toLowerCase()
    );

    return {
      currentProduct: found || null,
      allProductsList: combined,
    };
  }, [dbProducts, rawId]);

  // Check if current product belongs to vapes category or has flavours configured
  const isVapeProduct = useMemo(() => {
    if (!currentProduct) return false;
    const cat = currentProduct.category?.toLowerCase();
    return (
      cat === 'vapes' ||
      cat === 'vape' ||
      Boolean(currentProduct.flavors && currentProduct.flavors.length > 0)
    );
  }, [currentProduct]);

  const activeFlavors = currentProduct?.flavors || [];
  const activeFlavor = activeFlavors[selectedFlavorIndex] || activeFlavors[0] || null;
  const activeFlavorPrice = activeFlavor?.price ?? currentProduct?.price ?? 0;
  const inStockCount = activeFlavors.filter((f) => f.inStock !== false).length;

  // Extract images array
  const images = useMemo(() => {
    if (!currentProduct) return [];
    if (currentProduct.galleryImages && currentProduct.galleryImages.length > 0) {
      return currentProduct.galleryImages;
    }
    return [currentProduct.image || '/images/wizard_trees_photo.png'];
  }, [currentProduct]);

  // Find related products in the same category
  const relatedProducts = useMemo(() => {
    if (!currentProduct) return [];
    const sameCategory = allProductsList.filter(
      (p) =>
        p.category?.toLowerCase() === currentProduct.category?.toLowerCase() &&
        p.id !== currentProduct.id
    );

    // If we have products in same category, return up to 4
    if (sameCategory.length > 0) {
      return sameCategory.slice(0, 4);
    }

    // Fallback other items
    return allProductsList.filter((p) => p.id !== currentProduct.id).slice(0, 4);
  }, [currentProduct, allProductsList]);

  // Parse description and bullet points
  const { descriptionParagraphs, bulletPoints } = useMemo(() => {
    if (!currentProduct?.description) {
      return { descriptionParagraphs: [], bulletPoints: [] };
    }

    const lines = currentProduct.description.split('\n');
    const paragraphs: string[] = [];
    const bullets: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (
        trimmed.startsWith('•') ||
        trimmed.startsWith('-') ||
        trimmed.startsWith('*')
      ) {
        bullets.push(trimmed.replace(/^[•\-*]\s*/, ''));
      } else {
        paragraphs.push(trimmed);
      }
    });

    // If no explicit bullets in description text, synthesize helpful bullets
    if (bullets.length === 0) {
      if (currentProduct.lineage) {
        bullets.push(`Lineage: ${currentProduct.lineage}`);
      }
      bullets.push(`Category: ${currentProduct.category.toUpperCase()}`);
      if (currentProduct.weights && currentProduct.weights.length > 0) {
        bullets.push(`Available Sizes: ${currentProduct.weights.join(', ')}`);
      }
      bullets.push(
        `Availability: ${currentProduct.stockStatus === 'sold_out' ? 'Sold Out' : 'In Stock'
        }`
      );
    } else if (
      currentProduct.lineage &&
      !bullets.some((b) => b.toLowerCase().includes('lineage'))
    ) {
      bullets.unshift(`Lineage: ${currentProduct.lineage}`);
    }

    return {
      descriptionParagraphs: paragraphs,
      bulletPoints: bullets,
    };
  }, [currentProduct]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07040d] text-white flex items-center justify-center pt-28">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
          <p className="text-xs uppercase font-mono tracking-widest text-white/60">
            Loading Cultivar...
          </p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-[#07040d] text-white pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <Package className="w-16 h-16 text-white/30 mb-4" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Product Not Found</h1>
        <p className="text-sm text-white/60 mt-2 max-w-md">
          The requested cultivar or product may have been archived or removed from the catalog.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white hover:text-black transition text-xs font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07040d] text-white selection:bg-purple-600 selection:text-white">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-6">
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/collection/${currentProduct.category}`}
            className="hover:text-white transition"
          >
            {currentProduct.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/90 truncate max-w-[200px] sm:max-w-xs">
            {currentProduct.name}
          </span>
        </nav>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: PRODUCT SHOWCASE                                  */}
      {/* ============================================================ */}
      {isVapeProduct ? (
        /* VAPES BRAND & FLAVOUR SHOWCASE (Matching User Reference Image) */
        <section className="max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* LEFT COLUMN: HERO FLAVOUR PHOTO + THUMBNAILS STRIP */}
            <div className="lg:col-span-7 w-full flex flex-col">
              {/* Big Hero Card */}
              <div className="relative w-full aspect-square max-h-[640px] rounded-3xl bg-[#14100e] border border-white/10 flex items-center justify-center p-6 sm:p-12 overflow-hidden shadow-2xl">
                {/* Flavour Name in top-left */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                    {activeFlavor?.name || currentProduct.name}
                  </span>
                </div>

                {/* Central Device Photo */}
                <div className="relative w-full h-full max-w-[480px]">
                  <Image
                    key={activeFlavor?.image || images[0]}
                    src={activeFlavor?.image || images[0] || '/images/wizard_trees_photo.png'}
                    alt={activeFlavor?.name || currentProduct.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-contain object-center transition-all duration-300 drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
                  />
                </div>
              </div>

              {/* Horizontal thumbnail strip of all flavours */}
              {activeFlavors.length > 0 && (
                <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                  {activeFlavors.map((flv, idx) => {
                    const isSelected = selectedFlavorIndex === idx;
                    return (
                      <button
                        key={flv.id || idx}
                        onClick={() => setSelectedFlavorIndex(idx)}
                        className={`group/thumb relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 bg-black/50 ${isSelected
                          ? 'border-white scale-105 shadow-xl ring-2 ring-white/20 z-10'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/40'
                          }`}
                      >
                        <Image
                          src={flv.image || currentProduct.image}
                          alt={flv.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-black/80 py-0.5 text-[8px] text-center text-white truncate px-0.5 font-bold">
                          {flv.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: BRAND, MODEL, FLAVOUR PILLS & ADD TO CART */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              {/* Brand Header */}
              {currentProduct.brand && (
                <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-sky-400 font-bold">
                  {currentProduct.brand}
                </p>
              )}

              {/* Model Title */}
              <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {currentProduct.brand ? `${currentProduct.brand} ${currentProduct.name}` : currentProduct.name}
              </h1>

              {/* Price */}
              <div className="mt-2.5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                  ${activeFlavorPrice.toFixed(2)}
                </span>
                {currentProduct.compareAtPrice && (
                  <span className="text-base text-white/40 line-through">
                    ${currentProduct.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Flavour Selection Grid */}
              {activeFlavors.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-white tracking-wide">
                      Flavour
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {activeFlavors.map((flv, idx) => {
                      const isSelected = selectedFlavorIndex === idx;
                      const isAvailable = flv.inStock !== false;
                      return (
                        <button
                          key={flv.id || idx}
                          onClick={() => setSelectedFlavorIndex(idx)}
                          disabled={!isAvailable}
                          className={`flex items-center justify-between gap-2.5 px-3.5 py-3 rounded-2xl border transition-all text-left ${isSelected
                            ? 'border-sky-500 bg-sky-500/10 text-white font-semibold ring-1 ring-sky-500/40 shadow-md'
                            : 'border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.08] hover:border-white/20'
                            } ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Dual-tone taste color dot */}
                            <span
                              className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border border-black/30"
                              style={{
                                background: flv.secondaryColor
                                  ? `linear-gradient(135deg, ${flv.color || '#fff'} 50%, ${flv.secondaryColor} 50%)`
                                  : (flv.color || '#fff')
                              }}
                            />
                            <span className="text-xs sm:text-[13px] truncate">
                              {flv.name}
                            </span>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-sky-400 stroke-[2.5] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock counter */}
                  <div className="mt-3.5 text-xs font-mono text-white/60 space-y-0.5">
                    <p>{inStockCount} of {activeFlavors.length} flavours in stock</p>
                    <p className="text-white/90">
                      {activeFlavor ? `${activeFlavor.name} — $${activeFlavorPrice.toFixed(2)}, in stock.` : 'Select a flavour'}
                    </p>
                  </div>

                  {/* Clear selection */}
                  <button
                    onClick={() => setSelectedFlavorIndex(0)}
                    className="mt-2 text-[11px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition"
                  >
                    CLEAR
                  </button>
                </div>
              )}

              {/* Hairline Divider */}
              <div className="my-6 border-t border-white/10" />

              {/* Stepper + Add to Cart Button */}
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center rounded-xl border border-white/20 bg-white/5 p-1">
                  <button
                    onClick={() => setVapeQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-white/70 hover:text-white transition rounded-lg hover:bg-white/10"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-white">
                    {vapeQuantity}
                  </span>
                  <button
                    onClick={() => setVapeQuantity((q) => q + 1)}
                    className="p-2 text-white/70 hover:text-white transition rounded-lg hover:bg-white/10"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={(e) => {
                    addToCart(
                      currentProduct,
                      {
                        flavor: activeFlavor?.name,
                        flavorImage: activeFlavor?.image,
                        price: activeFlavorPrice,
                        quantity: vapeQuantity,
                      },
                      { x: e.clientX, y: e.clientY }
                    );
                  }}
                  disabled={activeFlavor?.inStock === false}
                  className="flex-1 rounded-xl bg-[#0070f3] hover:bg-[#0060df] text-white py-3.5 px-6 font-bold text-sm tracking-wide uppercase transition-all duration-200 active:scale-[0.99] shadow-xl disabled:opacity-40 disabled:pointer-events-none"
                >
                  {activeFlavor?.inStock === false ? 'Out of Stock' : 'Add to cart'}
                </button>
              </div>

              {/* Telegram Discreet Order Link */}
              <div className="mt-3">
                <a
                  href="https://t.me/Wizardtreesmessage"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition"
                >
                  <span>Shop now on Telegram</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/60" />
                </a>
              </div>

              {/* Description & Specs */}
              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-widest text-white/60 font-bold">
                  Hardware Specifications
                </h3>
                <div className="space-y-3 text-sm text-white/80 leading-relaxed font-sans">
                  {descriptionParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {bulletPoints.length > 0 && (
                  <ul className="space-y-2 text-xs sm:text-sm text-white/85 font-sans pt-2 border-t border-white/10">
                    {bulletPoints.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold select-none">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* CLASSIC FLOWER & CONCENTRATES SHOWCASE */
        <section className="max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* LEFT COLUMN: PHOTOS GALLERY */}
            <div className="lg:col-span-7 w-full">
              {images.length === 1 ? (
                /* Single Photo */
                <div className="relative w-full aspect-square sm:aspect-[4/5] max-h-[720px] rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center p-6 sm:p-12 overflow-hidden shadow-2xl">
                  <div className="relative w-full h-full max-w-[540px]">
                    <Image
                      src={images[0]}
                      alt={currentProduct.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-contain object-center transition-transform duration-500 hover:scale-105 drop-shadow-2xl"
                    />
                  </div>
                </div>
              ) : images.length === 4 ? (
                /* 4 Photos: 2x2 Grid */
                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg group"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${currentProduct.name} - view ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Dynamic multi-image layout */
                <div
                  className={`grid gap-3 sm:gap-4 w-full ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
                    }`}
                >
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg group ${images.length === 3 && idx === 0 ? 'col-span-2 aspect-[16/10]' : ''
                        }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${currentProduct.name} - view ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: PRODUCT INFO & TELEGRAM ACTION */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              {/* Brand / Category Tag */}
              <p className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-white/70 font-sans">
                WIZARD TREES {currentProduct.category.toUpperCase()}
              </p>

              {/* Product Title */}
              <h1 className="mt-1 text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-tight">
                {currentProduct.name}
              </h1>

              {/* 5-Star Rating */}
              <div className="mt-2.5 flex items-center gap-1 text-amber-400" aria-label="5 stars rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-bold text-white font-sans">
                  ${currentProduct.price.toFixed(2)}
                </span>
                {currentProduct.compareAtPrice && (
                  <span className="text-sm sm:text-base text-white/40 line-through">
                    ${currentProduct.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Shop Now Button -> Redirects to Telegram Link (Opens in same tab) */}
              <div className="mt-6">
                <a
                  href="https://t.me/Wizardtreesmessage"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-black hover:bg-neutral-900 border border-white/20 text-white font-sans font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.99] shadow-xl hover:border-white/40"
                >
                  <span>Shop now</span>
                  <ExternalLink className="w-4 h-4 text-white/70" />
                </a>
                <p className="mt-2 text-center text-[11px] text-white/50 font-sans">
                  Secure orders and discreet inquiries handled directly on Telegram.
                </p>
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-white/10" />

              {/* Secondary Headline (Lineage or Strain Name in Bold Caps) */}
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black uppercase tracking-tight text-white font-sans">
                {currentProduct.lineage ? currentProduct.lineage : currentProduct.name}
              </h2>

              {/* Paragraph Description */}
              <div className="mt-4 space-y-3 text-sm sm:text-[15px] leading-relaxed text-white/80 font-sans">
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <p>{currentProduct.description}</p>
                )}
              </div>

              {/* Bulleted Specifications (Matching Reference Screenshot) */}
              {bulletPoints.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/[0.08]">
                  <ul className="space-y-2 text-xs sm:text-sm text-white/85 font-sans leading-relaxed">
                    {bulletPoints.map((bullet, i) => {
                      const colonIdx = bullet.indexOf(':');
                      if (colonIdx !== -1) {
                        const label = bullet.slice(0, colonIdx);
                        const val = bullet.slice(colonIdx + 1);
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-purple-400 font-bold select-none">•</span>
                            <span>
                              <strong className="text-white font-semibold">{label}:</strong>
                              <span className="text-white/80">{val}</span>
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-purple-400 font-bold select-none">•</span>
                          <span>{bullet}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: RELATED PRODUCTS (You may also like)              */}
      {/* ============================================================ */}
      {relatedProducts.length > 0 && (
        <section className="w-full bg-[#16151a]/60 border-t border-white/[0.06] py-16 sm:py-20">
          <div className="max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12">
            {/* Section Header */}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-8 sm:mb-10 font-sans">
              You may also like
            </h2>

            {/* 4-Column Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((relProd) => (
                <CollectionProductCard
                  key={relProd.id}
                  product={relProd}
                  href={`/products/${relProd.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

