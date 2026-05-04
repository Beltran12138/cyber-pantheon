-- Enshrine relationship
create table enshrines (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  figure_slug text not null,
  created_at  timestamptz default now(),
  unique(user_id, figure_slug)
);
alter table enshrines enable row level security;
create policy "Users manage own enshrines"
  on enshrines for all using (auth.uid() = user_id);

-- Saved poems
create table saved_poems (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  title       text,
  content     text not null,
  figures     text[] default '{}',
  created_at  timestamptz default now()
);
alter table saved_poems enable row level security;
create policy "Users manage own poems"
  on saved_poems for all using (auth.uid() = user_id);
