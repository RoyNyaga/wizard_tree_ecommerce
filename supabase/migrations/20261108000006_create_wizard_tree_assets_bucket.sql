-- ============================================================================
-- Migration 6: Create wizard_tree_assets storage bucket
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('wizard_tree_assets', 'wizard_tree_assets', true)
on conflict (id) do nothing;

-- Storage RLS: Public read
create policy "Allow public read wizard_tree_assets"
  on storage.objects
  for select
  using (bucket_id = 'wizard_tree_assets');

-- Storage RLS: Authenticated upload
create policy "Allow authenticated upload wizard_tree_assets"
  on storage.objects
  for insert
  with check (bucket_id = 'wizard_tree_assets' and auth.role() = 'authenticated');

-- Storage RLS: Authenticated delete
create policy "Allow authenticated delete wizard_tree_assets"
  on storage.objects
  for delete
  using (bucket_id = 'wizard_tree_assets' and auth.role() = 'authenticated');

