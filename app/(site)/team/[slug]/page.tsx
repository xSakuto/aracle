import Link from "next/link";
import { notFound } from "next/navigation";
import ContactLinks from "@/components/ContactLinks";
import DuoPortrait from "@/components/DuoPortrait";
import Contours from "@/components/alpine/Contours";
import ProjectTile from "@/components/project/ProjectTile";
import ProfileTabs from "@/components/team/ProfileTabs";
import { projectHref, type Project } from "@/data/projects";
import { topicOf } from "@/data/news";
import { team as staticTeam } from "@/data/team";
import { getNewsByAuthor } from "@/lib/news";
import { getProjects, getUpdatesByAuthor } from "@/lib/projects";
import { getMemberExtras, getTeam } from "@/lib/team";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() {
  return staticTeam.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = (await getTeam()).find((x) => x.slug === slug);
  if (!m) return { title: "Team" };
  return {
    title: `${m.name}, ${m.role}`,
    description: m.bio || `${m.name} ist ${m.role} bei Aracle.`,
    alternates: { canonical: `/team/${m.slug}` },
    openGraph: { title: `${m.name} · Aracle`, description: m.bio, url: `/team/${m.slug}`, type: "profile" },
  };
}

const monthYear = new Intl.DateTimeFormat("de-CH", { month: "long", year: "numeric", timeZone: "Europe/Zurich" });
const day = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Zurich" });

const posterTone: Record<string, "slate" | "glacier" | "glow"> = { highside: "glow", "beer-game": "glacier" };

type Activity =
  | { kind: "news"; id: string; date: string; title: string; topic: string; href: string }
  | { kind: "update"; id: string; date: string; title: string; version: string; project?: Project };

// Profil einer Person aus dem Team, aufgebaut wie ein Forenprofil:
// Kopf mit Porträt und Eckdaten, Zahlen, darunter Reiter für Übersicht,
// Projekte und Aktivität (News und Changelog-Einträge).
export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [team, projects, extras] = await Promise.all([getTeam(), getProjects(), getMemberExtras(slug)]);
  const m = team.find((x) => x.slug === slug);
  if (!m) notFound();

  // Ohne Datenbank ist die ID der Slug, dann gibt es auch keine News oder Einträge.
  const isDbId = /^[0-9a-f-]{36}$/.test(m.id);
  const [news, updates] = isDbId
    ? await Promise.all([getNewsByAuthor(m.id), getUpdatesByAuthor(m.id)])
    : [[], []];

  const projectOf = (s: string) => projects.find((p) => p.slug === s);
  const memberProjects = m.projects
    .map((x) => ({ ...x, project: projectOf(x.slug) }))
    .filter((x): x is typeof x & { project: Project } => Boolean(x.project));

  const activity: Activity[] = [
    ...news.map((n) => ({ kind: "news" as const, id: n.id, date: n.publishedAt, title: n.title, topic: n.topic, href: `/news#${n.id}` })),
    ...updates.map((u) => ({ kind: "update" as const, id: u.id, date: u.publishedAt, title: u.title, version: u.version, project: projectOf(u.projectSlug) })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const since = extras.memberSince ? new Date(extras.memberSince) : null;
  const years = since ? Math.max(0, new Date().getFullYear() - since.getFullYear()) : null;

  // Rollen über alle Projekte, häufigste zuerst
  const roles = Object.entries(
    memberProjects.reduce<Record<string, string[]>>((acc, x) => {
      (acc[x.role || m.role] ??= []).push(x.project.title);
      return acc;
    }, {}),
  ).sort((a, b) => b[1].length - a[1].length);

  const listed = team.filter((x) => x.listed);
  const i = listed.findIndex((x) => x.slug === m.slug);
  const prev = i >= 0 && listed.length > 1 ? listed[(i - 1 + listed.length) % listed.length] : null;
  const next = i >= 0 && listed.length > 1 ? listed[(i + 1) % listed.length] : null;

  const stats: [string, string][] = [
    [String(memberProjects.length), memberProjects.length === 1 ? "Projekt" : "Projekte"],
    [String(updates.length), updates.length === 1 ? "Changelog-Eintrag" : "Changelog-Einträge"],
    [String(news.length), news.length === 1 ? "News-Beitrag" : "News-Beiträge"],
    ...(since ? ([[String(since.getFullYear()), years ? `dabei seit ${years} Jahren` : "dabei seit"]] as [string, string][]) : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/team/${m.slug}`,
    url: `${SITE_URL}/team/${m.slug}`,
    mainEntity: {
      "@type": "Person",
      name: m.name,
      jobTitle: m.role,
      description: m.bio,
      ...(m.photo ? { image: m.photo.startsWith("http") ? m.photo : `${SITE_URL}${m.photo}` } : {}),
      worksFor: { "@id": `${SITE_URL}/#org` },
      sameAs: m.socials.map((s) => s.url),
    },
  };

  const overview = (
    <div className="grid gap-12 md:grid-cols-12">
      <div className="md:col-span-7">
        <h2 className="sr-only">Über {m.name}</h2>
        {m.bio ? (
          <p className="lead max-w-[42ch] text-ink/90">{m.bio}</p>
        ) : (
          <p className="text-muted">{m.name} hat noch nichts über sich geschrieben.</p>
        )}
        {m.quote && (
          <blockquote className="mt-8 max-w-[40ch] border-l-2 pl-5 text-[1.125rem] text-ink/90" style={{ borderColor: m.accent }}>
            «{m.quote}»
          </blockquote>
        )}

        {activity.length > 0 && (
          <div className="mt-14">
            <h3 className="small text-muted">Zuletzt</h3>
            <ActivityList items={activity.slice(0, 3)} />
          </div>
        )}
      </div>

      <aside className="md:col-span-4 md:col-start-9">
        <dl className="border-b border-line text-[0.9375rem]">
          {[
            ["Rolle", m.role],
            ...(extras.location ? [["Ort", extras.location]] : []),
            ...(since ? [["Dabei seit", monthYear.format(since)]] : []),
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 border-t border-line py-3">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        {roles.length > 0 && (
          <div className="mt-8">
            <h3 className="small text-muted">Rollen in Projekten</h3>
            <ul className="mt-3 space-y-3">
              {roles.map(([role, titles]) => (
                <li key={role}>
                  <p className="font-semibold tracking-[-0.015em]">
                    {role} <span className="nums small font-normal text-muted">{titles.length}</span>
                  </p>
                  <p className="small text-muted">{titles.join(", ")}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );

  const projectsTab = memberProjects.length ? (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
      {memberProjects.map((x) => (
        <li key={x.slug}>
          <ProjectTile project={x.project} tone={posterTone[x.slug]} />
          <p className="small mt-1 text-muted">{x.role || m.role}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-muted">Noch keinem Projekt zugeordnet.</p>
  );

  const activityTab = activity.length ? (
    <ActivityList items={activity} />
  ) : (
    <p className="text-muted">Noch keine News oder Changelog-Einträge von {m.name.split(" ")[0]}.</p>
  );

  return (
    <article className="pb-[var(--section)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Kopf: Höhenlinien in der Profilfarbe, Porträt, Name und Eckdaten */}
      <header className="relative overflow-hidden pt-28 md:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[78%]" style={{ color: m.accent }}>
          <div className="absolute -right-[10%] top-0 w-[min(110vw,64rem)] opacity-50">
            <Contours label={false} />
          </div>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 70% at 80% 20%, color-mix(in oklab, ${m.accent} 16%, transparent), transparent 70%)` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />
        </div>

        <div className="wrap relative">
          <nav aria-label="Brotkrumen" className="small text-muted" data-rise>
            <Link href="/team" className="transition-colors hover:text-ink">Team</Link>
            <span aria-hidden className="mx-2">/</span>
            <span>{m.name}</span>
          </nav>

          <div className="duo-host mt-8 grid items-end gap-x-8 gap-y-8 md:grid-cols-12">
            <div className="w-40 overflow-hidden rounded-[var(--radius)] ring-1 ring-line sm:w-52 md:col-span-3 md:w-auto" data-rise>
              <DuoPortrait name={m.name} photo={m.photo} accent={m.accent} sizes="(min-width: 768px) 22vw, 13rem" />
            </div>

            <div className="min-w-0 md:col-span-9" data-rise style={{ ["--i" as string]: 1 }}>
              <ul className="flex flex-wrap gap-2" aria-label="Abzeichen">
                {m.lead && <Badge accent={m.accent}>Gründer</Badge>}
                {!m.lead && <Badge>{m.role}</Badge>}
                {since && years !== null && years >= 5 && <Badge>Seit {since.getFullYear()} dabei</Badge>}
              </ul>
              <h1 className="mega mt-5 break-words" data-split="load">{m.name}</h1>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-ink/15 pt-5">
                <p className="text-ink/80">
                  {[extras.location, since && `Mitglied seit ${monthYear.format(since)}`].filter(Boolean).join(", ") || "Aracle Team"}
                </p>
                <ContactLinks name={m.name} socials={m.socials} email={m.contactEmail} />
              </div>
            </div>
          </div>

          {/* Zahlen wie in einem Forenprofil */}
          <dl className="mt-12 grid grid-cols-2 border-y border-line sm:grid-cols-4">
            {stats.map(([v, k], idx) => (
              <div key={k} className={`py-5 ${idx % 2 ? "pl-5 sm:pl-6" : ""} ${idx > 0 ? "sm:border-l sm:border-line sm:pl-6" : ""} ${idx >= 2 ? "border-t border-line sm:border-t-0" : ""}`}>
                <dd className="nums text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] font-[620] leading-none tracking-[-0.04em]">{v}</dd>
                <dt className="small mt-2 text-muted">{k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="wrap mt-10">
        <ProfileTabs
          tabs={[
            { id: "uebersicht", label: "Übersicht", content: overview },
            { id: "projekte", label: "Projekte", count: memberProjects.length, content: projectsTab },
            { id: "aktivitaet", label: "Aktivität", count: activity.length, content: activityTab },
          ]}
        />
      </div>

      {prev && next && (
        <nav aria-label="Weitere Profile" className="wrap mt-[var(--section)] grid border-t border-line sm:grid-cols-2">
          {[
            { q: prev, dir: "Vorherige Person", arrow: "←" },
            { q: next, dir: "Nächste Person", arrow: "→" },
          ].map(({ q, dir, arrow }, k) => (
            <Link
              key={dir}
              href={`/team/${q.slug}`}
              className={`seg-host group relative flex items-baseline gap-6 pb-2 pt-6 ${k === 1 ? "justify-end text-right sm:border-l sm:border-line sm:pl-6" : "sm:pr-6"}`}
            >
              <span aria-hidden className="seg seg-top" />
              {k === 0 && <span aria-hidden className="text-[1.75rem] transition-transform duration-500 group-hover:-translate-x-1.5">{arrow}</span>}
              <span>
                <span className="small block text-muted">{dir}</span>
                <span className="head mt-2 block transition-colors group-hover:text-aqua">{q.name}</span>
              </span>
              {k === 1 && <span aria-hidden className="text-[1.75rem] transition-transform duration-500 group-hover:translate-x-1.5">{arrow}</span>}
            </Link>
          ))}
        </nav>
      )}
      <p className="wrap mt-8">
        <Link href="/team" className="link-under">Ganzes Team</Link>
      </p>
    </article>
  );
}

function Badge({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <li
      className="inline-flex min-h-7 items-center rounded-full border px-3 text-[0.8125rem]"
      style={accent ? { borderColor: accent, color: accent } : { borderColor: "var(--color-line)", color: "color-mix(in oklab, var(--color-ink) 85%, transparent)" }}
    >
      {children}
    </li>
  );
}

function ActivityList({ items }: { items: Activity[] }) {
  return (
    <ol className="mt-4 border-b border-line">
      {items.map((a) => {
        const href = a.kind === "news" ? a.href : a.project ? `${projectHref(a.project)}#changelog` : null;
        const label =
          a.kind === "news" ? (
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: topicOf(a.topic).accent }} />
              News
            </span>
          ) : (
            <span>
              Changelog{a.project ? `, ${a.project.title}` : ""}
              {a.version && <span className="nums ml-1.5 text-ink/70">{a.version}</span>}
            </span>
          );
        const inner = (
          <>
            <span className="small text-muted">{label}</span>
            <span className="min-w-0 font-semibold tracking-[-0.015em] transition-colors group-hover:text-aqua">
              {plain(a.title)}
            </span>
            <time dateTime={a.date} className="small nums text-muted sm:text-right">{day.format(new Date(a.date))}</time>
          </>
        );
        const cls = "group grid gap-1 border-t border-line py-4 sm:grid-cols-[12rem_1fr_auto] sm:items-baseline sm:gap-6";
        return (
          <li key={`${a.kind}-${a.id}`}>
            {href ? (
              <Link href={href} className={`${cls} focus-visible:text-aqua`}>{inner}</Link>
            ) : (
              <div className={cls}>{inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// Titel ohne Markdown-Zeichen, damit im Link kein zweiter Link steckt
const plain = (s: string) =>
  s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/<a?:(\w+):\d+>/g, "").replace(/[*`]/g, "").trim();
