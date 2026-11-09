-- ============================================================================
-- Migration 3: Create wizard_tree_products table (linked to categories)
-- ============================================================================

create table if not exists public.wizard_tree_products (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  category_id uuid references public.wizard_tree_product_categories(id) on delete set null,
  category text not null default 'flower',
  name text not null,
  lineage text,
  description text,
  price numeric(10, 2) not null default 0.00,
  currency text not null default 'EUR',
  quantity integer not null default 0,
  availability boolean not null default true,
  rating numeric(2, 1) default 5.0 check (rating >= 1.0 and rating <= 5.0),
  status text not null default 'published' check (status in ('draft', 'published')),
  images text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_wt_products_company on public.wizard_tree_products(company_id);
create index if not exists idx_wt_products_category_id on public.wizard_tree_products(category_id);
create index if not exists idx_wt_products_status on public.wizard_tree_products(status);

-- Enable RLS
alter table public.wizard_tree_products enable row level security;

-- Public can read published products
create policy "Allow public read published products"
  on public.wizard_tree_products
  for select
  using (status = 'published');

-- Company Admins have full access to their company's products
create policy "Allow company admins full product access"
  on public.wizard_tree_products
  for all
  using (
    auth.uid() is not null and 
    company_id in (select p.company_id from public.profiles p where p.id = auth.uid())
  )
  with check (
    auth.uid() is not null and 
    company_id in (select p.company_id from public.profiles p where p.id = auth.uid())
  );

