import Link from "next/link";
import SectionIndex from "@/components/project/SectionIndex";
import { RULES_UPDATED, closing, rules } from "@/data/zelda-rules";

export const metadata = {
  alternates: { canonical: "/zelda-de/regelwerk" }, openGraph: { images: [{ url: "/og/zelda-de.jpg", width: 1200, height: 630 }] },
  title: { absolute: "Regelwerk · Zelda Community DE" },
  description: "Die Regeln der deutschsprachigen Zelda-Community auf Discord.",
};

// Regelwerk zum Verlinken aus dem Discord: nummeriert, mit Sprungmarken pro Paragraf.
export default function ZeldaRulesPage() {
  return (
    <div className="wrap pb-[var(--section)] pt-28 md:pt-36">
      <nav aria-label="Brotkrumen" className="small text-muted">
        <Link href="/zelda-de" className="transition-colors hover:text-ink">Zelda DE</Link>
        <span aria-hidden className="mx-2">/</span>
        <span>Regelwerk</span>
      </nav>
      <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
        <h1 className="mega md:col-span-8" data-split="load">Regelwerk.</h1>
        <p className="text-ink/85 md:col-span-4">
          Für alle auf dem Discord der Zelda-Community DE. Kurz gesagt: freundlich bleiben, nichts spoilern,
          dem Team vertrauen. <span className="text-muted">Stand {RULES_UPDATED}.</span>
        </p>
      </div>

      <div className="mt-16 grid gap-10 border-t border-line pt-10 md:mt-20 md:grid-cols-12">
        <aside className="hidden md:col-span-3 md:block">
          <div className="sticky top-24">
            <SectionIndex items={rules.map((r, i) => ({ id: r.id, label: `§${i + 1} ${r.title}` }))} />
          </div>
        </aside>

        <div className="md:col-span-8 md:col-start-5">
          {rules.map((r, i) => (
            <section key={r.id} id={r.id} aria-labelledby={`${r.id}-t`} className="scroll-mt-24 [&:not(:first-child)]:mt-14">
              <h2 id={`${r.id}-t`} className="flex items-baseline gap-4">
                <span className="nums text-aqua">§{i + 1}</span>
                <span className="head">{r.title}</span>
              </h2>
              <ol className="mt-5 border-b border-line">
                {r.items.map((it, j) => (
                  <li key={j} id={`${r.id}-${j + 1}`} className="grid scroll-mt-24 grid-cols-[3.25rem_1fr] gap-x-3 border-t border-line py-4">
                    <a href={`#${r.id}-${j + 1}`} className="nums small pt-0.5 text-muted transition-colors hover:text-aqua">
                      {i + 1}.{j + 1}
                    </a>
                    <p className="text-ink/90">{it}</p>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          <div className="mt-14 rounded-[var(--radius)] border border-line p-6">
            {closing.map((c) => (
              <p key={c} className="text-ink/80 [&+&]:mt-3">{c}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
