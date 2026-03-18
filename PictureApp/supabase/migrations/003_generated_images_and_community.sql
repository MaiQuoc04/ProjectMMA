create table if not exists public.generated_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  image_url text not null,
  prompt text not null,
  revised_prompt text,
  style text not null,
  aspect_ratio text not null check (aspect_ratio in ('1:1', '4:3', '9:16')),
  created_at timestamptz not null default now()
);

create index if not exists generated_images_created_at_idx
  on public.generated_images(created_at desc);

alter table public.generated_images enable row level security;

create policy "Users can manage own generated images"
on public.generated_images for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Authenticated users can read community stories"
on public.stories for select
using (auth.role() = 'authenticated');

create policy "Authenticated users can read community illustrations"
on public.illustrations for select
using (auth.role() = 'authenticated');

create policy "Authenticated users can read generated images"
on public.generated_images for select
using (auth.role() = 'authenticated');
