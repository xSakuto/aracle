-- Oktober 2026: Persönliches Zitat und öffentliche Kontaktadresse fürs Team,
-- dazu Bewerbungen (Team unter /apply, AracleSMP unter /smp) über die Anfragen-Tabelle.
-- Einmal im Supabase SQL Editor ausführen. Rein additiv, es wird nichts gelöscht.
-- Die Website läuft auch ohne dieses Update, zeigt Zitat und Mail aber erst danach.

alter table public.profiles add column if not exists quote text not null default ''
  check (char_length(quote) <= 200);
alter table public.profiles add column if not exists contact_email text
  check (contact_email is null or char_length(contact_email) <= 200);
grant select (quote, contact_email) on public.profiles to anon;

alter table public.inquiries drop constraint if exists inquiries_project_type_check;
alter table public.inquiries add constraint inquiries_project_type_check
  check (project_type in ('web','brand','video','hosting','smp','apply','other'));
