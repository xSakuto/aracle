import Link from "next/link";
import SheikahRing from "@/components/zelda/SheikahRing";
import StickyJoin from "@/components/zelda/StickyJoin";
import ZeldaLayers from "@/components/zelda/ZeldaLayers";
import { getProjectStats } from "@/lib/stats";
import { ZELDA_DISCORD_INVITE, ZELDA_GUILD_ID } from "@/data/zelda";
import { LiveNow, LiveOnline, LiveOnlineText } from "@/components/zelda/Live";
import { getLiveSummary } from "@/lib/discordWidget";
import { SITE_URL } from "@/lib/site";

// Titel und Überschrift fangen mit dem an, was Leute suchen: "Zelda Discord".
// Kein Mittelpunkt im Titel, sonst schreibt Google ihn gern selbst um.
const TITLE = "Zelda Discord Community DE: Grösste deutsche Zelda-Community";
const DESCRIPTION =
  "Der deutsche Zelda Discord: Die grösste deutschsprachige The-Legend-of-Zelda-Community für Deutschland, Österreich und die Schweiz. Theorien, Spiele, Speedruns und Nostalgie, egal ob Ocarina of Time oder Tears of the Kingdom. Kostenlos beitreten.";

const thousands = new Intl.NumberFormat("de-CH");

// Mit Live-Mitgliederzahl in der Beschreibung, wenn Discord sie liefert
export async function generateMetadata() {
  const stats = await getProjectStats("zelda-de-server");
  const members = stats.find((s) => s.label === "Mitglieder");
  const description = members
    ? `Der deutsche Zelda Discord mit über ${thousands.format(Math.floor(members.value / 50) * 50)} Mitgliedern: die grösste deutschsprachige The-Legend-of-Zelda-Community. Theorien, Spiele, Speedruns und Nostalgie, egal ob Ocarina of Time oder Tears of the Kingdom. Kostenlos beitreten.`
    : DESCRIPTION;
  return { ...metadata, description, openGraph: { ...metadata.openGraph, description } };
}

const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "ZeldaDE", "Zelda DE", "ZeldaDE Discord", "Zelda Community DE", "Zelda Aracle",
    "Zelda Discord",
    "Zelda Discord Server",
    "Zelda Discord Community DE",
    "Deutscher Zelda Discord",
    "Echoes of Wisdom Discord",
    "Zelda Community deutsch",
    "Zelda Discord Server deutsch",
    "The Legend of Zelda Community",
    "Tears of the Kingdom Discord",
    "Breath of the Wild Community",
    "Zelda Speedrun deutsch",
    "Zelda Theorien",
    "Hyrule",
  ],
  alternates: { canonical: "/zelda-de" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/zelda-de",
    siteName: "Zelda Community DE",
    images: [{ url: "/og/zelda-de.jpg", width: 1200, height: 630, alt: "Zelda Community DE auf Discord" }],
  },
};

const topics = [
  { title: "Theorien", text: "Timeline, Lore und die grossen Fragen um Hyrule, Zelda und Ganon." },
  { title: "Spiele", text: "Jeder Teil hat hier seine Fans, egal ob das NES-Original oder Echoes of Wisdom." },
  { title: "Speedruns", text: "Routen, Tricks und Bestzeiten, für alle, die Hyrule schnell durchqueren wollen." },
  { title: "Nostalgie", text: "Die ersten Dungeons, die alten Konsolen und die Musik, die man nie vergisst." },
];

// Ein echter Ablauf, darum nummeriert
const steps = [
  { title: "Auf «Discord beitreten» tippen", text: "Auf dem Handy öffnet sich direkt die Discord-App, am Computer der Browser." },
  { title: "Einladung annehmen", text: "Noch kein Discord? Den Account machst du in einer Minute, kostenlos." },
  { title: "Regeln bestätigen und loslegen", text: "Kurz das Regelwerk lesen, Rollen wählen, Hallo sagen." },
];

const games = [
  "The Legend of Zelda", "A Link to the Past", "Link's Awakening", "Ocarina of Time", "Majora's Mask",
  "Oracle of Seasons & Ages", "The Wind Waker", "The Minish Cap", "Twilight Princess", "Phantom Hourglass",
  "Spirit Tracks", "Skyward Sword", "A Link Between Worlds", "Breath of the Wild", "Tears of the Kingdom",
  "Echoes of Wisdom",
];

const faq = [
  {
    q: "Was ist die Zelda Community DE?",
    a: "Die grösste deutschsprachige Community rund um The Legend of Zelda auf Discord. Hier treffen sich Fans aus Deutschland, Österreich und der Schweiz, um über Theorien, Spiele, Speedruns und Nostalgie zu reden.",
  },
  {
    q: "Wie trete ich bei?",
    a: ZELDA_DISCORD_INVITE
      ? "Über den Einladungslink auf dieser Seite. Du brauchst nur einen Discord-Account."
      : "Über den Einladungslink zum Discord-Server. Du brauchst nur einen Discord-Account.",
  },
  {
    q: "Gibt es einen deutschen Zelda Discord?",
    a: "Ja, die Zelda Discord Community DE. Sie ist die grösste deutschsprachige Zelda-Community auf Discord, mit Mitgliedern aus Deutschland, Österreich und der Schweiz.",
  },
  {
    q: "Kostet der Beitritt etwas?",
    a: "Nein. Beitreten ist kostenlos, du brauchst nur einen Discord-Account.",
  },
  {
    q: "Um welche Zelda-Spiele geht es?",
    a: "Um alle: vom ersten The Legend of Zelda über A Link to the Past, Ocarina of Time, Majora's Mask, The Wind Waker, Twilight Princess und Skyward Sword bis Breath of the Wild, Tears of the Kingdom und Echoes of Wisdom.",
  },
  {
    q: "Muss ich auf Spoiler achten?",
    a: "Ja. Alles aus Tears of the Kingdom, was über die erste Himmelsinsel hinausgeht, wird als Spoiler markiert. Die Details stehen im Regelwerk.",
  },
  {
    q: "Wer steht hinter der Community?",
    a: "Die Community wurde 2022 gegründet und wird von Aracle aus Glarus technisch betreut und moderiert.",
  },
];

// Zelda DE als eigene Landing Page mit einem Ziel: möglichst viele Leute
// möglichst einfach in den Discord bringen. Auf dem Handy gebaut wie eine App:
// grosse Schrift, ein grosser Button, unten eine mitlaufende Beitreten-Leiste.
export const revalidate = 300;

const fmt = new Intl.NumberFormat("de-CH");

function JoinButton({ id, className = "" }: { id?: string; className?: string }) {
  if (!ZELDA_DISCORD_INVITE) return null;
  return (
    <a
      id={id}
      href={ZELDA_DISCORD_INVITE}
      target="_blank"
      rel="noopener noreferrer"
      className={`zelda-join inline-flex h-[3.75rem] w-full items-center justify-center gap-3 rounded-[14px] px-8 text-[1.1875rem] font-semibold tracking-[-0.01em] sm:w-auto ${className}`}
    >
      <DiscordGlyph />
      Discord beitreten
    </a>
  );
}

function DiscordGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor">
      <path d="M20.3 4.4A19.7 19.7 0 0 0 15.4 3l-.6 1.3a18.3 18.3 0 0 0-5.6 0L8.6 3a19.6 19.6 0 0 0-4.9 1.4C.6 9.1-.3 13.6.1 18.1a19.9 19.9 0 0 0 6 3l1.3-2.1a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1l1.3 2.1a19.8 19.8 0 0 0 6-3c.5-5.2-.8-9.7-3.6-13.7ZM8.3 15.3c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm7.4 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
    </svg>
  );
}

export default async function ZeldaDePage() {
  const [stats, widget] = await Promise.all([getProjectStats("zelda-de-server"), getLiveSummary(ZELDA_GUILD_ID)]);
  const members = stats.find((s) => s.label === "Mitglieder")?.value;
  // Online lieber aus dem Widget (genauer), sonst aus der Einladung
  const inviteOnline = stats.find((s) => s.label === "gerade online")?.value;
  const live = widget ?? (inviteOnline ? { online: inviteOnline, avatars: [], playing: [], voice: [] } : null);
  const online = live?.online;
  const onlineText = online ? `${fmt.format(online)} gerade online` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/zelda-de`,
        url: `${SITE_URL}/zelda-de`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de",
        about: { "@type": "VideoGameSeries", name: "The Legend of Zelda" },
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "Organization",
        name: "Zelda Community DE",
        url: `${SITE_URL}/zelda-de`,
        logo: `${SITE_URL}/images/zelda/zelda-de-logo.png`,
        foundingDate: "2022",
        parentOrganization: { "@id": `${SITE_URL}/#org` },
        ...(ZELDA_DISCORD_INVITE ? { sameAs: [ZELDA_DISCORD_INVITE] } : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="theme-zelda zelda-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ───────────────────────────────────────────── */}
      <header className="relative overflow-hidden md:flex md:min-h-[92svh] md:items-end">
        {/* Hyrule als Bildband oben (Handy) oder als Hintergrund (Desktop) */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-[40svh] md:inset-0 md:h-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/zelda/zelda-cover.png"
            alt=""
            width={735}
            height={418}
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_40%] md:opacity-45 md:blur-[2px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(7_22_26/0.35),rgb(7_22_26/0.15)_35%,var(--zelda-bg)_96%)] md:bg-[radial-gradient(ellipse_65%_80%_at_25%_75%,var(--zelda-bg)_35%,rgb(7_22_26/0.55)_75%,rgb(7_22_26/0.25))]" />
        </div>

        {/* Desktop: Zelda und Navi rechts, wie gehabt */}
        <div aria-hidden className="hidden md:block">
          <ZeldaLayers />
        </div>

        <div className="wrap relative pb-14 pt-[calc(40svh-7rem)] text-center md:w-full md:pb-20 md:pt-40 md:text-left">
          <SheikahRing className="mx-auto w-36 md:mx-0 md:w-32" />

          <h1 className="mx-auto mt-6 max-w-[13ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,1.6rem+5.2vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.045em] md:mx-0">
            Zelda Discord Community DE
          </h1>

          <p className="mx-auto mt-5 max-w-[30ch] text-[1.1875rem] leading-[1.45] text-ink/85 md:mx-0 md:max-w-[40ch] md:text-[1.375rem]">
            Die grösste deutsche Zelda-Community. Theorien, Spiele, Speedruns und Nostalgie, mit Fans aus Deutschland, Österreich und der Schweiz.
          </p>

          <LiveOnline guildId={ZELDA_GUILD_ID} initial={live} members={members} />

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:justify-start">
            <JoinButton id="join-top" />
            <Link href="/zelda-de/regelwerk" className="inline-flex h-[3.75rem] items-center justify-center rounded-[14px] px-7 text-[1.0625rem] font-medium text-ink/85 transition-colors hover:text-ink active:opacity-70">
              Regelwerk lesen
            </Link>
          </div>
          <p className="mt-3 text-[0.9375rem] text-ink/60">Kostenlos. Du brauchst nur einen Discord-Account.</p>
        </div>
      </header>

      {/* ── So kommst du rein ──────────────────────────────── */}
      <section aria-labelledby="so-gehts" className="wrap py-16 md:py-24">
        <h2 id="so-gehts" className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-bold leading-[1] tracking-[-0.035em]">
          In 30 Sekunden drin.
        </h2>
        <ol className="mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-[18px] border border-aqua/15 bg-[var(--zelda-surface)] p-5 md:flex-col md:p-7">
              <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-aqua/40 text-[1.0625rem] font-semibold text-aqua nums">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[1.25rem] font-semibold leading-tight tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-1.5 text-[1.0625rem] leading-[1.5] text-ink/75">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Live aus dem Discord: Spiele und Sprachkanäle ─── */}
      <LiveNow guildId={ZELDA_GUILD_ID} initial={live} />

      {/* ── Worüber wir reden: auf dem Handy zum Wischen ───── */}
      <section aria-labelledby="themen" className="py-4 md:py-8">
        <div className="wrap flex items-end justify-between gap-4">
          <h2 id="themen" className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-bold leading-[1] tracking-[-0.035em]">
            Worüber wir reden.
          </h2>
          <p aria-hidden className="pb-1 text-[0.9375rem] text-ink/55 md:hidden">Wischen</p>
        </div>
        <ul className="zelda-swipe mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--margin)] pb-2 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible">
          {topics.map((t) => (
            <li
              key={t.title}
              className="w-[78%] shrink-0 snap-start rounded-[18px] bg-[var(--zelda-surface)] p-6 ring-1 ring-aqua/15 md:w-auto md:p-7"
            >
              <h3 className="text-[1.75rem] font-bold tracking-[-0.03em] text-aqua">{t.title}</h3>
              <p className="mt-3 text-[1.0625rem] leading-[1.5] text-ink/80">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Alle Spiele (auch für die Suche wichtig) ───────── */}
      <section aria-labelledby="spiele" className="wrap py-16 md:py-24">
        <h2 id="spiele" className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-bold leading-[1] tracking-[-0.035em]">
          Jedes Zelda-Spiel.
        </h2>
        <p className="mt-3 max-w-[40ch] text-[1.0625rem] leading-[1.5] text-ink/75">
          Egal ob du 1986 angefangen hast oder mit Breath of the Wild: hier findest du Leute, die dasselbe spielen.
        </p>
        <ul className="mt-7 flex flex-wrap gap-2">
          {games.map((g, i) => (
            <li
              key={g}
              className={`rounded-full px-4 py-2 text-[1rem] ${
                i >= games.length - 3 ? "bg-aqua/12 text-aqua ring-1 ring-aqua/35" : "text-ink/85 ring-1 ring-ink/15"
              }`}
            >
              {g}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Fragen ─────────────────────────────────────────── */}
      <section aria-labelledby="faq-title" className="wrap pb-16 md:grid md:grid-cols-12 md:gap-10 md:pb-24">
        <div className="md:col-span-4">
          <h2 id="faq-title" className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-bold leading-[1] tracking-[-0.035em]">
            Fragen.
          </h2>
          <p className="mt-3 text-[1.0625rem] text-ink/75">
            Die Details stehen im <Link href="/zelda-de/regelwerk" className="link-under">Regelwerk</Link>.
          </p>
        </div>
        <div className="mt-7 border-b border-aqua/15 md:col-span-7 md:col-start-6 md:mt-0">
          {faq.map((f) => (
            <details key={f.q} className="group border-t border-aqua/15">
              <summary className="flex min-h-[4rem] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[1.125rem] font-semibold leading-snug tracking-[-0.015em] transition-colors hover:text-aqua focus-visible:text-aqua [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/20 text-[1.25rem] font-normal transition-transform duration-300 ease-[var(--ease-out)] group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-[56ch] pb-5 text-[1.0625rem] leading-[1.55] text-ink/80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Schluss: zweiter grosser Button ────────────────── */}
      <section aria-labelledby="schluss" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/zelda/link.webp" alt="" loading="lazy" width={894} height={1000} className="absolute -right-[18%] bottom-[-8%] h-[105%] w-auto max-w-none bg-transparent opacity-35 md:right-[8%] md:opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--zelda-bg)_35%,transparent)] md:bg-[linear-gradient(to_right,var(--zelda-bg)_40%,transparent_80%)]" />
        </div>
        <div className="wrap relative py-20 md:py-32">
          <h2 id="schluss" className="max-w-[12ch] text-[clamp(2.5rem,1.6rem+4vw,5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
            Hyrule wartet auf dich.
          </h2>
          {onlineText && <p className="mt-4 text-[1.125rem] text-ink/80">{onlineText}. Sag einfach Hallo.</p>}
          <div className="mt-8 max-w-sm sm:max-w-none">
            <JoinButton id="join-bottom" />
          </div>
        </div>
      </section>

      <p className="wrap pb-28 pt-6 text-[0.875rem] text-ink/50 md:pb-12">
        Fan-Community, nicht mit Nintendo verbunden. The Legend of Zelda ist eine Marke von Nintendo. Betreut von{" "}
        <Link href="/" className="link-under">Aracle</Link>.
      </p>

      {ZELDA_DISCORD_INVITE && <StickyJoin href={ZELDA_DISCORD_INVITE} online={<LiveOnlineText guildId={ZELDA_GUILD_ID} initial={live} />} />}
    </div>
  );
}
