import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/(site)/login/actions";
import BotWidget, { BotWidgetSkeleton } from "@/components/dashboard/BotWidget";
import Portrait from "@/components/Portrait";
import { typeLabel } from "@/data/inquiry";
import { topicOf } from "@/data/news";
import { projects } from "@/data/projects";
import { requireMember, type FullProfile } from "@/lib/session";

export const metadata = { title: "Übersicht" };

const TZ = "Europe/Zurich";
const dayFmt = new Intl.DateTimeFormat("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: TZ });
const dateFmt = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: TZ });
const hourFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone: TZ });

type Inquiry = { id: string; created_at: string; name: string; company: string | null; project_type: string; status: string };
type News = { id: string; title: string; topic: string; published: boolean; publish_at: string };
type Person = { id: string; user_id: string | null; email: string | null; visible: boolean };
type Todo = { text: string; href: string };

const inquiryStatus: Record<string, { label: string; tone: string }> = {
  neu: { label: "Neu", tone: "text-aqua" },
  in_bearbeitung: { label: "In Bearbeitung", tone: "text-[#d9a441]" },
  erledigt: { label: "Erledigt", tone: "text-muted" },
};

function newsState(n: News, now: number) {
  if (!n.published) return { label: "Entwurf", tone: "text-muted" };
  if (new Date(n.publish_at).getTime() > now) return { label: "Geplant", tone: "text-[#d9a441]" };
  return { label: "Veröffentlicht", tone: "text-aqua" };
}

function greeting(now: Date) {
  const h = Number(hourFmt.format(now));
  if (h < 5) return "Gute Nacht";
  if (h < 11) return "Guten Morgen";
  if (h < 18) return "Hallo";
  return "Guten Abend";
}

// Was am eigenen Profil noch fehlt.
function profileTodos(me: FullProfile, discordLinked: boolean): Todo[] {
  const href = "/dashboard/profil";
  const todos: Todo[] = [];
  if (!me.photo_url) todos.push({ text: "Profilbild hochladen", href });
  if (!me.bio) todos.push({ text: "Kurzbeschreibung schreiben", href });
  if (!me.quote) todos.push({ text: "Persönliches Zitat ergänzen", href });
  if (me.socials.length === 0) todos.push({ text: "Social-Links eintragen", href });
  if (!discordLinked) todos.push({ text: "Discord-Login verknüpfen", href });
  return todos;
}

function Tile({ href, label, value, sub, alert }: { href: string; label: string; value: React.ReactNode; sub: string; alert?: boolean }) {
  return (
    <Link href={href} className="dash-panel dash-tile block">
      <p className="flex items-center gap-2 text-xs text-muted">
        {label}
        {alert && <span aria-hidden className="dash-dot text-aqua" />}
      </p>
      <p className="nums mt-1 text-[1.75rem] font-medium leading-tight">{value}</p>
      <p className="dash-help mt-0.5">{sub}</p>
    </Link>
  );
}

function PanelHead({ title, href, link }: { title: string; href: string; link: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="font-sans text-base font-medium tracking-normal">{title}</h2>
      <Link href={href} className="text-xs text-muted transition-colors hover:text-ink">
        {link}
      </Link>
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <section id="todo" className="dash-panel scroll-mt-6">
      <h2 className="font-sans text-base font-medium tracking-normal">Zu erledigen</h2>
      {todos.length === 0 ? (
        <p className="dash-help mt-2">Alles erledigt. Im Moment steht nichts an.</p>
      ) : (
        <ul className="mt-2 divide-y divide-[#24272c]">
          {todos.map((t) => (
            <li key={t.text}>
              <Link href={t.href} className="group flex items-center gap-3 py-2.5 transition-colors hover:text-aqua">
                <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full border border-[#3a3f47] transition-colors group-hover:border-aqua" />
                <span className="min-w-0 flex-1">{t.text}</span>
                <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ProfileCard({ me }: { me: FullProfile }) {
  const titleOf = Object.fromEntries(projects.map((p) => [p.slug, p.title]));
  return (
    <section className="dash-panel">
      <PanelHead title="Mein Profil" href="/dashboard/profil" link="Bearbeiten" />
      <div className="mt-4 flex items-center gap-4">
        <div className="w-14 shrink-0 overflow-hidden rounded-full">
          <Portrait name={me.name} photo={me.photo_url ?? undefined} accent={me.accent} className="!aspect-square" small />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{me.name}</p>
          <p className="truncate text-sm text-muted">{me.role || "Ohne Rolle"}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`dash-pill ${me.visible ? "text-aqua" : "text-muted"}`}>
          <span aria-hidden className="dash-dot" />
          <span className="text-ink">{me.visible ? "Auf der Website sichtbar" : "Auf der Website versteckt"}</span>
        </span>
        {me.projects.map((p) => (
          <span key={p.slug} className="dash-pill">{titleOf[p.slug] ?? p.slug}</span>
        ))}
      </div>
      {me.visible && (
        <Link href={`/team#${me.slug}`} className="mt-4 inline-block text-xs text-muted transition-colors hover:text-ink">
          Auf der Teamseite ansehen
        </Link>
      )}
    </section>
  );
}

export default async function DashboardPage() {
  const { supabase, user, me } = await requireMember();

  if (!me) {
    return (
      <div className="max-w-[36rem]">
        <h1 className="font-sans text-2xl font-medium tracking-normal">Kein Profil verknüpft</h1>
        <p className="mt-3">
          Du bist als {user.email} eingeloggt, aber diese Adresse ist keinem
          Teamprofil zugeordnet. Bitte Joel, sie in deinem Profil einzutragen.
        </p>
        <form action={signOut} className="mt-6">
          <button type="submit" className="dash-btn-quiet">Abmelden</button>
        </form>
      </div>
    );
  }

  const now = new Date();
  const discordLinked = Boolean(user.identities?.some((i) => i.provider === "discord"));
  const ownTodos = profileTodos(me, discordLinked);

  const head = (
    <header>
      <p className="text-xs text-muted">{dayFmt.format(now)}</p>
      <h1 className="mt-1 font-sans text-2xl font-medium tracking-normal">
        {greeting(now)}, {me.name.split(" ")[0]}
      </h1>
    </header>
  );

  // Teammitglieder ohne Admin-Rechte: eigenes Profil und was daran noch fehlt.
  if (!me.is_admin) {
    return (
      <div className="max-w-[72rem]">
        {head}
        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          <ProfileCard me={me} />
          <TodoList todos={ownTodos} />
        </div>
      </div>
    );
  }

  // Alle Zahlen gleichzeitig laden. Fehlt eine Tabelle, bleibt der Bereich einfach leer.
  const [inq, news, people] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id, created_at, name, company, project_type, status")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("news_posts")
      .select("id, title, topic, published, publish_at")
      .order("publish_at", { ascending: false })
      .limit(100),
    supabase.from("profiles").select("id, user_id, email, visible"),
  ]);
  const inquiries = (inq.data ?? []) as Inquiry[];
  const posts = (news.data ?? []) as News[];
  const team = (people.data ?? []) as Person[];

  const fresh = inquiries.filter((r) => r.status === "neu");
  const inProgress = inquiries.filter((r) => r.status === "in_bearbeitung");
  const openInquiries = inquiries.filter((r) => r.status !== "erledigt").slice(0, 5);

  const t = now.getTime();
  const drafts = posts.filter((p) => !p.published);
  const planned = posts.filter((p) => p.published && new Date(p.publish_at).getTime() > t);
  const live = posts.length - drafts.length - planned.length;
  // Zuerst was noch ansteht (Entwürfe, Geplantes), dann das zuletzt Veröffentlichte.
  const newsRows = [...drafts, ...planned, ...posts.filter((p) => p.published && new Date(p.publish_at).getTime() <= t)].slice(0, 5);

  const visible = team.filter((m) => m.visible).length;
  const noLogin = team.filter((m) => !m.user_id).length;

  const todos: Todo[] = [
    ...(fresh.length
      ? [{ text: fresh.length === 1 ? "1 neue Anfrage beantworten" : `${fresh.length} neue Anfragen beantworten`, href: "/dashboard/anfragen" }]
      : []),
    ...drafts.slice(0, 3).map((d) => ({ text: `Entwurf fertigstellen: ${d.title}`, href: `/dashboard/news/${d.id}` })),
    ...(noLogin
      ? [{ text: noLogin === 1 ? "1 Profil hat sich noch nie eingeloggt" : `${noLogin} Profile haben sich noch nie eingeloggt`, href: "/dashboard/team" }]
      : []),
    ...ownTodos,
  ];

  return (
    <div className="max-w-[72rem]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        {head}
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/news/neu" className="dash-btn">Neue News</Link>
          <Link href="/dashboard/team" className="dash-btn-quiet">Mitglied hinzufügen</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile
          href="/dashboard/anfragen"
          label="Neue Anfragen"
          value={fresh.length}
          sub={inq.error ? "Nicht ladbar" : `${inProgress.length} in Bearbeitung, ${inquiries.length} gesamt`}
          alert={fresh.length > 0}
        />
        <Tile
          href="/dashboard/news"
          label="News veröffentlicht"
          value={live}
          sub={news.error ? "Nicht ladbar" : `${drafts.length} ${drafts.length === 1 ? "Entwurf" : "Entwürfe"}, ${planned.length} geplant`}
        />
        <Tile
          href="/dashboard/team"
          label="Teamprofile"
          value={team.length}
          sub={people.error ? "Nicht ladbar" : `${visible} sichtbar, ${noLogin} ohne Login`}
        />
        <Tile
          href="#todo"
          label="Zu erledigen"
          value={todos.length}
          sub={todos.length ? "Offene Punkte, siehe unten" : "Nichts offen"}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <section className="dash-panel">
          <PanelHead title="Offene Anfragen" href="/dashboard/anfragen" link="Alle ansehen" />
          {openInquiries.length === 0 ? (
            <p className="dash-help mt-2">
              {inq.error ? `Anfragen konnten nicht geladen werden: ${inq.error.message}` : "Keine offenen Anfragen."}
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-[#24272c]">
              {openInquiries.map((r) => {
                const s = inquiryStatus[r.status] ?? { label: r.status, tone: "text-muted" };
                return (
                  <li key={r.id}>
                    <Link href="/dashboard/anfragen" className="flex items-center justify-between gap-3 py-2.5 transition-opacity hover:opacity-80">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {r.name}
                          {r.company && <span className="ml-2 font-normal text-muted">{r.company}</span>}
                        </span>
                        <span className="nums block truncate text-xs text-muted">
                          {typeLabel(r.project_type)}, {dateFmt.format(new Date(r.created_at))}
                        </span>
                      </span>
                      <span className={`dash-pill ${s.tone}`}>
                        <span aria-hidden className="dash-dot" />
                        <span className="text-ink">{s.label}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="dash-panel">
          <PanelHead title="News" href="/dashboard/news" link="Alle ansehen" />
          {newsRows.length === 0 ? (
            <p className="dash-help mt-2">{news.error ? "News konnten nicht geladen werden." : "Noch keine News geschrieben."}</p>
          ) : (
            <ul className="mt-2 divide-y divide-[#24272c]">
              {newsRows.map((n) => {
                const s = newsState(n, t);
                const topic = topicOf(n.topic);
                return (
                  <li key={n.id}>
                    <Link href={`/dashboard/news/${n.id}`} className="flex items-center justify-between gap-3 py-2.5 transition-opacity hover:opacity-80">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{n.title}</span>
                        <span className="nums flex items-center gap-1.5 text-xs text-muted">
                          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: topic.accent }} />
                          {topic.label}, {dateFmt.format(new Date(n.publish_at))}
                        </span>
                      </span>
                      <span className={`shrink-0 text-xs ${s.tone}`}>{s.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <TodoList todos={todos} />
        {/* Der Bot läuft auf dem Heimserver und antwortet langsamer: er wird nachgeladen, statt die Seite aufzuhalten. */}
        <Suspense fallback={<BotWidgetSkeleton />}>
          <BotWidget who={user.email ?? user.id} />
        </Suspense>
      </div>
    </div>
  );
}
