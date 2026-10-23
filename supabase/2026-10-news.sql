-- Aracle: News und Feed
-- Einmal im Supabase SQL-Editor ausführen. Ohne diese Tabelle läuft die Seite normal weiter,
-- /news zeigt dann einfach noch keine Einträge.

create table if not exists public.news_posts (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null check (char_length(topic) between 2 and 40),
  template    text not null default 'update' check (template in ('update', 'status', 'changelog', 'video')),
  title       text not null check (char_length(title) between 3 and 140),
  body        text not null default '' check (char_length(body) <= 4000),
  -- Changelog-Zeilen: [{ "tag": "Fixed", "text": "..." }]
  items       jsonb not null default '[]'::jsonb,
  -- Verweise: [{ "label": "Modrinth", "url": "https://..." }]
  links       jsonb not null default '[]'::jsonb,
  image_url   text check (image_url is null or char_length(image_url) <= 500),
  published   boolean not null default false,
  -- Ab wann sichtbar. In der Zukunft heisst das: geplant.
  publish_at  timestamptz not null default now(),
  author_id   uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists news_posts_feed_idx
  on public.news_posts (publish_at desc) where published;

create or replace function public.touch_news_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists touch_news on public.news_posts;
create trigger touch_news
  before update on public.news_posts
  for each row execute function public.touch_news_updated_at();

alter table public.news_posts enable row level security;

-- Besucher:innen und der Bot sehen nur Veröffentlichtes, dessen Zeitpunkt erreicht ist.
-- Admins sehen und bearbeiten alles, auch Entwürfe und Geplantes.
drop policy if exists "news lesen" on public.news_posts;
create policy "news lesen" on public.news_posts
  for select using ((published and publish_at <= now()) or public.is_admin());

drop policy if exists "admin verwaltet news" on public.news_posts;
create policy "admin verwaltet news" on public.news_posts
  for all using (public.is_admin()) with check (public.is_admin());

revoke insert, update, delete on public.news_posts from anon;

revoke execute on function public.touch_news_updated_at() from public, anon, authenticated;
