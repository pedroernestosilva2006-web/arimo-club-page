insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-avatars',
  'profile-avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Members can list profile avatars" on storage.objects;
create policy "Members can list profile avatars"
on storage.objects for select to authenticated
using (bucket_id = 'profile-avatars' and public.is_platform_member());

drop policy if exists "Members can upload their profile avatar" on storage.objects;
create policy "Members can upload their profile avatar"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.is_platform_member()
);

drop policy if exists "Members can update their profile avatar" on storage.objects;
create policy "Members can update their profile avatar"
on storage.objects for update to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.is_platform_member()
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.is_platform_member()
);

drop policy if exists "Members can delete their profile avatar" on storage.objects;
create policy "Members can delete their profile avatar"
on storage.objects for delete to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.is_platform_member()
);
