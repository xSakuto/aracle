import Link from "next/link";
import { getProject } from "@/data/projects";
import Changelog from "@/components/project/Changelog";
import { getProjectUpdates } from "@/lib/projects";

export const revalidate = 60;
import { SITE_URL } from "@/lib/site";

const TITLE = "BEER: The Rusty Mug · Eine kleine Online-Taverne für bis zu vier";
const DESCRIPTION =
  "BEER: The Rusty Mug ist eine kostenlose Online-Taverne für bis zu vier Freunde. Bier zapfen, Roulette, Blackjack, Meiern und Darts spielen und nicht verdursten. Entwickelt von Aracle, bald auf Steam.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "BEER", "The Rusty Mug", "Beer Game", "Free to Play Steam", "Online-Taverne",
    "Multiplayer Trinkspiel", "Aracle", "Joel Nef",
  ],
  alternates: { canonical: "/beer" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/beer",
    siteName: "BEER: The Rusty Mug",
    images: [{ url: "/images/beer/rusty-mug.webp", width: 1600, height: 1067, alt: "The Rusty Mug, eine kleine Online-Taverne" }],
  },
};

const tables = [
  { title: "Roulette", host: "mit Bierhard" },
  { title: "Blackjack", host: "mit Hopfried" },
  { title: "Meiern", host: "Würfel und Bluff, am Würfeltisch" },
  { title: "Darts", host: "an der Wand, 501 mit Double-Out" },
];

const also = [
  "Bis zu 4 Spieler, Einladungen über Steam",
  "Proximity-Voice: je weiter weg jemand steht, desto leiser ist er",
  "Ein Plattenspieler mit Musik, ein Bonsai, den die ganze Taverne gemeinsam giesst, und eine Uhr mit der echten Zeit",
  "Achievements, Bestenlisten, Steam Cloud",
  "Deutsch und Englisch",
];

const faq: { q: string; a: string }[] = [
  {
    q: "Was ist The Rusty Mug?",
    a: "Eine kleine Online-Taverne für dich und bis zu drei Freunde. Ihr seid keine Menschen, sondern Fässer und Bierkrüge mit Wackelaugen. Bier zapfen, Tischspiele spielen und versuchen, nicht zu verdursten.",
  },
  {
    q: "Ist es kostenlos?",
    a: "Ja. BEER: The Rusty Mug ist Free to Play, entwickelt und veröffentlicht von Aracle, und kommt auf Steam.",
  },
  {
    q: "Ist es fertig?",
    a: "Nein, es ist in der Alpha und wird von einer Person gemacht. Es kann Bugs geben, und Dinge ändern sich von Monat zu Monat.",
  },
];

// BEER: The Rusty Mug, eigene Landing Page: Kupfer und Taverne, auf Deutsch.
export default async function BeerPage() {
  const p = getProject("beer-game");
  const updates = await getProjectUpdates("beer-game");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/beer`,
        url: `${SITE_URL}/beer`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/beer#game` },
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "VideoGame",
        "@id": `${SITE_URL}/beer#game`,
        name: "BEER: The Rusty Mug",
        description: DESCRIPTION,
        url: `${SITE_URL}/beer`,
        image: `${SITE_URL}/images/beer/rusty-mug.webp`,
        genre: "Party",
        playMode: "MultiPlayer",
        applicationCategory: "GameApplication",
        operatingSystem: "Windows",
        creator: { "@id": `${SITE_URL}/#org` },
        sameAs: ["https://store.steampowered.com/app/3438570/BEER/"],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="theme-beer">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative flex min-h-[86svh] flex-col overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/beer/rusty-mug.webp"
            alt=""
            width={1600}
            height={1067}
            fetchPriority="high"
            data-parallax="0.08"
            className="h-[112%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1c0f03]/35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_12%,rgb(28_15_3/0.55)_55%,rgb(28_15_3/0.25))]" />
        </div>

        <div className="wrap relative mt-auto pb-14 pt-32 md:pb-20">
          <p className="kicker text-aqua" data-rise>Free to Play · Bald auf Steam</p>
          <h1 className="mt-6" data-rise>
            <span className="sr-only">The Rusty Mug</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/beer/beer-logo.png" alt="" aria-hidden width={960} height={540} fetchPriority="high" className="h-auto w-[min(80vw,40rem)] bg-transparent" />
          </h1>
          <div className="mt-8 flex flex-col gap-6 border-t border-ink/15 pt-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="lead max-w-[38ch] text-ink/90">
              Eine kleine Online-Taverne für dich und bis zu drei Freunde. Ihr seid keine Menschen, sondern Fässer und Bierkrüge mit Wackelaugen.
            </p>
            <a href="https://store.steampowered.com/app/3438570/BEER/" target="_blank" rel="noopener noreferrer" className="btn self-start md:self-auto">
              Auf Steam merken <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </header>

      <section aria-labelledby="what-title" className="wrap grid gap-10 py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="what-title" className="head">Worum geht es?</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="lead max-w-[46ch] text-ink/90">
            Ihr seid keine Menschen, sondern Fässer und Bierkrüge mit Wackelaugen und einem Zapfhahn als Nase.
            Ihr zapft Bier, trinkt es, stosst an, verliert euer Geld am Roulette und werft euch Bierdeckel
            an den Kopf. Mehr muss man nicht wissen.
          </p>
        </div>
      </section>

      <section aria-labelledby="pouring-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="pouring-title" className="head">Zapfen.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="max-w-[48ch] text-ink/80">
            Den Hahn öffnest du mit der Maus. Zu weit offen und du hast einen Krug voller Schaum. Zu wenig,
            und alle schauen dir beim Warten zu. Was du verschüttest, wird zur Pfütze, und jemand muss sie
            aufwischen. Nefilou, der Wirt, gibt dafür zwei Münzen Trinkgeld.
          </p>
          <p className="mt-4 max-w-[48ch] text-ink/80">
            Jedes Bier erhöht deinen Alkoholpegel. Der Raum fängt an zu schwanken, deine Hand zittert, und
            irgendwann wirst du ohnmächtig. Der Milchhahn in der Ecke macht dich wieder nüchtern. Du kannst
            auch den ganzen Abend nur Milch trinken, das zählt genauso.
          </p>
        </div>
      </section>

      <section aria-labelledby="tables-title" className="wrap border-t border-line py-[var(--section)]">
        <h2 id="tables-title" className="head">Am Tisch.</h2>
        <p className="mt-4 max-w-[48ch] text-ink/80">
          Beim Meiern kannst du unter den Becher schielen, aber die anderen sehen dich dabei. Beim Darts
          schwankt dein Arm, und nach drei Bier schwankt er ziemlich. Gespielt wird um Taler. Die gibt es nur
          im Spiel und sie lassen sich nicht kaufen.
        </p>
        <ul className="mt-8 grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
          {tables.map((t) => (
            <li key={t.title} className="border-b border-line py-6 last:border-b-0 sm:px-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
              <h3 className="text-[clamp(1.25rem,1rem+0.6vw,1.625rem)] font-[620] tracking-[-0.02em]">{t.title}</h3>
              <p className="small mt-2 text-muted">{t.host}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="session-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="session-title" className="head">Die Biersitzung.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="max-w-[48ch] text-ink/80">
            Sobald zwei Personen in der Taverne sind, startet die Sitzung. Bleibst du 20 Minuten ohne Drink,
            verdurstest du, und die Sitzung endet für alle. Die längsten Sitzungen landen auf der Ehrentafel
            an der Wand und in den Steam-Bestenlisten.
          </p>
        </div>
      </section>

      <section aria-labelledby="looks-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="looks-title" className="head">Look.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="max-w-[48ch] text-ink/80">
            Im Kleiderschrank steht ein Spiegel. Davor wählst du dein Gefäss, Haare, Augen, Brauen, Mund,
            Schnauzer, Hut und Namensschild. Einiges hast du von Anfang an, den Rest kaufst du mit Taler oder
            findest ihn. Ab und zu bekommst du beim Spielen einen Sammelkrug für deine Vitrine, ein paar davon
            sind richtig selten.
          </p>
        </div>
      </section>

      <section aria-labelledby="also-title" className="wrap border-t border-line py-[var(--section)]">
        <h2 id="also-title" className="head">Dazu.</h2>
        <ul className="mt-8 border-b border-line">
          {also.map((a) => (
            <li key={a} className="border-t border-line py-4 text-[0.9375rem] text-ink/80">{a}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="alpha-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="alpha-title" className="head">Alpha.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="max-w-[48ch] text-ink/80">
            Ich mache dieses Spiel alleine, und es ist noch in der Alpha. Es gibt Bugs, und manches sieht nächsten
            Monat anders aus. Wenn dir etwas auffällt oder etwas fehlt, sag es mir auf Discord. Manches ist nur im
            Spiel, weil jemand danach gefragt hat.
          </p>
        </div>
      </section>

      {updates.length > 0 && (
        <section id="changelog" aria-labelledby="changelog-title" className="wrap grid scroll-mt-24 gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="changelog-title" className="head">Changelog.</h2>
            <p className="small mt-3 max-w-[30ch] text-muted">Was sich in der Taverne zuletzt geändert hat.</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Changelog updates={updates} />
          </div>
        </section>
      )}

      <section aria-labelledby="faq-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="faq-title" className="head">Fragen.</h2>
        </div>
        <dl className="border-b border-line md:col-span-7 md:col-start-6">
          {faq.map((f) => (
            <div key={f.q} className="border-t border-line py-6">
              <dt className="font-semibold tracking-[-0.015em]">{f.q}</dt>
              <dd className="mt-2 text-ink/80">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Team und Kontakt" className="border-t border-line">
        <div className="wrap flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="small text-muted">Gemacht von</p>
            <ul className="mt-2 flex flex-wrap gap-x-6 text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-[620] tracking-[-0.02em]">
              {p?.team.map((m) => (
                <li key={m.slug}>
                  <Link href={`/team/${m.slug}`} className="transition-colors hover:text-aqua">{m.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <a href="https://store.steampowered.com/app/3438570/BEER/" target="_blank" rel="noopener noreferrer" className="btn-quiet self-start md:self-auto">
            Auf Steam ansehen <span aria-hidden>↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
