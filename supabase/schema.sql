-- Aracle: Team, Projekt-Zuordnungen und Profilbilder
-- Einmal komplett im Supabase SQL-Editor ausführen.

-- ─────────────────────────────────────────────
-- Tabellen
-- ─────────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique references auth.users (id) on delete set null,
  email       text unique,
  slug        text unique not null,
  name        text not null,
  role        text not null default '',
  bio         text not null default '',
  accent      text not null default '#00ffff',
  photo_url   text,
  socials     jsonb not null default '[]'::jsonb,
  is_lead     boolean not null default false,
  is_admin    boolean not null default false,
  visible     boolean not null default true,
  sort        integer not null default 100,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.project_members (
  profile_id    uuid not null references public.profiles (id) on delete cascade,
  project_slug  text not null,
  role          text not null default '',
  primary key (profile_id, project_slug)
);

create index if not exists project_members_slug_idx
  on public.project_members (project_slug);

-- ─────────────────────────────────────────────
-- Hilfsfunktionen
-- ─────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and is_admin
  );
$$;

-- Wird vom Login aufgerufen: nur Teammitglieder bekommen einen Code.
create or replace function public.is_team_email(check_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where lower(email) = lower(check_email)
  );
$$;

grant execute on function public.is_team_email(text) to anon, authenticated;

-- Neuer Login-User wird automatisch mit seinem Profil (gleiche E-Mail) verknüpft.
create or replace function public.link_profile_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
     set user_id = new.id
   where lower(email) = lower(new.email)
     and user_id is null;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.link_profile_on_signup();

-- Normale Mitglieder dürfen nur ihre eigenen Inhalte ändern.
-- Rolle, Rechte, Reihenfolge, Slug und E-Mail bleiben Admin-Sache.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.user_id  := old.user_id;
    new.email    := old.email;
    new.slug     := old.slug;
    new.role     := old.role;
    new.is_lead  := old.is_lead;
    new.is_admin := old.is_admin;
    new.visible  := old.visible;
    new.sort     := old.sort;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.project_members enable row level security;

drop policy if exists "profiles lesen" on public.profiles;
create policy "profiles lesen" on public.profiles
  for select using (visible or auth.uid() = user_id or public.is_admin());

drop policy if exists "eigenes profil bearbeiten" on public.profiles;
create policy "eigenes profil bearbeiten" on public.profiles
  for update using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "admin legt an" on public.profiles;
create policy "admin legt an" on public.profiles
  for insert with check (public.is_admin());

drop policy if exists "admin löscht" on public.profiles;
create policy "admin löscht" on public.profiles
  for delete using (public.is_admin());

drop policy if exists "zuordnungen lesen" on public.project_members;
create policy "zuordnungen lesen" on public.project_members
  for select using (true);

drop policy if exists "admin verwaltet zuordnungen" on public.project_members;
create policy "admin verwaltet zuordnungen" on public.project_members
  for all using (public.is_admin()) with check (public.is_admin());

-- E-Mail-Adressen und Rechte nie öffentlich ausliefern:
-- Besucher:innen (anon) sehen nur die Spalten, die auf der Seite stehen.
revoke select on public.profiles from anon;
grant select (
  id, slug, name, role, bio, accent, photo_url, socials,
  is_lead, visible, sort
) on public.profiles to anon;

-- ─────────────────────────────────────────────
-- Profilbilder (Storage)
-- ─────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars lesen" on storage.objects;
create policy "avatars lesen" on storage.objects
  for select using (bucket_id = 'avatars');

-- Jede:r lädt in den eigenen Ordner (Profil-ID), Admins überall.
drop policy if exists "avatars hochladen" on storage.objects;
create policy "avatars hochladen" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'avatars' and (
      public.is_admin() or (storage.foldername(name))[1] in (
        select id::text from public.profiles where user_id = auth.uid()
      )
    )
  );

drop policy if exists "avatars ersetzen" on storage.objects;
create policy "avatars ersetzen" on storage.objects
  for update to authenticated using (
    bucket_id = 'avatars' and (
      public.is_admin() or (storage.foldername(name))[1] in (
        select id::text from public.profiles where user_id = auth.uid()
      )
    )
  );

drop policy if exists "avatars löschen" on storage.objects;
create policy "avatars löschen" on storage.objects
  for delete to authenticated using (
    bucket_id = 'avatars' and (
      public.is_admin() or (storage.foldername(name))[1] in (
        select id::text from public.profiles where user_id = auth.uid()
      )
    )
  );
