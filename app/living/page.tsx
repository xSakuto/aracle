import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Aracle Living · Immobilien",
  description:
    "Immobilien professionell in Szene gesetzt: Fotografie, 360°-Touren und digitale Vermarktung aus einer Hand.",
};

const features = [
  {
    title: "Immobilienfotografie",
    desc: "Hochwertige Aufnahmen, die Räume im besten Licht zeigen.",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <circle cx="12" cy="13.5" r="3.4" />
        <path d="M8.5 7l1.3-2.2h4.4L19 7" />
      </>
    ),
  },
  {
    title: "360°-Rundgänge",
    desc: "Virtuelle Touren, die Interessenten durch jedes Objekt führen.",
    icon: (
      <>
        <path d="M21 12a9 9 0 1 1-2.6-6.3" />
        <path d="M21 4v4h-4" />
      </>
    ),
  },
  {
    title: "Drohnenaufnahmen",
    desc: "Luftbilder für Lage, Umgebung und das grosse Ganze.",
    icon: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M12 12 5 5M12 12l7-7M12 12l-7 7M12 12l7 7" />
        <circle cx="4.5" cy="4.5" r="1.6" />
        <circle cx="19.5" cy="4.5" r="1.6" />
        <circle cx="4.5" cy="19.5" r="1.6" />
        <circle cx="19.5" cy="19.5" r="1.6" />
      </>
    ),
  },
  {
    title: "Branding & Vermarktung",
    desc: "Exposés, Web und Social, die Objekte sichtbar machen.",
    icon: <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9z" />,
  },
];

export default function LivingPage() {
  return (
    <>
      {/* HERO */}
      <header className="relative flex min-h-[68vh] items-end overflow-hidden px-6 pb-14 pt-32 md:px-12">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url(/Brand_assets/images/heros/immo.jpg)" }}
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
            Aracle Living
          </p>
          <h1 className="mt-3 text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em] [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
            Räume, die wirken.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
            Immobilien professionell in Szene gesetzt: Fotografie, 360°-Touren
            und digitale Vermarktung aus einer Hand.
          </p>
        </div>
      </header>

      {/* INTRO + LEISTUNGEN */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>Was ist Aracle Living</SectionLabel>
          <h2 className="max-w-3xl text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.03em]">
            Immobilien, die im besten Licht erscheinen.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-dim">
            Aracle Living bringt den gestalterischen Anspruch des Studios in den
            Immobilienmarkt. Von der ersten Aufnahme bis zur fertigen
            Vermarktung, mit Auge fürs Detail.
          </p>

          <div className="mt-16 grid gap-x-9 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="max-w-xs">
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
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 md:px-12">
        <div className="mx-auto max-w-[1100px] overflow-hidden rounded-3xl border border-line bg-surface p-10 text-center md:p-16">
          <h2 className="mx-auto max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.03em]">
            Bereit, deine Immobilie zu zeigen?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-dim">
            Erzähl uns vom Objekt, wir kümmern uns um den Rest.
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
