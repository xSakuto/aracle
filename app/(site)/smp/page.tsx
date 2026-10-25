import Link from "next/link";
import CopyValue from "@/components/brand/CopyValue";
import PixelGround from "@/components/smp/PixelGround";
import { SMP_DISCORD_INVITE } from "@/data/smp";
import { SITE_URL } from "@/lib/site";

const TITLE = "AracleSMP · Vanilla+ Minecraft-Server";
const DESCRIPTION =
  "AracleSMP ist ein Langzeit-Server für Freunde und Mitglieder. Vanilla+, Minecraft 1.21.10. Bewirb dich, um mitzuspielen.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["AracleSMP", "Minecraft Server Schweiz", "Vanilla+ Server", "Minecraft Server Freunde", "All the Clients Modpack", "Minecraft 1.21.10"],
  alternates: { canonical: "/smp" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/smp",
    siteName: "AracleSMP",
    images: [{ url: "/og/smp.jpg", width: 1200, height: 630, alt: "AracleSMP, Vanilla+ Minecraft-Server" }],
  },
};

const faq: { q: string; a: string }[] = [
  {
    q: "Was ist AracleSMP?",
    a: "Ein Vanilla+ Minecraft-Server für Freunde und Mitglieder, Minecraft 1.21.10, langfristig betrieben auf eigener Hardware von Aracle Cloud.",
  },
  {
    q: "Wie trete ich bei?",
    a: "Über unseren Discord. Dort verknüpfst du deinen Minecraft-Account, danach kannst du direkt auf play.aracle.ch mitspielen.",
  },
  {
    q: "Welches Modpack läuft auf dem Server?",
    a: "All the Clients, ein eigenes performance-optimiertes und vanilla-kompatibles Modpack von Aracle, veröffentlicht auf Modrinth.",
  },
];

const facts: { title: string; text: string; href?: string }[] = [
  { title: "Kein Pay-to-Win", text: "Ohne regelmässige Welt-Resets und ohne unnötigen Plugin-Ballast. Was du baust, bleibt." },
  { title: "Shop und AraCoins", text: "Gründe einen Shop, verdiene AraCoins und verwirkliche Projekte mit anderen Spielern." },
  { title: "Proximity Voice", text: "Optionaler Sprachchat: Wer näher steht, hört dich besser." },
];

const steps: [string, string, string][] = [
  ["Discord beitreten", "Tritt unserem Discord-Server bei. Das ist der Treffpunkt der Community.", "https://placehold.co/640x360?text=Discord"],
  ["Minecraft-Account verknüpfen", "Verknüpfe dort deinen Minecraft-Account mit deinem Discord-Profil.", "https://placehold.co/640x360?text=Account+verkn%C3%BCpfen"],
  ["Mitspielen", "Sobald verknüpft, verbindest du dich direkt mit play.aracle.ch.", "https://placehold.co/640x360?text=play.aracle.ch"],
];

// AracleSMP: eigene Landing Page im Minecraft-Stil, mit Bewerbung statt offener Tür.
export default function SmpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/smp`,
        url: `${SITE_URL}/smp`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/smp#org` },
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/smp#org`,
        name: "AracleSMP",
        url: `${SITE_URL}/smp`,
        logo: `${SITE_URL}/images/smp/vanilla-logo.png`,
        foundingDate: "2025",
        parentOrganization: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="theme-smp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" precedence="default" />

      <header className="relative overflow-hidden bg-[linear-gradient(to_bottom,#0b1115,#10202a_70%,#16303a)]">
        <div aria-hidden className="mc-stars pointer-events-none absolute inset-0" />
        <div className="wrap relative pb-14 pt-32 md:pb-20 md:pt-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/smp/server-icon.png" alt="" aria-hidden width={64} height={64} className="mb-6 h-16 w-16 bg-transparent [image-rendering:pixelated]" data-rise />
          <p className="mc-label text-aqua" data-rise>Vanilla+ · Minecraft 1.21.10</p>
          <h1 className="mc-title mt-4 text-[clamp(3rem,1rem+8vw,8.5rem)] leading-[0.95]" data-rise style={{ ["--i" as string]: 1 }}>
            AracleSMP
          </h1>
          <p className="mt-6 text-[clamp(1.5rem,1rem+2vw,2.5rem)] font-[620] leading-[1.1] tracking-[-0.03em] text-ink" data-rise style={{ ["--i" as string]: 2 }}>
            Deine Welt. Deine Geschichte.
          </p>
          <p className="lead mt-4 max-w-[46ch] text-ink/85" data-rise style={{ ["--i" as string]: 2 }}>
            AracleSMP ist ein langfristiger Vanilla+ Minecraft-Survival-Server, auf dem eine kleine Community
            gemeinsam eine grosse Welt erschafft. Baue deine eigene Basis, gründe einen Shop, verdiene AraCoins
            und verwirkliche Projekte mit anderen Spielern.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" data-rise style={{ ["--i" as string]: 3 }}>
            <div className="mc-slot flex items-center gap-4 px-4 py-2">
              <span className="mc-label !mb-0 text-muted">Server</span>
              <CopyValue value="play.aracle.ch" label="Server-Adresse" />
            </div>
            {SMP_DISCORD_INVITE ? (
              <a href={SMP_DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="mc-btn">
                Discord beitreten <span aria-hidden>↗</span>
              </a>
            ) : (
              <a href="#bewerben" className="mc-btn">Zum Discord</a>
            )}
          </div>
        </div>
        <PixelGround className="relative block h-[clamp(48px,7vw,96px)] w-full" />
      </header>

      <section aria-label="Der Server" className="bg-[#2a1d12]/30">
        <ul className="wrap grid gap-4 py-[calc(var(--section)*0.7)] md:grid-cols-3">
          {facts.map((f, i) => (
            <li key={f.title} data-reveal style={{ ["--i" as string]: i }} className="mc-panel p-6">
              <h2 className="mc-title text-[1.375rem] text-aqua">{f.title}</h2>
              <p className="mt-3 text-ink/80">{f.text}</p>
              {f.href && (
                <Link href={f.href} className="link-under small mt-4 inline-flex min-h-10 items-center font-medium">Mehr dazu</Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="bewerben" aria-labelledby="bewerben-title" className="scroll-mt-20 border-t border-line">
        <div className="wrap grid gap-12 py-[var(--section)] md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="bewerben-title" className="mc-title text-[clamp(2rem,1rem+2.6vw,3.25rem)] leading-[1]">Join the server.</h2>
            <p className="mt-4 text-ink/80">Der Server läuft über Discord: dort verknüpfst du deinen Minecraft-Account und spielst sofort mit.</p>
            <ol className="mt-8 border-b border-line">
              {steps.map(([k, v, img], i) => (
                <li key={k} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-line py-4">
                  <span className="mc-title text-aqua">{i + 1}</span>
                  <span>
                    <span className="block font-medium">{k}</span>
                    <span className="small block text-ink/70">{v}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" loading="lazy" width={640} height={360} className="mt-3 aspect-video w-full rounded-[var(--radius)] object-cover" />
                  </span>
                </li>
              ))}
            </ol>
            {SMP_DISCORD_INVITE && (
              <a href={SMP_DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="mc-btn mt-8 inline-flex">
                Discord beitreten <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="wrap grid gap-10 border-t border-line py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="faq-title" className="mc-title text-[clamp(1.75rem,1rem+2vw,2.5rem)] leading-[1.1]">Häufige Fragen.</h2>
          <p className="mt-4 text-ink/80">Kurz beantwortet, für alle, die neu dazukommen.</p>
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
    </div>
  );
}
