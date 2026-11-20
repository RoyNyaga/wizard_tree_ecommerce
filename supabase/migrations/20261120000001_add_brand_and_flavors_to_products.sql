-- ============================================================================
-- Migration: Add brand and flavors to wizard_tree_products table
-- ============================================================================

alter table public.wizard_tree_products
  add column if not exists brand text,
  add column if not exists flavors jsonb default '[]'::jsonb;

-- Optional: index flavors for jsonb searches
create index if not exists idx_wt_products_flavors on public.wizard_tree_products using gin (flavors);
create index if not exists idx_wt_products_brand on public.wizard_tree_products (brand);
