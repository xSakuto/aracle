-- Besucherzähler für den Footer: eine Zeile, die bei jedem Seitenaufruf (clientseitig) hochgezählt wird.
create table if not exists public.site_visits (
  id smallint primary key default 1,
  count bigint not null default 0,
  constraint site_visits_singleton check (id = 1)
);

insert into public.site_visits (id, count) values (1, 0)
on conflict (id) do nothing;

alter table public.site_visits enable row level security;

-- Jede*r darf den Stand lesen, niemand darf die Zeile direkt per UPDATE/INSERT verändern.
drop policy if exists "site_visits_select" on public.site_visits;
create policy "site_visits_select" on public.site_visits for select using (true);

-- Atomares Hochzählen nur über diese Funktion (SECURITY DEFINER, Anon-Key darf sie ausführen).
create or replace function public.increment_site_visits()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.site_visits set count = count + 1 where id = 1
  returning count into new_count;
  return new_count;
end;
$$;

revoke all on function public.increment_site_visits() from public;
grant execute on function public.increment_site_visits() to anon, authenticated;
