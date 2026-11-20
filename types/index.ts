export type ProductCategory =
  | 'flower'
  | 'preroll'
  | 'seeds'
  | 'streetwear'
  | 'accessories'
  | 'vapes';

export interface VapeFlavor {
  id: string; // e.g. "flav-coffee"
  name: string; // e.g. "Coffee", "Blue Razz Ice"
  image: string; // Specific product photo for this flavour
  color: string; // Primary hex or gradient e.g. "#8B4513"
  secondaryColor?: string; // e.g. "#D2691E" for dual-tone dots
  price?: number; // Optional price override (defaults to product base price)
  inStock?: boolean; // In stock status toggle
  stockStatus?: 'in_stock' | 'sold_out';
  puffs?: string; // e.g. "30000"
}

export type StrainType = 'indica' | 'sativa' | 'hybrid' | 'indica-dominant' | 'sativa-dominant';

export interface Terpene {
  name: string;
  percentage: number;
  description: string;
}

export interface Strain {
  id: string;
  slug: string;
  name: string;
  aka?: string;
  lineage: string;
  breeder: string; // e.g. "Wizard Trees x Deep East" or "Fiya Farmer collab"
  type: StrainType;
  thc: string; // e.g. "33.2%"
  terpenes: Terpene[];
  dominantTerpene: string;
  flavors: string[]; // e.g. ["Sweet Guava", "Perfumed Gas", "Soap"]
  effects: string[]; // e.g. ["Euphoric", "Heavy Body", "Creative"]
  awards?: string[];
  description: string;
  image: string;
  badge?: string;
  isPopular?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "3.5g", "7g", "Size M", "Size XL"
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  lineage?: string; // e.g. "Rainbow Sherbet #11 x Pink Guava"
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  image: string;
  galleryImages: string[];
  description: string;
  details?: string[];
  strainId?: string; // Relation to Strain table
  strainName?: string;
  thc?: string;
  variants?: ProductVariant[];
  sizes?: string[]; // S, M, L, XL, XXL
  weights?: string[]; // 3.5g, 7g, 14g, 28g
  stockStatus: 'in_stock' | 'low_stock' | 'sold_out' | 'coming_soon';
  badge?: string; // "EXCLUSIVE DROP", "AWARD WINNER", "LIMITED"
  brand?: string; // e.g. "Elf Bar", "Lost Mary"
  flavors?: VapeFlavor[]; // Populated when category === 'vapes'
  isFeatured?: boolean;
  isNewDrop?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // product.id + '-' + (variant || size || weight || flavor || 'default')
  product: Product;
  quantity: number;
  selectedVariant?: string;
  selectedSize?: string;
  selectedWeight?: string;
  selectedFlavor?: string; // Flavor name e.g. "Coffee"
  selectedFlavorImage?: string; // Specific flavor photo
  price: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  type: 'Flagship Partner' | 'Licensed Dispensary' | 'Authorized Delivery';
  address: string;
  city: string;
  state: 'CA' | 'MI' | 'FL' | 'AZ' | 'NY' | 'OR';
  stateName: string;
  zip: string;
  phone: string;
  website: string;
  hours: string;
  verifiedStock: boolean;
  availableStrains: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Grow Facility' | 'Artisanal Genetics' | 'Streetwear Drop' | 'Events & Culture';
  imageUrl: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface DropAnnouncement {
  id: string;
  title: string;
  date: string;
  location: string;
  tag: string;
  description: string;
}

