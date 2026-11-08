-- ============================================================================
-- Migration 5: Create wizard_tree_order_items table
-- ============================================================================

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

-- Enable RLS
alter table public.wizard_tree_order_items enable row level security;

-- Public can insert items for their order
create policy "Allow public insert order items"
  on public.wizard_tree_order_items
  for insert
  with check (true);

-- Company Admins can view order items belonging to their company's orders
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

