import { formatStat, getProjectStats } from "@/lib/stats";
import Link from "next/link";
import ZeldaLayers from "@/components/zelda/ZeldaLayers";
import { ZELDA_DISCORD_INVITE } from "@/data/zelda";
import { SITE_URL } from "@/lib/site";

// Titel und Überschrift fangen mit dem an, was Leute suchen: "Zelda Discord".
// Kein Mittelpunkt im Titel, sonst schreibt Google ihn gern selbst um.
const TITLE = "Zelda Discord Community DE: Grösste deutsche Zelda-Community";
const DESCRIPTION =
  "Der deutsche Zelda Discord: Die grösste deutschsprachige The-Legend-of-Zelda-Community für Deutschland, Österreich und die Schweiz. Theorien, Spiele, Speedruns und Nostalgie, von Ocarina of Time bis Tears of the Kingdom. Kostenlos beitreten.";

const thousands = new Intl.NumberFormat("de-CH");

// Mit Live-Mitgliederzahl in der Beschreibung, wenn Discord sie liefert
export async function generateMetadata() {
  const stats = await getProjectStats("zelda-de-server");
  const members = stats.find((s) => s.label === "Mitglieder");
  const description = members
    ? `Der deutsche Zelda Discord mit über ${thousands.format(Math.floor(members.value / 50) * 50)} Mitgliedern: die grösste deutschsprachige The-Legend-of-Zelda-Community. Theorien, Spiele, Speedruns und Nostalgie, von Ocarina of Time bis Tears of the Kingdom. Kostenlos beitreten.`
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
  { title: "Theorien", text: "Timeline, Lore und die grossen Fragen um Hyrule, Zelda und Ganon. Gemeinsam gedacht, ausführlich diskutiert." },
  { title: "Spiele", text: "Von The Legend of Zelda auf dem NES über Ocarina of Time und Breath of the Wild bis Tears of the Kingdom." },
  { title: "Speedruns", text: "Routen, Tricks und Bestzeiten. Für alle, die Hyrule so schnell wie möglich durchqueren wollen." },
  { title: "Nostalgie", text: "Erinnerungen an die ersten Dungeons, die alten Konsolen und die Musik, die man nie mehr vergisst." },
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

// Zelda DE als eigene, suchmaschinenfreundliche Landing Page.
export const revalidate = 3600;

export default async function ZeldaDePage() {
  const stats = await getProjectStats("zelda-de-server");
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
    <div className="theme-zelda">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative flex min-h-[88svh] flex-col overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/zelda/zelda-cover.png"
            alt=""
            width={960}
            height={540}
            fetchPriority="high"
            data-parallax="0.08"
            className="h-[110%] w-full object-cover opacity-50 blur-[2px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_25%_70%,var(--color-bg)_30%,rgb(11_17_21/0.6)_70%,rgb(11_17_21/0.3))]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <ZeldaLayers />
        {/* Handy: Text liegt über den Figuren, darum unten abdunkeln */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-bg via-bg/80 to-transparent md:hidden" />

        <div className="wrap relative mt-auto pb-14 pt-32 md:pb-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/zelda/zelda-de-logo.png" alt="" aria-hidden width={600} height={556} className="mb-6 h-20 w-auto bg-transparent md:h-24" data-rise />
          <p className="kicker text-aqua" data-rise>
            Discord · seit 2022
            {stats[0] && <span className="nums"> · {formatStat(stats[0].value)} {stats[0].label}</span>}
          </p>
          <h1
            className="mega mt-5 max-w-[14ch] !text-[clamp(2.9rem,1.1rem+6.4vw,7.75rem)] !leading-[0.9]"
            data-split="load"
          >
            Zelda Discord Community DE
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="lead max-w-[40ch] text-ink/90">
              Der deutsche Zelda Discord und die grösste deutschsprachige Zelda-Community. Tauche ein in die Welt
              von Hyrule und diskutiere über Theorien, Spiele, Speedruns und Nostalgie.
            </p>
            <div className="flex flex-wrap gap-3">
              {ZELDA_DISCORD_INVITE && (
                <a href={ZELDA_DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="btn">
                  Discord beitreten <span aria-hidden>↗</span>
                </a>
              )}
              <Link href="/zelda-de/regelwerk" className={ZELDA_DISCORD_INVITE ? "btn-quiet" : "btn"}>Regelwerk</Link>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="themen" className="wrap pb-[var(--section)]">
        <h2 id="themen" className="sr-only">Worüber wir reden</h2>
        <ul className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((t) => (
            <li key={t.title} className="border-b border-line py-8 last:border-b-0 sm:px-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
              <h3 className="text-[clamp(1.5rem,1rem+1vw,2rem)] font-[620] tracking-[-0.03em]">{t.title}</h3>
              <p className="mt-3 text-ink/75">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="spiele" className="wrap grid gap-6 pb-[var(--section)] md:grid-cols-12">
        <h2 id="spiele" className="head md:col-span-4">Alle Zelda-Spiele.</h2>
        <ul className="flex flex-wrap gap-2 md:col-span-8">
          {games.map((g) => (
            <li key={g} className="rounded-full border border-line px-3.5 py-1.5 text-[0.9375rem] text-ink/85">{g}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-title" className="wrap grid gap-10 pb-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="faq-title" className="head">Fragen und Antworten.</h2>
          <p className="mt-4 text-ink/80">
            Alles Wichtige zum Discord-Server. Für die Details gibt es das{" "}
            <Link href="/zelda-de/regelwerk" className="link-under">Regelwerk</Link>.
          </p>
        </div>
        <dl className="border-b border-line md:col-span-7 md:col-start-6">
          {faq.map((f) => (
            <div key={f.q} className="border-t border-line py-5">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 text-ink/75">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div aria-hidden className="pointer-events-none relative h-[min(60vw,22rem)] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/zelda/link.webp" alt="" loading="lazy" width={806} height={900} data-parallax="0.05" className="bg-transparent absolute bottom-[-30%] right-[6%] h-[120%] w-auto max-w-none opacity-90 md:right-[14%]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <p className="wrap small pb-12 text-muted">
        Fan-Community. The Legend of Zelda ist eine Marke von Nintendo. Betreut von{" "}
        <Link href="/" className="link-under">Aracle</Link>.
      </p>
    </div>
  );
}
