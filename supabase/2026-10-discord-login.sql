-- Oktober 2026: Team-Login auch mit Discord, direkt verknüpft wie der E-Mail-Login.
-- Voraussetzung (im Supabase Dashboard, nicht per SQL):
--   1. Discord Developer Portal: eine Application anlegen, OAuth2-Redirect
--      "https://<dein-projekt>.supabase.co/auth/v1/callback" eintragen,
--      Client ID + Client Secret kopieren.
--   2. Supabase Dashboard -> Authentication -> Providers -> Discord aktivieren,
--      Client ID + Secret eintragen.
--   3. Supabase Dashboard -> Authentication -> URL Configuration:
--      "https://aracle.ch/auth/callback" unter Redirect URLs freigeben
--      (falls noch nicht vorhanden).
-- Einmal im Supabase SQL Editor ausführen. Rein additiv, es wird nichts gelöscht.

alter table public.profiles add column if not exists discord_id text;
alter table public.profiles add column if not exists discord_username text;

create unique index if not exists profiles_discord_id_idx
  on public.profiles (discord_id) where discord_id is not null;

-- Ersetzt den bestehenden Login-Trigger: verknüpft weiterhin per E-Mail,
-- merkt sich bei einem Discord-Login zusätzlich die Discord-Identität.
create or replace function public.link_profile_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  provider text := new.raw_app_meta_data->>'provider';
  d_id text := coalesce(new.raw_user_meta_data->>'provider_id', new.raw_user_meta_data->>'sub');
  d_name text := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name');
begin
  -- Neues Konto: per E-Mail mit einem bestehenden, noch nicht verknüpften Profil zusammenführen.
  update public.profiles
     set user_id = new.id,
         discord_id = case when provider = 'discord' then d_id else discord_id end,
         discord_username = case when provider = 'discord' then coalesce(d_name, discord_username) else discord_username end
   where lower(email) = lower(new.email)
     and user_id is null;

  return new;
end;
$$;

-- Trigger bleibt gleich (feuert schon auf auth.users), nur die Funktion wurde erweitert.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.link_profile_on_signup();

grant select (discord_username) on public.profiles to anon;
