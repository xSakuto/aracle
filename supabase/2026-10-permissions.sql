-- Rang-/Rechtesystem: einzelne Dashboard-Bereiche gezielt freigeben, ohne
-- gleich Vollzugriff (is_admin) zu geben. Dazu getrennt von "visible" (steuert,
-- ob das Profil überhaupt lesbar ist) ein "listed": ob die Person auf der
-- /team-Übersicht auftaucht, auch wenn sie z. B. nur auf einer Projektseite
-- (z. B. Zelda DE) als Team geführt werden soll.

alter table public.profiles add column if not exists permissions text[] not null default '{}';
alter table public.profiles add column if not exists listed boolean not null default true;

create or replace function public.has_permission(perm text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and (is_admin or perm = any(permissions))
  );
$$;

grant execute on function public.has_permission(text) to authenticated;
revoke execute on function public.has_permission(text) from anon;

-- Rechte, Sichtbarkeit und Listung bleiben Admin-Sache, wie is_admin und visible schon.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.user_id     := old.user_id;
    new.email       := old.email;
    new.slug        := old.slug;
    new.role        := old.role;
    new.is_lead     := old.is_lead;
    new.is_admin    := old.is_admin;
    new.visible     := old.visible;
    new.listed      := old.listed;
    new.permissions := old.permissions;
    new.sort        := old.sort;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

-- "listed" öffentlich mitlesen lassen (für /team), Rechte selbst bleiben intern.
grant select (listed) on public.profiles to anon;

-- ─────────────────────────────────────────────
-- Anfragen: Zuweisung, Notizfeld, Archiv statt "erledigt"
-- ─────────────────────────────────────────────

alter table public.inquiries add column if not exists assigned_to uuid references public.profiles (id) on delete set null;
alter table public.inquiries add column if not exists note text not null default '';

alter table public.inquiries drop constraint if exists inquiries_status_check;
update public.inquiries set status = 'archiviert' where status = 'erledigt';
alter table public.inquiries add constraint inquiries_status_check check (status in ('neu', 'in_bearbeitung', 'archiviert'));

-- Nicht mehr nur Vollzugriff: wer die 'anfragen'-Berechtigung hat, darf auch lesen/bearbeiten.
-- Die alten admin-only-Policies ("admin liest/bearbeitet anfragen") bleiben bewusst bestehen:
-- RLS-Policies sind permissiv (ODER-verknüpft), und has_permission() liefert für echte Admins
-- ohnehin true, also stören sich die beiden Policy-Sätze nicht.
drop policy if exists "anfragen lesen" on public.inquiries;
create policy "anfragen lesen" on public.inquiries
  for select using (public.has_permission('anfragen'));

drop policy if exists "anfragen bearbeiten" on public.inquiries;
create policy "anfragen bearbeiten" on public.inquiries
  for update using (public.has_permission('anfragen')) with check (public.has_permission('anfragen'));

revoke execute on function public.has_permission(text) from public;
