import Link from "next/link";
import Hud from "@/components/visuals/Hud";
import { getProject } from "@/data/projects";

export const metadata = {
  title: "RexusMods · Mods für GTA V und Flugsimulatoren",
  description: "RexusMods ist wieder aktiv: 3D-Modelling für GTA V und neu Add-ons für Flugsimulatoren. Von Joel Nef und Tim Mockweiss.",
};

const tracks = [
  {
    name: "GTA V",
    state: "Seit 2021",
    items: [
      ["MLO-Maps", "Begehbare Innenräume für die Spielwelt"],
      ["Fahrzeuglackierungen", "Eigene Designs für Fahrzeuge"],
      ["Texturen", "Oberflächen und Details der Modelle"],
    ],
  },
  {
    name: "Flight Simulator",
    state: "Neu, in Arbeit",
    items: [["Add-ons", "Der neue Bereich von RexusMods. Details folgen, sobald es etwas zu zeigen gibt."]],
  },
];

// RexusMods als eigene Landing Page: Rot, mit Cockpit-HUD als Bühne.
export default function RexusModsPage() {
  const p = getProject("rexusmods");
  return (
    <div className="theme-rexus">
      <header className="relative flex min-h-[92svh] flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 text-aqua">
          <Hud className="absolute left-1/2 top-[46%] w-[max(100%,64rem)] -translate-x-1/2 -translate-y-1/2 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_22%_70%,rgb(11_17_21/0.95),transparent_75%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <div className="wrap relative mt-auto pb-16 pt-32 md:pb-24">
          <p className="kicker text-aqua" data-rise>RexusMods · Wieder aktiv</p>
          <h1 className="mega mt-5 max-w-[11ch]" data-split="load">Mods for GTA V. Now taking flight.</h1>
          <p className="lead mt-8 max-w-[36ch] text-ink/85" data-rise style={{ ["--i" as string]: 2 }}>
            Angefangen mit 3D-Modelling für GTA V, jetzt kommen Add-ons für Flugsimulatoren dazu.
          </p>
        </div>
      </header>

      <section aria-label="Bereiche" className="wrap pb-[var(--section)]">
        <div className="grid gap-x-8 gap-y-14 border-t border-line pt-10 md:grid-cols-2">
          {tracks.map((t) => (
            <div key={t.name}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="head">{t.name}</h2>
                <span className="small text-aqua">{t.state}</span>
              </div>
              <ul className="mt-6 border-b border-line">
                {t.items.map(([k, v]) => (
                  <li key={k} className="grid gap-x-6 gap-y-1 border-t border-line py-4 sm:grid-cols-[11rem_1fr]">
                    <span className="font-medium">{k}</span>
                    <span className="text-ink/70">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
          <a href="mailto:info@aracle.ch?subject=RexusMods" className="btn self-start md:self-auto">Schreib uns</a>
        </div>
      </section>
    </div>
  );
}
