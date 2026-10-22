-- Team-Update Oktober 2026: Jan Waser, Lars und Tim (Community & Moderation)
-- sind nicht mehr im Team. Einmal im Supabase SQL Editor ausführen, falls die
-- Datenbank bereits mit seed.sql befüllt wurde. Projektzuordnungen werden über
-- die Fremdschlüssel mit entfernt.
delete from public.project_members
 where profile_id in (select id from public.profiles where slug in ('jan-waser', 'lars', 'tim-mod'));
delete from public.profiles where slug in ('jan-waser', 'lars', 'tim-mod');
