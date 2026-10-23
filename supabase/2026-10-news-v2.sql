-- Aracle: News v2
-- Normale Discord-Nachrichten statt Embed (Embed nur auf Wunsch), automatische Signatur,
-- und die Server-Emojis des Discord-Bots für den Editor.
-- Einmal im Supabase SQL-Editor ausführen, nach 2026-10-news.sql.

alter table public.news_posts add column if not exists use_embed boolean not null default false;
alter table public.news_posts add column if not exists signature text
  check (signature is null or char_length(signature) <= 80);

-- Titel enthalten jetzt Emojis (<:name:123456789>), brauchen also mehr Platz.
alter table public.news_posts drop constraint if exists news_posts_title_check;
alter table public.news_posts add constraint news_posts_title_check
  check (char_length(title) between 3 and 300);

-- ─────────────────────────────────────────────
-- Server-Emojis (vom Bot geliefert, nur für Admins lesbar)
-- ─────────────────────────────────────────────

create table if not exists public.discord_emojis (
  id          text primary key,
  name        text not null,
  animated    boolean not null default false,
  guild_name  text not null default '',
  updated_at  timestamptz not null default now()
);

alter table public.discord_emojis enable row level security;

drop policy if exists "admin liest emojis" on public.discord_emojis;
create policy "admin liest emojis" on public.discord_emojis
  for select using (public.is_admin());

revoke all on public.discord_emojis from anon;

-- Geheimnis, mit dem sich der Bot ausweist. Niemand ausser der Funktion unten kommt daran.
create table if not exists public.bot_secrets (
  key    text primary key,
  value  text not null
);

alter table public.bot_secrets enable row level security;
revoke all on public.bot_secrets from anon, authenticated;

-- Der Bot ruft das mit dem öffentlichen Schlüssel auf und weist sich mit dem Geheimnis aus.
-- Das Geheimnis wird einmal von Hand angelegt, es steht bewusst nicht in dieser Datei:
--   insert into public.bot_secrets (key, value) values ('emoji_sync', '<langer zufälliger Text>');
create or replace function public.bot_sync_emojis(p_secret text, p_emojis jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  expected text;
  n integer;
begin
  select value into expected from public.bot_secrets where key = 'emoji_sync';
  if expected is null or p_secret is distinct from expected then
    raise exception 'forbidden';
  end if;

  delete from public.discord_emojis where true;
  insert into public.discord_emojis (id, name, animated, guild_name)
    select e->>'id', e->>'name', coalesce((e->>'animated')::boolean, false), coalesce(e->>'guild_name', '')
    from jsonb_array_elements(p_emojis) e
    on conflict (id) do nothing;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.bot_sync_emojis(text, jsonb) from public;
grant execute on function public.bot_sync_emojis(text, jsonb) to anon;
