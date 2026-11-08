import { supabase, WIZARD_TREE_COMPANY_ID } from './client';

export interface DbProductCategory {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_CATEGORIES = [
  { name: 'Flower', slug: 'flower', description: 'Artisanal indoor craft flower jars' },
  { name: 'Seeds', slug: 'seeds', description: 'Authenticated breeder genetics & souvenir packs' },
  { name: 'Other', slug: 'other', description: 'Pre-rolls, hash holes, streetwear, and lifestyle accessories' },
];

/**
 * Fetches all product categories scoped to the configured company.
 * Automatically ensures the default categories (Flower, Seeds, Other) are seeded.
 */
export async function fetchCompanyCategories(): Promise<DbProductCategory[]> {
  if (!WIZARD_TREE_COMPANY_ID) {
    console.warn('WIZARD_TREE_COMPANY_ID is not configured.');
    return [];
  }

  // 1. Fetch categories for this company
  const { data, error } = await supabase
    .from('wizard_tree_product_categories')
    .select('*')
    .eq('company_id', WIZARD_TREE_COMPANY_ID)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching product categories:', error);
    // If the table does not exist yet (before migration), return mock defaults
    return DEFAULT_CATEGORIES.map((c, i) => ({
      id: `default-${c.slug}`,
      company_id: WIZARD_TREE_COMPANY_ID,
      name: c.name,
      slug: c.slug,
      description: c.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  // 2. If company has 0 categories, seed the 3 default categories
  if (!data || data.length === 0) {
    try {
      const { data: seeded, error: seedError } = await supabase
        .from('wizard_tree_product_categories')
        .insert(
          DEFAULT_CATEGORIES.map((cat) => ({
            company_id: WIZARD_TREE_COMPANY_ID,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
          }))
        )
        .select();

      if (!seedError && seeded) {
        return seeded as DbProductCategory[];
      }
    } catch {
      // ignore
    }
  }

  return (data || []) as DbProductCategory[];
}

/**
 * Creates a new custom product category
 */
export async function createCategory(
  name: string,
  slug: string,
  description?: string
): Promise<DbProductCategory> {
  if (!WIZARD_TREE_COMPANY_ID) {
    throw new Error('Company ID is missing from environment.');
  }

  const { data, error } = await supabase
    .from('wizard_tree_product_categories')
    .insert({
      company_id: WIZARD_TREE_COMPANY_ID,
      name,
      slug: slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }

  return data as DbProductCategory;
}

/**
 * Updates a category
 */
export async function updateCategory(
  id: string,
  updates: Partial<Pick<DbProductCategory, 'name' | 'slug' | 'description'>>
): Promise<DbProductCategory> {
  const { data, error } = await supabase
    .from('wizard_tree_product_categories')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('company_id', WIZARD_TREE_COMPANY_ID)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }

  return data as DbProductCategory;
}

/**
 * Deletes a category
 */
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('wizard_tree_product_categories')
    .delete()
    .eq('id', id)
    .eq('company_id', WIZARD_TREE_COMPANY_ID);

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
}

