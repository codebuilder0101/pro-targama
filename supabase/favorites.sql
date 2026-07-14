-- Targama — favorites table
-- Run this in the Supabase dashboard → SQL Editor (once).

create extension if not exists "pgcrypto";

create table if not exists public.favorites (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null,
  source_text     text not null,
  translated_text text not null,
  source_lang     text not null default 'auto',
  target_lang     text not null,
  created_at      timestamptz not null default now()
);

create index if not exists favorites_client_created_idx
  on public.favorites (client_id, created_at desc);

-- All access happens through TanStack server functions using the service_role
-- key, which bypasses RLS. Enable RLS with NO policies so the public anon key
-- cannot read or write this table directly.
alter table public.favorites enable row level security;
