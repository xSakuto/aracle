import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";
import type { SocialType } from "@/data/socials";
import { SITE_URL } from "@/lib/site";

const TITLE = "Swizzly · Motorrad- und Entertainment-Content aus Glarus";
const DESCRIPTION =
  "Swizzly ist der Content-Kanal von Joel Nef aus Glarus: Motorrad, Entertainment und die RS. Auf YouTube, TikTok und Instagram als @swizzly690.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "Swizzly",
    "Motorrad Content Schweiz",
    "Motovlog Schweiz",
    "RS Content",
    "Töff TikTok",
    "Motorrad YouTube Schweiz",
    "Highside",
    "Joel Nef",
    "Content Creator Glarus",
  ],
  alternates: { canonical: "/swizzly" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/swizzly",
    siteName: "Swizzly",
    images: [{ url: "/og/swizzly.jpg", width: 1200, height: 630, alt: "Swizzly, Motorrad- und Entertainment-Content aus Glarus" }],
  },
};

const channels: { type: SocialType; label: string; handle: string; url: string }[] = [
  { type: "youtube", label: "YouTube", handle: "@swizzly690", url: "https://www.youtube.com/@swizzly690" },
  { type: "tiktok", label: "TikTok", handle: "@swizzly690", url: "https://www.tiktok.com/@swizzly690" },
  { type: "instagram", label: "Instagram", handle: "swizzly690", url: "https://www.instagram.com/swizzly690" },
  { type: "discord", label: "Discord", handle: "Community", url: "https://discord.gg/2vYr24vGk2" },
];

// Was auf link.aracle.ch für die RS bereitliegt
const rs: { label: string; url: string; note?: string }[] = [
  { label: "Ultimative RS-Packliste", url: "https://drive.google.com/file/d/12-gWgo_rD7ji8Nes50V3Zh6n052UWVpn/view?usp=drive_link" },
  { label: "Offizielle Armee-Packliste", url: "https://backend.armee.ch/fileservice/sdweb-docs-prod-armeech-files/files/2026/03/31/33199fdb-a78b-4d2e-91f1-e1acb3c6f444.pdf", note: "PDF" },
  { label: "Dienstgrade der Armee", url: "https://de.wikipedia.org/wiki/Grade_der_Schweizer_Armee" },
  { label: "Stgw 90 Ausbildungsgrundlage", url: "https://www.vtg.admin.ch/dam/de/sd-web/l0sXwdzZtnr1/27_219_d%202019.pdf", note: "PDF" },
  { label: "Rohner Sommer-RS-Starterpaket, 20 %", url: "https://rohner-socks.com/products/sommer-rs-starter-kit?_pos=4&_sid=3ca760fe9&_ss=r", note: "Werbung" },
];

const faq: { q: string; a: string }[] = [
  {
    q: "Wer ist Swizzly?",
    a: "Swizzly ist der Content-Kanal von Joel Nef aus Glarus: kurze Videos rund um Motorrad, Entertainment und die RS, auf YouTube, TikTok und Instagram.",
  },
  {
    q: "Wo kann ich Swizzly folgen?",
    a: "Auf YouTube, TikTok und Instagram jeweils als @swizzly690, dazu eine eigene Community auf Discord.",
  },
  {
    q: "Was hat Swizzly mit Highside zu tun?",
    a: "Swizzly ist die Content-Bühne für Highside, die Schweizer Streetwear-Marke aus der Motorrad-Szene von Aracle.",
  },
];

// Swizzly als eigene Landing Page: Bernstein, gross der Name, darunter die Kanäle.
export default function SwizzlyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/swizzly`,
        url: `${SITE_URL}/swizzly`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@type": "Thing", name: "Motorradkultur" },
        mainEntity: { "@id": `${SITE_URL}/swizzly#person` },
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/swizzly#person`,
        name: "Joel-Sananda Nef",
        alternateName: "Swizzly",
        url: `${SITE_URL}/swizzly`,
        jobTitle: "Content Creator",
        knowsAbout: ["Motorrad", "Content Creation", "Schweizer Armee RS"],
        sameAs: [
          "https://www.youtube.com/@swizzly690",
          "https://www.tiktok.com/@swizzly690",
          "https://www.instagram.com/swizzly690",
          "https://discord.gg/2vYr24vGk2",
        ],
        worksFor: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="theme-swizzly">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative flex min-h-[92svh] flex-col overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Brand_assets/images/heros/highside.jpg"
            alt=""
            width={1600}
            height={1067}
            fetchPriority="high"
            data-parallax="0.1"
            className="h-[112%] w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-[#ffb547]/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_10%,rgb(11_17_21/0.55)_55%,rgb(11_17_21/0.35))]" />
        </div>

        <div className="wrap relative mt-auto pb-14 pt-32 md:pb-20">
          <p className="kicker text-aqua" data-rise>Content Creator aus Glarus</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(4.5rem,1rem+14vw,15rem)] font-black leading-[0.82] tracking-[-0.055em]" data-split="load">
            Swizzly
          </h1>
          <div className="mt-8 flex flex-col gap-6 border-t border-ink/15 pt-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="lead max-w-[34ch] text-ink/90">
              Motorrad, Entertainment und alles rund um die RS. Kurze Videos, ehrlich und ohne Filter.
            </p>
            <a href="https://www.youtube.com/@swizzly690" target="_blank" rel="noopener noreferrer" className="btn self-start md:self-auto">
              Auf YouTube ansehen <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </header>

      <section aria-label="Kanäle" className="wrap">
        <ul className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <li key={c.type} className="border-b border-line last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="seg-host group relative flex items-center gap-4 px-1 py-7 transition-colors hover:text-aqua sm:px-6"
              >
                <span aria-hidden className="seg seg-top" />
                <SocialIcon type={c.type} className="h-7 w-7 shrink-0 text-ink/80 transition-colors group-hover:text-aqua" />
                <span>
                  <span className="block text-[1.25rem] font-semibold tracking-[-0.02em]">{c.label}</span>
                  <span className="small block text-muted">{c.handle}</span>
                </span>
                <span aria-hidden className="ml-auto transition-transform duration-500 group-hover:translate-x-1">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Unterwegs" className="wrap py-[var(--section)]">
        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/swizzly/ktm-mountain.webp"
              alt="Swizzly auf der KTM 690 SMC R vor Glarner Bergkulisse"
              width={1080}
              height={1156}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[var(--radius)] object-cover"
            />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/swizzly/ktm-road.webp"
              alt="KTM am Strassenrand vor den Glarner Alpen"
              width={1600}
              height={2133}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[var(--radius)] object-cover"
            />
          </li>
        </ul>
      </section>

      <section aria-labelledby="rs-title" className="wrap grid gap-10 py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="rs-title" className="head">Ready for the RS.</h2>
          <p className="mt-4 text-ink/80">Was in den Videos vorkommt, zum Nachlesen und Mitnehmen.</p>
        </div>
        <ul className="border-b border-line md:col-span-7 md:col-start-6">
          {rs.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel={l.note === "Werbung" ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                className="seg-host group relative flex min-h-14 items-center justify-between gap-4 border-t border-line transition-colors hover:text-aqua"
              >
                <span aria-hidden className="seg seg-top" />
                <span>{l.label}</span>
                <span className="small shrink-0 text-muted">
                  {l.note ? `${l.note} ` : ""}
                  <span aria-hidden>↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-title" className="wrap grid gap-10 py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="faq-title" className="head">Häufige Fragen.</h2>
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

      <section aria-label="Verbunden" className="border-t border-line">
        <div className="wrap flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[40ch] text-ink/80">
            Swizzly ist auch die Bühne für Highside, die Streetwear-Marke aus der Motorrad-Szene. Alle Links an einem Ort auf link.aracle.ch.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/highside" className="btn">Highside</Link>
            <a href="https://link.aracle.ch" target="_blank" rel="noopener noreferrer" className="btn-quiet">link.aracle.ch</a>
          </div>
        </div>
      </section>
    </div>
  );
}
