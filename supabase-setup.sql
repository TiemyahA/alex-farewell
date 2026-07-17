-- Alex: The Next Move — database setup
-- Run this once in Supabase: SQL Editor → New query → paste → Run.

create table if not exists tiles (
  id         text primary key,
  content    text not null,
  theme      text not null default 'crystal',
  author     text not null default 'the team',
  created_at timestamptz not null default now()
);

-- One tile per prediction, case/whitespace-insensitive.
create unique index if not exists tiles_content_unique
  on tiles (lower(trim(content)));

-- Each vote is its own row: (tile, voter) is the primary key, so voting is
-- atomic — simultaneous voters can never overwrite each other.
create table if not exists votes (
  tile_id    text not null references tiles(id) on delete cascade,
  voter      text not null,
  created_at timestamptz not null default now(),
  primary key (tile_id, voter)
);

create table if not exists notes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  content    text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: the browser uses the public anon key, so policies
-- define exactly what visitors can do. Visitors can read everything, add
-- tiles/notes, and add/remove their votes — but can NOT edit or delete
-- tiles and notes, so nobody can wipe the board or someone else's note.
alter table tiles  enable row level security;
alter table votes  enable row level security;
alter table notes  enable row level security;

create policy "public read tiles"   on tiles for select using (true);
create policy "public insert tiles" on tiles for insert with check (true);

create policy "public read votes"   on votes for select using (true);
create policy "public insert votes" on votes for insert with check (true);
create policy "public delete votes" on votes for delete using (true);

create policy "public read notes"   on notes for select using (true);
create policy "public insert notes" on notes for insert with check (true);
