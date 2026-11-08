import { supabase, WIZARD_TREE_COMPANY_ID } from './client';
import { DbProductCategory } from './categories';

export interface DbProduct {
  id: string;
  company_id: string;
  category_id?: string | null;
  name: string;
  description: string | null;
  category: string; // Slug fallback (e.g. 'flower', 'seeds', 'other')
  price: number;
  currency: string;
  quantity: number;
  availability: boolean;
  rating: number;
  status: 'draft' | 'published';
  images: string[];
  created_at: string;
  updated_at: string;
  category_data?: DbProductCategory | null;
}

export type CreateProductInput = Omit<DbProduct, 'id' | 'created_at' | 'updated_at' | 'category_data'>;
export type UpdateProductInput = Partial<CreateProductInput>;

export async function fetchCompanyProducts(
  options?: { status?: 'draft' | 'published' | 'all'; category?: string; categoryId?: string }
): Promise<DbProduct[]> {
  if (!WIZARD_TREE_COMPANY_ID) {
    console.warn('WIZARD_TREE_COMPANY_ID is not set. Returning empty list.');
    return [];
  }

  let query = supabase
    .from('wizard_tree_products')
    .select(`
      *,
      category_data:wizard_tree_product_categories(*)
    `)
    .eq('company_id', WIZARD_TREE_COMPANY_ID)
    .order('created_at', { ascending: false });

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options?.categoryId && options.categoryId !== 'all') {
    query = query.eq('category_id', options.categoryId);
  } else if (options?.category && options.category !== 'all') {
    query = query.eq('category', options.category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error loading products with category join:', error);
    // Fallback without join in case relationship is pending migration
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('wizard_tree_products')
      .select('*')
      .eq('company_id', WIZARD_TREE_COMPANY_ID)
      .order('created_at', { ascending: false });

    if (fallbackError) {
      throw new Error(`Failed to load products: ${fallbackError.message}`);
    }
    return (fallbackData || []) as DbProduct[];
  }

  return (data || []) as DbProduct[];
}

export async function createProduct(input: Omit<CreateProductInput, 'company_id'>): Promise<DbProduct> {
  if (!WIZARD_TREE_COMPANY_ID) {
    throw new Error('Company ID is missing from environment.');
  }

  const { data, error } = await supabase
    .from('wizard_tree_products')
    .insert({
      ...input,
      company_id: WIZARD_TREE_COMPANY_ID,
    })
    .select(`
      *,
      category_data:wizard_tree_product_categories(*)
    `)
    .single();

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return data as DbProduct;
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<DbProduct> {
  const { data, error } = await supabase
    .from('wizard_tree_products')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('company_id', WIZARD_TREE_COMPANY_ID)
    .select(`
      *,
      category_data:wizard_tree_product_categories(*)
    `)
    .single();

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return data as DbProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('wizard_tree_products')
    .delete()
    .eq('id', id)
    .eq('company_id', WIZARD_TREE_COMPANY_ID);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}
