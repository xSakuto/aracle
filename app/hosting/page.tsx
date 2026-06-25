import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Aracle Cloud Hosting · Infrastruktur",
  description:
    "Eigene Server, sauber betrieben: Hosting für Web, Game-Server und Community-Projekte, aus der Schweiz.",
};

const features = [
  {
    title: "Webhosting",
    desc: "Schnelle, sichere Umgebungen für Websites und Web-Apps.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
      </>
    ),
  },
  {
    title: "Game- & Community-Server",
    desc: "Minecraft, Discord-Bots und mehr, stabil rund um die Uhr.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="7" rx="1.6" />
        <rect x="3" y="13" width="18" height="7" rx="1.6" />
        <path d="M7 7.5h.01M7 16.5h.01" />
      </>
    ),
  },
  {
    title: "Verwaltung & Sicherheit",
    desc: "Updates, Backups und Monitoring, wir kümmern uns drum.",
    icon: (
      <>
        <path d="M12 3l8 3v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];

const stack = ["Proxmox", "UniFi", "TrueNAS", "Docker"];

export default function HostingPage() {
  return (
    <>
      {/* HERO */}
      <header className="relative flex min-h-[68vh] items-end overflow-hidden px-6 pb-14 pt-32 md:px-12">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: "url(/Brand_assets/images/heros/cloudhosting.jpg)",
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 55%, var(--color-bg) 100%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-aqua via-sky-400 to-aqua" />
        <div className="mx-auto w-full max-w-[1100px]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
            Aracle Cloud Hosting
          </p>
          <h1 className="mt-3 text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em] [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
            Infrastruktur, die läuft.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
            Eigene Server, sauber betrieben: Hosting für Web, Game-Server und
            Community-Projekte, aus der Schweiz.
          </p>
        </div>
      </header>

      {/* INTRO + LEISTUNGEN */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>Was ist Aracle Cloud</SectionLabel>
          <h2 className="max-w-3xl text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.03em]">
            Die technische Basis von Aracle.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-dim">
            Hosting, Server-Management und Infrastruktur für alle Projekte im
            Studio. Vom Homelab bis zur produktiven Cloud, betrieben und
            gewartet im eigenen Stack.
          </p>

          <div className="mt-16 grid gap-x-9 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="max-w-sm">
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
                    {f.icon}
                  </svg>
                </span>
                <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {f.desc}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Tech-Stack */}
          <div className="mt-16 border-t border-line pt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              Unser Stack
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {stack.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-dim"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 md:px-12">
        <div className="mx-auto max-w-[1100px] overflow-hidden rounded-3xl border border-line bg-surface p-10 text-center md:p-16">
          <h2 className="mx-auto max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.03em]">
            Projekt hosten?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-dim">
            Sag uns, was du brauchst, wir richten dir die passende Umgebung ein.
          </p>
          <Link
            href="/kontakt"
            className="mt-8 inline-block rounded-lg bg-aqua px-7 py-3.5 font-bold text-black transition hover:-translate-y-px hover:opacity-90"
          >
            Anfrage starten →
          </Link>
        </div>
      </section>
    </>
  );
}
