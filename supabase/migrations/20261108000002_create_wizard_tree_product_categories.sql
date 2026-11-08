-- ============================================================================
-- Migration 2: Create wizard_tree_product_categories table
-- ============================================================================

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

-- Enable RLS
alter table public.wizard_tree_product_categories enable row level security;

-- Public can read product categories
create policy "Allow public read categories"
  on public.wizard_tree_product_categories
  for select
  using (true);

-- Company Admins have full CRUD on categories
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

-- Helper function to seed default categories (flower, seeds, other) for a company
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

-- Auto-seed default categories for any existing companies in the database
do $$
declare
  r record;
begin
  for r in select id from public.companies loop
    perform public.seed_wizard_tree_default_categories(r.id);
  end loop;
end;
$$;

