-- ============================================================================
-- Migration 4: Create wizard_tree_orders table
-- ============================================================================

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

-- Enable RLS
alter table public.wizard_tree_orders enable row level security;

-- Public can insert orders (guest checkout)
create policy "Allow public insert orders"
  on public.wizard_tree_orders
  for insert
  with check (true);

-- Company Admins have full access to their company's orders
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

