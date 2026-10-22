import Link from "next/link";
import PillarMark from "@/components/alpine/PillarMark";

const pillars = [
  {
    title: "Creative Production",
    lead: "Bilder und Geschichten, die zur Marke passen.",
    items: ["Video & Content", "Design & Branding", "Social Media"],
    href: "/projekte#creative-production",
    mountain: "glaernisch" as const,
  },
  {
    title: "Digital Experiences",
    lead: "Websites und digitale Produkte, schnell und sauber gebaut.",
    items: ["Websites", "Webentwicklung", "Digitale Produkte"],
    href: "/projekte#digital-experiences",
    mountain: "toedi" as const,
  },
  {
    title: "Cloud & Infrastructure",
    lead: "Hosting und Server, die wir selbst betreiben.",
    items: ["Webhosting", "Server-Lösungen", "Wartung & Monitoring"],
    href: "/hosting",
    mountain: "kaerpf" as const,
  },
];

// Leistungen in drei Säulen, jede mit ihrem Glarner Gipfel.
export default function Services() {
  return (
    <section id="leistungen" aria-labelledby="services-title" className="wrap scroll-mt-20 py-[var(--section)]">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="kicker text-aqua">Leistungen</p>
          <h2 id="services-title" className="display mt-4" data-split>
            Built with purpose.
          </h2>
        </div>
        <p className="text-ink/80 md:col-span-4 md:col-start-9">
          Vom ersten Bild bis zum Server, auf dem es läuft. Ein Team, ein
          Ansprechpartner, kurze Wege.
        </p>
      </div>

      <ul className="mt-14 grid border-t border-line md:grid-cols-3">
        {pillars.map((p, i) => (
          <li
            key={p.title}
            data-reveal
            style={{ ["--i" as string]: i }}
            className="border-b border-line md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
          >
            <Link href={p.href} className="group flex h-full flex-col py-8">
              <PillarMark mountain={p.mountain} className="mb-8 text-ink opacity-85 transition-opacity group-hover:opacity-100" />
              <h3 className="text-[clamp(1.5rem,1rem+1.2vw,2.125rem)] font-[620] leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-aqua">
                {p.title}
              </h3>
              <p className="mt-3 text-ink/80">{p.lead}</p>
              <ul className="mt-6 flex flex-col">
                {p.items.map((it) => (
                  <li key={it} className="flex items-center justify-between border-t border-line/70 py-2.5 text-[0.9375rem]">
                    {it}
                  </li>
                ))}
              </ul>
              <span className="link-under mt-6 inline-flex min-h-11 items-center font-medium">
                {p.title === "Cloud & Infrastructure" ? "Zu Aracle Cloud" : "Passende Projekte"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
