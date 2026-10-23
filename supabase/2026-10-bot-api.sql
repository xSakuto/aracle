-- Aracle: Zugang des Dashboards zum Discord-Bot
-- Einmal im Supabase SQL-Editor ausführen, nach 2026-10-news-v2.sql (dort entsteht die Tabelle bot_secrets).
--
-- Die Webseite signiert jede Anfrage an den Bot mit einem gemeinsamen Geheimnis. Nur eingeloggte
-- Admins bekommen es über diese Funktion, alle anderen eine Fehlermeldung.
--
-- Das Geheimnis wird einmal von Hand angelegt, es steht bewusst nicht in dieser Datei.
-- Derselbe Wert gehört als "site_secret" in /opt/discordbot/supabase_sync.json auf dem Bot-Server:
--   insert into public.bot_secrets (key, value) values ('site_api', '<langer zufälliger Text>');

create or replace function public.get_bot_api_secret()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v text;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  select value into v from public.bot_secrets where key = 'site_api';
  return v;
end;
$$;

revoke all on function public.get_bot_api_secret() from public, anon;
grant execute on function public.get_bot_api_secret() to authenticated;
