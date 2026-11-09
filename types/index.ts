export type ProductCategory = 
  | 'flower' 
  | 'preroll' 
  | 'seeds' 
  | 'streetwear' 
  | 'accessories';

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
  isFeatured?: boolean;
  isNewDrop?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // product.id + '-' + (variant || size || weight || 'default')
  product: Product;
  quantity: number;
  selectedVariant?: string;
  selectedSize?: string;
  selectedWeight?: string;
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

