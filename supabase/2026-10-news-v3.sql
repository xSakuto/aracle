-- Aracle: News v3
-- Bilder für News (Einfügen per Strg+V, Hineinziehen oder Auswählen im Editor).
-- Einmal im Supabase SQL-Editor ausführen, nach 2026-10-news-v2.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news', 'news', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

-- Jede:r darf die Bilder sehen, hochladen und ersetzen dürfen nur Admins.
drop policy if exists "news bilder lesen" on storage.objects;
create policy "news bilder lesen" on storage.objects
  for select using (bucket_id = 'news');

drop policy if exists "admin lädt news bilder hoch" on storage.objects;
create policy "admin lädt news bilder hoch" on storage.objects
  for insert to authenticated with check (bucket_id = 'news' and public.is_admin());

drop policy if exists "admin ersetzt news bilder" on storage.objects;
create policy "admin ersetzt news bilder" on storage.objects
  for update to authenticated using (bucket_id = 'news' and public.is_admin());

drop policy if exists "admin löscht news bilder" on storage.objects;
create policy "admin löscht news bilder" on storage.objects
  for delete to authenticated using (bucket_id = 'news' and public.is_admin());
