import Link from "next/link";
import PillarMark from "@/components/alpine/PillarMark";
import { getProject } from "@/data/projects";
import { MOUNTAINS } from "@/lib/mountains";

// Was Aracle ausmacht, als Profil von oben nach unten: eigene Marken und Produkte,
// der Content dazu, und die Infrastruktur, auf der alles läuft. Jede Ebene steht
// auf ihrem Glarner Gipfel und zeigt die echten Projekte, darunter was buchbar ist.
const layers = [
  {
    title: "Brands & Products",
    text: "Wir entwickeln eigene Marken und Produkte, von Streetwear bis zum Game.",
    projects: ["highside", "beer-game", "rexusmods"],
    offer: "Branding, Websites und digitale Produkte",
    cta: "Projekt anfragen",
    ctaHref: "/kontakt",
    mountain: MOUNTAINS.toedi,
  },
  {
    title: "Content",
    text: "Wir produzieren den Content dazu, für die eigenen Kanäle und Communities.",
    projects: ["swizzly", "sakuto"],
    offer: "Video, Content und Social Media",
    cta: "Projekt anfragen",
    ctaHref: "/kontakt",
    mountain: MOUNTAINS.glaernisch,
  },
  {
    title: "Infrastructure",
    text: "Und wir betreiben die Technik dahinter, auf eigener Hardware im Glarnerland.",
    projects: ["aracle-cloud-hosting", "araclesmp"],
    offer: "Webhosting, Server und Monitoring",
    cta: "Zu Aracle Cloud",
    ctaHref: "/hosting",
    mountain: MOUNTAINS.kaerpf,
  },
];

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
          Aracle entwickelt eigene Produkte und Marken, produziert Content und
          betreibt die technische Infrastruktur dahinter. Was wir dabei lernen,
          bauen wir auch für andere.
        </p>
      </div>

      <ol className="mt-14 border-b border-line">
        {layers.map((l, i) => (
          <li
            key={l.title}
            data-reveal
            style={{ ["--i" as string]: i }}
            className="grid gap-x-8 gap-y-6 border-t border-line py-10 md:grid-cols-12 md:py-14"
          >
            <PillarMark mountain={l.mountain} className="max-w-[16rem] text-ink opacity-85 md:col-span-3" />

            <div className="md:col-span-5">
              <h3 className="text-[clamp(1.75rem,1rem+1.8vw,2.75rem)] font-[620] leading-[1] tracking-[-0.035em]">
                {l.title}
              </h3>
              <p className="mt-4 max-w-[34ch] text-ink/80">{l.text}</p>
            </div>

            <div className="md:col-span-4">
              <p className="small text-muted">Eigene Projekte</p>
              <ul className="mt-3 border-b border-line/70">
                {l.projects.map((slug) => {
                  const p = getProject(slug);
                  if (!p) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/projekte/${slug}`}
                        className="seg-host relative flex min-h-11 items-center justify-between gap-4 border-t border-line/70 transition-colors hover:text-aqua"
                      >
                        <span aria-hidden className="seg seg-top" />
                        {p.title}
                        <span className="small shrink-0 text-muted">{p.status === "Aktiv" ? p.category : p.status}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="small mt-5 text-muted">Für dich: {l.offer}.</p>
              <Link href={l.ctaHref} className="link-under small inline-flex min-h-10 items-center font-medium">
                {l.cta}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
