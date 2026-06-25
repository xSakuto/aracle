import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { featuredProjects } from "@/data/projects";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-aqua">
      <span className="h-px w-8 bg-aqua/60" />
      {children}
    </div>
  );
}

const services = [
  {
    title: "Video",
    desc: "Konzept, Dreh und Schnitt — von Social-Clips bis Brand-Movie.",
    icon: (
      <path d="M3 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zm14 3 4-2v8l-4-2" />
    ),
  },
  {
    title: "Design",
    desc: "Branding, Grafik und visuelle Identität mit Charakter.",
    icon: <path d="M12 3l8 4v10l-8 4-8-4V7l8-4zm0 0v18m8-14-8 4-8-4" />,
  },
  {
    title: "Web",
    desc: "Schnelle, moderne Websites und Web-Apps, sauber gebaut.",
    icon: <path d="M4 6h16M4 6v12h16V6M9 10l-2 2 2 2m6-4 2 2-2 2" />,
  },
  {
    title: "Hosting",
    desc: "Eigene Infrastruktur — Server, die einfach laufen.",
    icon: (
      <path d="M4 5h16v6H4V5zm0 8h16v6H4v-6zm4-5h.01M8 16h.01" />
    ),
  },
];

const partners: { slug: string; label: string }[] = [
  { slug: "dji", label: "DJI" },
  { slug: "sony", label: "Sony" },
  { slug: "sigma", label: "Sigma" },
  { slug: "vercel", label: "Vercel" },
  { slug: "cloudflare", label: "Cloudflare" },
  { slug: "proxmox", label: "Proxmox" },
  { slug: "ubiquiti", label: "UniFi" },
  { slug: "truenas", label: "TrueNAS" },
];

const founderFacts = [
  {
    title: "Motorräder & Streetwear",
    desc: "Highside lebt von der Bikerkultur und urbanem Street-Style.",
    icon: (
      <>
        <circle cx="5.5" cy="16" r="3" />
        <circle cx="18.5" cy="16" r="3" />
        <path d="M5.5 16l4-7h5l3.5 7M9 9h4" />
      </>
    ),
  },
  {
    title: "Content & Community",
    desc: "Foto, Video und Community sind mein kreatives Zuhause.",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <circle cx="12" cy="13.5" r="3.4" />
        <path d="M8.5 7l1.3-2.2h4.4L19 7" />
      </>
    ),
  },
  {
    title: "Technik & Server",
    desc: "Vom Homelab bis zur Cloud: Infrastruktur fasziniert mich.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="7" rx="1.6" />
        <rect x="3" y="13" width="18" height="7" rx="1.6" />
        <path d="M7 7.5h.01M7 16.5h.01" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-top"
          style={{ backgroundImage: "url(/Brand_assets/arcl-header.jpg)" }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.65) 82%, var(--color-bg) 100%)",
          }}
        />
        <p className="mb-6 flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] bg-[#d52b1e]">
            <svg viewBox="0 0 32 32" className="h-2.5 w-2.5" fill="white">
              <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" />
            </svg>
          </span>
          Schweizer Creative Studio
        </p>
        <h1 className="max-w-5xl text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.96] tracking-[-0.04em] [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
          Create. Connect.
          <br />
          <span className="text-gradient">Inspire.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
          Aracle ist ein Creative Studio für Video, Design, Web und Hosting.
          Aus einer Hand, mit eigenen Marken im Portfolio.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/projekte"
            className="rounded-lg bg-aqua px-6 py-3 font-bold text-black transition hover:-translate-y-px hover:opacity-90"
          >
            Projekte entdecken →
          </Link>
          <Link
            href="/kontakt"
            className="font-medium text-dim transition hover:text-white"
          >
            Projekt einreichen ↓
          </Link>
        </div>
      </section>

      {/* PARTNER / TOOLS */}
      <section className="px-6 pb-12 pt-24 text-center md:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          Womit wir arbeiten
        </p>
        <div className="mx-auto mt-10 flex max-w-[1000px] flex-wrap items-center justify-center gap-x-14 gap-y-8">
          {partners.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.slug}
              src={`/Brand_assets/logos/${p.slug}.svg`}
              alt={p.label}
              title={p.label}
              className={`${p.slug === "sigma" ? "" : "logo-white"} h-7 w-auto max-w-[9rem] opacity-60 transition hover:opacity-100`}
            />
          ))}
        </div>
      </section>

      {/* STUDIO / SERVICES */}
      <section className="px-6 py-28 md:px-12">
        <div className="mx-auto max-w-[1320px]">
          <SectionLabel>Was wir machen</SectionLabel>
          <h2 className="max-w-3xl text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Ein Studio, vier Disziplinen.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-dim">
            Video, Design, Web und Hosting aus einer Hand. Wir bauen Marken und
            Projekte, die nicht nur gut aussehen, sondern laufen.
          </p>
          <div className="mt-14 grid gap-x-9 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="max-w-xs">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-aqua/10 text-aqua">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    {s.icon}
                  </svg>
                </span>
                <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-[1320px]">
          <SectionLabel>Portfolio</SectionLabel>
          <h2 className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Eigene Marken &amp; Projekte.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
          <Link
            href="/projekte"
            className="mt-10 inline-block font-medium text-dim transition hover:text-aqua"
          >
            Alle Projekte ansehen →
          </Link>
        </div>
      </section>

      {/* GRÜNDER */}
      <section className="px-6 py-28 md:px-12">
        <div className="mx-auto grid max-w-[1320px] items-stretch gap-12 md:grid-cols-[0.8fr_1fr]">
          <div
            className="min-h-[26rem] rounded-2xl bg-cover bg-top md:min-h-[42rem]"
            style={{
              backgroundImage: "url(/Brand_assets/images/heros/joel.jpg)",
            }}
            role="img"
            aria-label="Joel Nef"
          />
          <div className="flex flex-col justify-center">
            <SectionLabel>Wer dahinter steckt</SectionLabel>
            <h2 className="text-[clamp(2.4rem,4.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Ciao, ich bi dr Joel.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-dim">
              Gründer von Aracle. Angefangen hat alles 2017 mit einer simplen
              Idee: Leute, die etwas können, zusammenbringen, statt allein vor
              sich hin zu werkeln. Heute steckt in Aracle alles, was mich
              antreibt.
            </p>
            <div className="mt-9 flex flex-col gap-6">
              {founderFacts.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua/10 text-aqua">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      {f.icon}
                    </svg>
                  </span>
                  <p className="text-sm leading-snug text-muted">
                    <strong className="mb-0.5 block text-base font-bold text-white">
                      {f.title}
                    </strong>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-9 border-l-2 border-aqua/30 pl-5 text-lg italic text-dim">
              Lieber echt als perfekt. Lieber gemeinsam als allein.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 text-center md:px-12">
        <h2 className="mx-auto max-w-3xl text-[clamp(2.6rem,5vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.035em]">
          Bereit für dein <span className="text-gradient">Projekt?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          Erzähl uns davon — wir bringen es zum Laufen.
        </p>
        <Link
          href="/kontakt"
          className="mt-10 inline-block rounded-lg bg-aqua px-8 py-4 font-bold text-black transition hover:-translate-y-px hover:opacity-90"
        >
          Projekt einreichen →
        </Link>
      </section>
    </>
  );
}
