-- ============================================================================
-- Migration 1: Update profiles table with company_id
-- ============================================================================

-- Adds company_id (optional/nullable) so users/admins can be linked to a company workspace.
alter table if exists public.profiles 
  add column if not exists company_id uuid references public.companies(id) on delete set null;

create index if not exists idx_profiles_company_id on public.profiles(company_id);

