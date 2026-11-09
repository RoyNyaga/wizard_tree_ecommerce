-- ============================================================================
-- WIZARD TREES E-COMMERCE CONSOLIDATED SUPABASE MIGRATION
-- Run this script in your Supabase SQL Editor if running manually.
-- Or run `npx supabase db push` to apply the migrations in supabase/migrations/
-- ============================================================================

-- 1. UPDATE EXISTING PROFILES TABLE
-- Adds company_id (optional/nullable) so users/admins can be linked to a company.
alter table if exists public.profiles 
  add column if not exists company_id uuid references public.companies(id) on delete set null;

create index if not exists idx_profiles_company_id on public.profiles(company_id);

-- 2. CREATE WIZARD TREE PRODUCT CATEGORIES TABLE
create table if not exists public.wizard_tree_product_categories (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  name text not null,
  slug text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (company_id, slug)
);

create index if not exists idx_wt_categories_company on public.wizard_tree_product_categories(company_id);
create index if not exists idx_wt_categories_slug on public.wizard_tree_product_categories(slug);

alter table public.wizard_tree_product_categories enable row level security;

create policy "Allow public read categories"
  on public.wizard_tree_product_categories
  for select
  using (true);

create policy "Allow company admins manage categories"
  on public.wizard_tree_product_categories
  for all
  using (
    auth.uid() is not null and 
    company_id in (select p.company_id from public.profiles p where p.id = auth.uid())
  )
  with check (
    auth.uid() is not null and 
    company_id in (select p.company_id from public.profiles p where p.id = auth.uid())
  );

-- Helper function to seed default categories for a company
create or replace function public.seed_wizard_tree_default_categories(target_company_id uuid)
returns void as $$
begin
  insert into public.wizard_tree_product_categories (company_id, name, slug, description)
  values 
    (target_company_id, 'Flower', 'flower', 'Artisanal indoor craft flower jars'),
    (target_company_id, 'Seeds', 'seeds', 'Authenticated breeder genetics & souvenir packs'),
    (target_company_id, 'Other', 'other', 'Pre-rolls, hash holes, streetwear, and lifestyle accessories')
  on conflict (company_id, slug) do nothing;
end;
$$ language plpgsql security definer;

-- Auto-seed default categories for any existing companies
do $$
declare
  r record;
begin
  for r in select id from public.companies loop
    perform public.seed_wizard_tree_default_categories(r.id);
  end loop;
end;
$$;

-- 3. CREATE WIZARD TREE PRODUCTS TABLE
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

alter table public.wizard_tree_products enable row level security;

create policy "Allow public read published products"
  on public.wizard_tree_products
  for select
  using (status = 'published');

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

-- 4. CREATE WIZARD TREE ORDERS TABLE
create table if not exists public.wizard_tree_orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_number text,
  country text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  address text not null,
  total_cost numeric(10, 2) not null default 0.00,
  currency text not null default 'EUR',
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'paid', 'cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_wt_orders_company on public.wizard_tree_orders(company_id);
create index if not exists idx_wt_orders_status on public.wizard_tree_orders(status);
create index if not exists idx_wt_orders_created on public.wizard_tree_orders(created_at desc);

alter table public.wizard_tree_orders enable row level security;

create policy "Allow public insert orders"
  on public.wizard_tree_orders
  for insert
  with check (true);

create policy "Allow company admins full order access"
  on public.wizard_tree_orders
  for all
  using (
    auth.uid() is not null and 
    company_id in (select p.company_id from public.profiles p where p.id = auth.uid())
  )
  with check (
    auth.uid() is not null and 
    company_id in (select p.company_id from public.profiles p where p.id = auth.uid())
  );

-- 5. CREATE WIZARD TREE ORDER ITEMS TABLE
create table if not exists public.wizard_tree_order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.wizard_tree_orders(id) on delete cascade not null,
  product_id uuid references public.wizard_tree_products(id) on delete set null,
  product_name text not null,
  product_image text,
  unit_price numeric(10, 2) not null default 0.00,
  quantity integer not null default 1,
  total_price numeric(10, 2) not null default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_wt_order_items_order on public.wizard_tree_order_items(order_id);
create index if not exists idx_wt_order_items_product on public.wizard_tree_order_items(product_id);

alter table public.wizard_tree_order_items enable row level security;

create policy "Allow public insert order items"
  on public.wizard_tree_order_items
  for insert
  with check (true);

create policy "Allow company admins select order items"
  on public.wizard_tree_order_items
  for select
  using (
    auth.uid() is not null and
    order_id in (
      select o.id from public.wizard_tree_orders o 
      where o.company_id in (select p.company_id from public.profiles p where p.id = auth.uid())
    )
  );

-- 6. CREATE STORAGE BUCKET FOR PRODUCT PHOTOS
insert into storage.buckets (id, name, public)
values ('wizard_tree_assets', 'wizard_tree_assets', true)
on conflict (id) do nothing;

create policy "Allow public read wizard_tree_assets"
  on storage.objects
  for select
  using (bucket_id = 'wizard_tree_assets');

create policy "Allow authenticated upload wizard_tree_assets"
  on storage.objects
  for insert
  with check (bucket_id = 'wizard_tree_assets' and auth.role() = 'authenticated');

create policy "Allow authenticated delete wizard_tree_assets"
  on storage.objects
  for delete
  using (bucket_id = 'wizard_tree_assets' and auth.role() = 'authenticated');
