-- ============================================================
-- PROTOFORM schema — run this once in the Supabase SQL Editor
-- (Dashboard → SQL Editor → paste → Run).
-- Safe to re-run; everything is guarded.
-- ============================================================

-- ---------- projects ----------
create table if not exists public.projects (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  category   text not null check (category in ('mechanical','product','printing')),
  image_url  text not null default '',
  image_urls text[] not null default '{}',
  blurb      text not null default '',
  tags       text[] not null default '{}',
  featured   boolean not null default false,
  published  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- posts (blog) ----------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  excerpt    text not null default '',
  cover_url  text,
  body       text not null default '',
  tags       text[] not null default '{}',
  published  boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.projects enable row level security;
alter table public.posts    enable row level security;

-- public (anon) can read only published rows
drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects
  for select using (published = true);

drop policy if exists "public read posts" on public.posts;
create policy "public read posts" on public.posts
  for select using (published = true);

-- signed-in admin can do everything (see note about disabling public signups)
drop policy if exists "admin all projects" on public.projects;
create policy "admin all projects" on public.projects
  for all to authenticated using (true) with check (true);

drop policy if exists "admin all posts" on public.posts;
create policy "admin all posts" on public.posts
  for all to authenticated using (true) with check (true);

-- ---------- Storage bucket for images ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admin write media" on storage.objects;
create policy "admin write media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ============================================================
-- IMPORTANT after running this:
-- Authentication → Sign In / Providers → Email → turn OFF "Allow new users
-- to sign up". Only the admin account (created by scripts/setup.mjs) should
-- exist, since any authenticated user can write via the policies above.
-- ============================================================
