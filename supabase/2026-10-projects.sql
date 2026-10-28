-- Oktober 2026: Projekte im Dashboard pflegen, Changelog pro Projekt und
-- öffentliche Teamprofile. Rein additiv, es wird nichts gelöscht.
-- Die Website läuft auch ohne dieses Update weiter, mit den Projekten aus data/projects.ts.

-- ─────────────────────────────────────────────
-- Profile: "Mitglied seit" und Ort für die Profilseite
-- ─────────────────────────────────────────────

alter table public.profiles add column if not exists member_since date;
alter table public.profiles add column if not exists location text not null default ''
  check (char_length(location) <= 80);
grant select (member_since, location) on public.profiles to anon;

-- "Mitglied seit" setzt nur ein Admin, den Ort pflegt jede:r selbst.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.user_id      := old.user_id;
    new.email        := old.email;
    new.slug         := old.slug;
    new.role         := old.role;
    new.is_lead      := old.is_lead;
    new.is_admin     := old.is_admin;
    new.visible      := old.visible;
    new.listed       := old.listed;
    new.permissions  := old.permissions;
    new.sort         := old.sort;
    new.member_since := old.member_since;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

update public.profiles set member_since = '2017-01-01' where slug = 'joel' and member_since is null;

-- Milvia gehört Joel, fehlte bisher in den Zuordnungen.
insert into public.project_members (profile_id, project_slug, role)
select id, 'milvia', 'Director' from public.profiles where slug = 'joel'
on conflict do nothing;

-- ─────────────────────────────────────────────
-- Projekte: Änderungen gegenüber data/projects.ts
-- data enthält nur die Felder, die im Dashboard überschrieben wurden.
-- ─────────────────────────────────────────────

create table if not exists public.projects (
  slug        text primary key check (slug ~ '^[a-z0-9-]{2,60}$'),
  data        jsonb not null default '{}'::jsonb,
  hidden      boolean not null default false,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.profiles (id) on delete set null
);

alter table public.projects enable row level security;

drop policy if exists "projekte lesen" on public.projects;
create policy "projekte lesen" on public.projects for select using (true);

drop policy if exists "projekte pflegen" on public.projects;
create policy "projekte pflegen" on public.projects
  for all to authenticated
  using (public.has_permission('projekte'))
  with check (public.has_permission('projekte'));

grant select on public.projects to anon;

-- ─────────────────────────────────────────────
-- Changelog pro Projekt
-- ─────────────────────────────────────────────

create table if not exists public.project_updates (
  id            uuid primary key default gen_random_uuid(),
  project_slug  text not null check (char_length(project_slug) <= 60),
  version       text not null default '' check (char_length(version) <= 30),
  title         text not null check (char_length(title) between 2 and 140),
  body          text not null default '' check (char_length(body) <= 4000),
  author_id     uuid references public.profiles (id) on delete set null,
  published     boolean not null default true,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists project_updates_slug_idx on public.project_updates (project_slug, published_at desc);
create index if not exists project_updates_author_idx on public.project_updates (author_id, published_at desc);

alter table public.project_updates enable row level security;

-- Wer am Projekt mitarbeitet, darf dort Einträge schreiben. Mit der Berechtigung
-- "projekte" überall.
create or replace function public.can_edit_project(target text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_permission('projekte') or exists (
    select 1
    from public.project_members m
    join public.profiles p on p.id = m.profile_id
    where p.user_id = auth.uid() and m.project_slug = target
  );
$$;

revoke execute on function public.can_edit_project(text) from public, anon;
grant execute on function public.can_edit_project(text) to authenticated;

drop policy if exists "changelog lesen" on public.project_updates;
create policy "changelog lesen" on public.project_updates
  for select using (
    (published and published_at <= now())
    or (auth.uid() is not null and public.can_edit_project(project_slug))
  );

drop policy if exists "changelog schreiben" on public.project_updates;
create policy "changelog schreiben" on public.project_updates
  for insert to authenticated with check (public.can_edit_project(project_slug));

drop policy if exists "changelog bearbeiten" on public.project_updates;
create policy "changelog bearbeiten" on public.project_updates
  for update to authenticated
  using (public.can_edit_project(project_slug))
  with check (public.can_edit_project(project_slug));

drop policy if exists "changelog löschen" on public.project_updates;
create policy "changelog löschen" on public.project_updates
  for delete to authenticated using (public.can_edit_project(project_slug));

grant select on public.project_updates to anon;

-- ─────────────────────────────────────────────
-- Projektbilder (Cover und Galerie)
-- ─────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('projects', 'projects', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "projektbilder lesen" on storage.objects;
create policy "projektbilder lesen" on storage.objects
  for select using (bucket_id = 'projects');

drop policy if exists "projektbilder hochladen" on storage.objects;
create policy "projektbilder hochladen" on storage.objects
  for insert to authenticated with check (bucket_id = 'projects' and public.has_permission('projekte'));

drop policy if exists "projektbilder ersetzen" on storage.objects;
create policy "projektbilder ersetzen" on storage.objects
  for update to authenticated using (bucket_id = 'projects' and public.has_permission('projekte'));

drop policy if exists "projektbilder löschen" on storage.objects;
create policy "projektbilder löschen" on storage.objects
  for delete to authenticated using (bucket_id = 'projects' and public.has_permission('projekte'));
