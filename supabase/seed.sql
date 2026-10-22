-- Startdaten: das heutige Team und seine Projekte.
-- Nach schema.sql einmal ausführen. E-Mails der anderen trägst du später
-- im Dashboard ein, dann können sie sich selbst einloggen.

insert into public.profiles (slug, name, role, bio, accent, photo_url, socials, is_lead, is_admin, sort, email)
values
  ('joel', 'Joel Nef', 'Gründer & Director',
   'Gründer und Leitung von Aracle. Verantwortlich für Strategie, Markenführung und eigene Projekte wie Highside, Sakuto und Swizzly.',
   '#00ffff', '/Brand_assets/images/heros/joel.jpg',
   '[{"type":"x","url":"https://x.com/AracleCH"},{"type":"discord","url":"https://discord.gg/BgpKdzBYtD"},{"type":"instagram","url":"https://www.instagram.com/aracle.ch/"}]',
   true, true, 0, 'jnef400@gmail.com'),
  ('tim-mockweiss', 'Tim Mockweiss', 'Developer & Co-Director',
   'Entwickler und Co-Director. Verantwortlich für Cloud-Infrastruktur, Server-Systeme und die technische Umsetzung der Projekte.',
   '#6bbf59', null, '[{"type":"discord","url":"https://discord.gg/BgpKdzBYtD"}]',
   false, false, 10, null),
  ('noah', 'Noah', 'Web-Developer',
   'Web-Entwickler im Studio. Bringt technisches Know-how für Web- und Softwareprojekte ein und unterstützt bei der Umsetzung.',
   '#5aa9e6', null, '[{"type":"discord","url":"https://discord.gg/BgpKdzBYtD"}]',
   false, false, 20, null)
on conflict (slug) do nothing;

insert into public.project_members (profile_id, project_slug, role)
select p.id, v.project_slug, v.role
from (values
  ('tim-mockweiss', 'aracle-cloud-hosting', 'Developer'),
  ('joel',          'aracle-cloud-hosting', 'Director'),
  ('joel',          'highside',             'Director'),
  ('joel',          'swizzly',              'Director'),
  ('joel',          'sakuto',               'Director'),
  ('joel',          'zelda-de-server',      'Director'),
  ('joel',          'all-the-clients',      'Director'),
  ('joel',          'araclesmp',            'Director'),
  ('joel',          'rexusmods',            'Director'),
  ('tim-mockweiss', 'rexusmods',            '3D'),
  ('joel',          'beer-game',            'Director')
) as v(slug, project_slug, role)
join public.profiles p on p.slug = v.slug
on conflict do nothing;

-- Falls schon Logins existieren: mit den Profilen verknüpfen.
update public.profiles p
   set user_id = u.id
  from auth.users u
 where lower(u.email) = lower(p.email)
   and p.user_id is null;
