-- =========================================================
-- Artist Roster Schema (Supabase / Postgres)
-- Matches the ACF "Artist Profile Builder" field group.
-- Run this in Supabase → SQL Editor
-- =========================================================

-- Agents (referenced by artists; matches WP "Agent" CPT)
create table agents (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  email text,
  bio text,
  photo_url text,
  role text[],
  instagram text,
  linkedin text,
  created_at timestamptz default now()
);

-- Genres (was a WP taxonomy)
create table genres (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null
);

-- Locations (was a WP taxonomy)
create table locations (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null
);

-- Artists (one row per artist page)
create table artists (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  image_url text,
  primary_agent_id uuid references agents(id) on delete set null,
  secondary_agent_id uuid references agents(id) on delete set null,
  small_bio text,
  large_bio text,
  academy_artist boolean default false,
  featured_artist boolean default false,
  instagram text,
  spotify text,
  soundcloud text,
  facebook text,
  tiktok text,
  spotlight_1 text,
  spotlight_2 text,
  spotlight_3 text,
  spotlight_4 text,
  -- moderation: submissions land as 'pending', admin promotes to 'published'
  status text default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Many-to-many: artists ↔ genres
create table artist_genres (
  artist_id uuid references artists(id) on delete cascade,
  genre_id uuid references genres(id) on delete cascade,
  primary key (artist_id, genre_id)
);

-- Many-to-many: artists ↔ locations
create table artist_locations (
  artist_id uuid references artists(id) on delete cascade,
  location_id uuid references locations(id) on delete cascade,
  primary key (artist_id, location_id)
);

-- Indexes for the queries the frontend will run
create index idx_artists_status on artists(status);
create index idx_artists_featured on artists(featured_artist) where status = 'published';
create index idx_artists_slug on artists(slug);

-- =========================================================
-- Row Level Security (RLS)
-- Public reads only see published artists.
-- Inserts (submissions) are allowed; updates require service role.
-- =========================================================

alter table artists enable row level security;
alter table agents enable row level security;
alter table genres enable row level security;
alter table locations enable row level security;
alter table artist_genres enable row level security;
alter table artist_locations enable row level security;

-- Public can SELECT published artists
create policy "Public can read published artists"
  on artists for select
  using (status = 'published');

-- Public can SELECT all agents, genres, locations (needed for join data)
create policy "Public can read agents" on agents for select using (true);
create policy "Public can read genres" on genres for select using (true);
create policy "Public can read locations" on locations for select using (true);
create policy "Public can read artist_genres" on artist_genres for select using (true);
create policy "Public can read artist_locations" on artist_locations for select using (true);

-- Anyone can submit (INSERT) a pending artist via the form
-- The API route will set status = 'pending' explicitly
create policy "Anyone can submit a pending artist"
  on artists for insert
  with check (status = 'pending');

-- Inserts into join tables for new submissions
create policy "Anyone can attach genres to their submission"
  on artist_genres for insert with check (true);
create policy "Anyone can attach locations to their submission"
  on artist_locations for insert with check (true);

-- NOTE: Updates and deletes require the service role key,
-- which only your server-side API routes use. Never expose it to the browser.

-- =========================================================
-- Seed data (optional — remove if you don't want sample genres/locations)
-- =========================================================
insert into genres (slug, name) values
  ('dubstep', 'Dubstep'),
  ('drum-and-bass', 'Drum & Bass'),
  ('heavy-bass', 'Heavy Bass'),
  ('electronic', 'Electronic'),
  ('house', 'House'),
  ('trap', 'Trap'),
  ('riddim', 'Riddim'),
  ('experimental', 'Experimental')
on conflict (slug) do nothing;

insert into locations (slug, name) values
  ('north-america', 'North America'),
  ('uk', 'UK'),
  ('europe', 'Europe'),
  ('oceania', 'Oceania'),
  ('asia', 'Asia'),
  ('south-america', 'South America')
on conflict (slug) do nothing;
