insert into storage.buckets (id, name, public)
values
  ('images-original', 'images-original', true),
  ('images-generated', 'images-generated', true)
on conflict (id) do nothing;

create policy "Users can upload original images"
on storage.objects for insert
with check (
  bucket_id = 'images-original'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can upload generated images"
on storage.objects for insert
with check (
  bucket_id = 'images-generated'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Public can read original images"
on storage.objects for select
using (bucket_id = 'images-original');

create policy "Public can read generated images"
on storage.objects for select
using (bucket_id = 'images-generated');

create policy "Users can delete own original images"
on storage.objects for delete
using (
  bucket_id = 'images-original'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own generated images"
on storage.objects for delete
using (
  bucket_id = 'images-generated'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
