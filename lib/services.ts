import { Product, Strain, StoreLocation, GalleryItem, DropAnnouncement } from '@/types';
import { 
  PRODUCTS_DATA, 
  STRAINS_DATA, 
  STORE_LOCATIONS_DATA, 
  GALLERY_ITEMS_DATA, 
  DROPS_DATA 
} from './mockData';

/**
 * Service layer designed for seamless transition to Supabase.
 * In this version, all functions read from mockData.
 * To integrate Supabase later, simply replace the return statements
 * with `supabase.from('products').select('*')` etc.
 */

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  // Simulate slight network latency for realistic feel if needed
  let results = [...PRODUCTS_DATA];

  if (options?.category && options.category !== 'all') {
    results = results.filter((p) => p.category === options.category);
  }

  if (options?.featured) {
    results = results.filter((p) => p.isFeatured);
  }

  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const found = PRODUCTS_DATA.find((p) => p.slug === slug);
  return found || null;
}

export async function getStrains(options?: {
  popularOnly?: boolean;
  limit?: number;
}): Promise<Strain[]> {
  let results = [...STRAINS_DATA];

  if (options?.popularOnly) {
    results = results.filter((s) => s.isPopular);
  }

  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

export async function getStrainBySlug(slug: string): Promise<Strain | null> {
  const found = STRAINS_DATA.find((s) => s.slug === slug);
  return found || null;
}

export async function getStoreLocations(stateFilter?: string): Promise<StoreLocation[]> {
  if (!stateFilter || stateFilter === 'ALL') {
    return STORE_LOCATIONS_DATA;
  }
  return STORE_LOCATIONS_DATA.filter((s) => s.state === stateFilter);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return GALLERY_ITEMS_DATA;
}

export async function getDropAnnouncements(): Promise<DropAnnouncement[]> {
  return DROPS_DATA;
}

