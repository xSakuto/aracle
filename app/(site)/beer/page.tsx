import Link from "next/link";
import { getProject } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

const TITLE = "BEER: The Rusty Mug · A tiny online tavern for up to four";
const DESCRIPTION =
  "BEER: The Rusty Mug is a free-to-play online tavern for up to four friends. Pour beer, play roulette, blackjack, Meiern and darts, and don't die of thirst. In development by Aracle, coming to Steam.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "BEER", "The Rusty Mug", "Beer Game", "Free to Play Steam", "Online tavern game",
    "Multiplayer drinking game", "Aracle", "Joel Nef",
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
  { title: "Roulette", host: "with Bierhard" },
  { title: "Blackjack", host: "with Hopfried" },
  { title: "Meiern", host: "dice & bluffing, at the dice table" },
  { title: "Darts", host: "on the wall, 501 double out" },
];

const also = [
  "Up to 4 players, invite friends through Steam",
  "Proximity voice: the further away someone stands, the quieter they are",
  "A record player with music, a bonsai the whole tavern waters together, and a clock that shows the real time",
  "Achievements, leaderboards, Steam Cloud",
  "English and German",
];

const faq: { q: string; a: string }[] = [
  {
    q: "What is The Rusty Mug?",
    a: "A small online tavern for you and up to three friends. You're not people, you're barrels and beer mugs with googly eyes. Pour beer, play table games, and try not to die of thirst.",
  },
  {
    q: "Is it free?",
    a: "Yes. BEER: The Rusty Mug is free-to-play, developed and published by Aracle, coming to Steam.",
  },
  {
    q: "Is it finished?",
    a: "No, it's in alpha and made by one person. Expect bugs, and things changing month to month.",
  },
];

// BEER: The Rusty Mug, eigene Landing Page: Kupfer und Taverne, im eigenen Wortlaut des Spiels.
export default function BeerPage() {
  const p = getProject("beer-game");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/beer`,
        url: `${SITE_URL}/beer`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
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
          <p className="kicker text-aqua" data-rise>Free to Play · Coming to Steam</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(3rem,1rem+8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em]" data-split="load">
            The Rusty Mug
          </h1>
          <div className="mt-8 flex flex-col gap-6 border-t border-ink/15 pt-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="lead max-w-[38ch] text-ink/90">
              A tiny online tavern for you and up to three friends. You&apos;re not people, you&apos;re barrels and beer mugs with googly eyes.
            </p>
            <a href="https://store.steampowered.com/app/3438570/BEER/" target="_blank" rel="noopener noreferrer" className="btn self-start md:self-auto">
              Wishlist on Steam <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </header>

      <section aria-labelledby="what-title" className="wrap grid gap-10 py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="what-title" className="head">What is this?</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="lead max-w-[46ch] text-ink/90">
            You&apos;re not people, you&apos;re barrels and beer mugs with googly eyes and a tap for a nose.
            You pour beer, drink it, clink glasses, lose your money at roulette and throw beer coasters at
            each other&apos;s heads. That&apos;s about all you need to know.
          </p>
        </div>
      </section>

      <section aria-labelledby="pouring-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="pouring-title" className="head">Pouring.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="max-w-[48ch] text-ink/80">
            You open the tap with your mouse. Open it too far and you get a mug full of foam. Not far
            enough and everyone watches you wait. Whatever you spill turns into a puddle, and someone has
            to mop it up. Nefilou, the landlord, tips two coins for that.
          </p>
          <p className="mt-4 max-w-[48ch] text-ink/80">
            Every beer raises your blood alcohol. The room starts to sway, your hand shakes, and
            eventually you black out. The milk tap in the corner sobers you up. You can also spend the
            whole evening drinking only milk, it counts just the same.
          </p>
        </div>
      </section>

      <section aria-labelledby="tables-title" className="wrap border-t border-line py-[var(--section)]">
        <h2 id="tables-title" className="head">At the tables.</h2>
        <p className="mt-4 max-w-[48ch] text-ink/80">
          In Meiern you can peek under the cup, but the others see you doing it. In darts your arm sways,
          and after three beers it sways a lot. You play for Taler. They only exist in the game and
          can&apos;t be bought.
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
          <h2 id="session-title" className="head">The Beer Session.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="max-w-[48ch] text-ink/80">
            As soon as two people are in the tavern, the session starts. Go 20 minutes without a drink and
            you die of thirst, and the session ends for everyone. The longest sessions go up on the board
            of honour on the wall and on the Steam leaderboards.
          </p>
        </div>
      </section>

      <section aria-labelledby="looks-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="looks-title" className="head">Looks.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="max-w-[48ch] text-ink/80">
            There&apos;s a mirror in the wardrobe. In front of it you pick your vessel, hair, eyes, brows,
            mouth, moustache, hat and name plate. Some of it you have from the start, the rest you buy
            with Taler or find. Every now and then you get a collectible mug for your display case while
            playing, and a few of them are pretty rare.
          </p>
        </div>
      </section>

      <section aria-labelledby="also-title" className="wrap border-t border-line py-[var(--section)]">
        <h2 id="also-title" className="head">Also.</h2>
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
            I&apos;m making this game on my own, and it&apos;s still in alpha. There are bugs, and some
            things will look different next month. If you notice something or miss something, tell me on
            Discord. Some things are in the game only because someone asked for them.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="faq-title" className="head">FAQ.</h2>
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
                  <Link href={`/team#${m.slug}`} className="transition-colors hover:text-aqua">{m.name}</Link>
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
