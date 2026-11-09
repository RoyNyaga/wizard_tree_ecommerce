-- ============================================================================
-- Migration 7: Add optional lineage column to wizard_tree_products
-- ============================================================================

alter table if exists public.wizard_tree_products
  add column if not exists lineage text;

