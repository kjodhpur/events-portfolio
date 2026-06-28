-- ============================================================
-- Events Portfolio schema  (run this in Supabase SQL editor)
-- ============================================================

-- EVENTS -----------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  event_date  date,
  title       text not null,
  venue       text,
  role        text,
  scale       text,                 -- e.g. "350+ attendees"
  blurb       text,
  sort        int default 0,        -- manual ordering; higher = closer to top
  published   boolean default true
);

-- MEDIA (photos + videos) ------------------------------------
create table if not exists public.event_media (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references public.events(id) on delete cascade,
  kind        text not null check (kind in ('photo','video')),
  storage_path text,                -- path in the 'media' bucket (uploaded files)
  public_url  text,                 -- resolved public URL (uploaded files)
  embed_url   text,                 -- for YouTube/Vimeo videos (preferred for big files)
  sort        int default 0
);

-- ARTICLE / EXTERNAL LINKS -----------------------------------
create table if not exists public.event_links (
  id        uuid primary key default gen_random_uuid(),
  event_id  uuid references public.events(id) on delete cascade,
  label     text not null,
  url       text not null,
  sort      int default 0
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.events       enable row level security;
alter table public.event_media  enable row level security;
alter table public.event_links  enable row level security;

-- Public can READ published events and their media/links
drop policy if exists "public read events" on public.events;
create policy "public read events" on public.events
  for select using (published = true);

drop policy if exists "public read media" on public.event_media;
create policy "public read media" on public.event_media
  for select using (true);

drop policy if exists "public read links" on public.event_links;
create policy "public read links" on public.event_links
  for select using (true);

-- Authenticated (you, the admin) can do EVERYTHING
drop policy if exists "auth all events" on public.events;
create policy "auth all events" on public.events
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth all media" on public.event_media;
create policy "auth all media" on public.event_media
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth all links" on public.event_links;
create policy "auth all links" on public.event_links
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for uploaded media
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read of files
drop policy if exists "public read media files" on storage.objects;
create policy "public read media files" on storage.objects
  for select using (bucket_id = 'media');

-- Authenticated can upload / update / delete in the media bucket
drop policy if exists "auth write media files" on storage.objects;
create policy "auth write media files" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "auth update media files" on storage.objects;
create policy "auth update media files" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "auth delete media files" on storage.objects;
create policy "auth delete media files" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
