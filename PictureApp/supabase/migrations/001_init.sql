create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  image_url text,
  story_text text not null,
  genre text not null check (genre in ('Horror', 'Romance', 'Comedy', 'Adventure', 'Sci-Fi', 'Mystery')),
  created_at timestamptz not null default now()
);

create table if not exists public.illustrations (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  image_url text not null,
  prompt text not null,
  style text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.story_collections (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  unique (story_id, collection_id)
);

alter table public.users enable row level security;
alter table public.stories enable row level security;
alter table public.illustrations enable row level security;
alter table public.collections enable row level security;
alter table public.story_collections enable row level security;

create policy "Users can read own profile"
on public.users for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.users for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.users for insert
with check (auth.uid() = id);

create policy "Users can manage own stories"
on public.stories for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own illustrations through stories"
on public.illustrations for all
using (
  exists (
    select 1 from public.stories s
    where s.id = story_id
      and s.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.stories s
    where s.id = story_id
      and s.user_id = auth.uid()
  )
);

create policy "Users can manage own collections"
on public.collections for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own story_collections"
on public.story_collections for all
using (
  exists (
    select 1
    from public.collections c
    where c.id = collection_id
      and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.collections c
    where c.id = collection_id
      and c.user_id = auth.uid()
  )
);
