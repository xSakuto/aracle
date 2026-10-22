import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import AlpineLines from "@/components/alpine/AlpineLines";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Aracle Cloud · Hosting aus der Schweiz",
  description:
    "Webhosting und Server-Lösungen auf eigener Hardware in Ennenda, Glarus. Betrieben von Aracle, mit Updates, Backups und Monitoring.",
};

const offers = [
  { name: "Webhosting", desc: "Für Websites und Web-Apps, die schnell und zuverlässig laufen sollen. Wir richten ein, du kümmerst dich um den Inhalt." },
  { name: "Server-Lösungen", desc: "Eigene virtuelle Server oder Container für Projekte, die mehr als eine Website brauchen." },
  { name: "Game- & Community-Server", desc: "Minecraft, Discord-Bots und Community-Dienste, so wie wir sie für unsere eigenen Projekte betreiben." },
  { name: "Wartung & Monitoring", desc: "Updates, Backups und Überwachung. Wenn etwas klemmt, merken wir es, bevor du es tust." },
];

const specs: [string, string][] = [
  ["Standort", "Ennenda, Kanton Glarus, Schweiz"],
  ["Hardware", "Eigene Server, keine gemieteten Ressourcen"],
  ["Plattform", "Proxmox, TrueNAS, Docker"],
  ["Netzwerk", "UniFi"],
  ["Betrieb", "Updates, Backups und Monitoring inklusive"],
  ["Seit", "2022 als Homelab, heute produktiv für alle Aracle-Projekte"],
];

export default function HostingPage() {
  return (
    <>
      <PageIntro
        kicker="Cloud & Infrastructure"
        title="Own hardware. Swiss hosting."
        lead="Aracle Cloud ist die Infrastruktur, auf der unsere eigenen Projekte laufen. Dieselbe Umgebung bieten wir auch für Websites, Web-Apps und Community-Server an."
        image={{
          src: "/Brand_assets/images/heros/cloudhosting.jpg",
          alt: "Serverraum mit Racks und Arbeitsplatz",
          width: 1600,
          height: 1067,
        }}
      >
        <Link href="/kontakt?typ=hosting" className="btn">Hosting anfragen</Link>
      </PageIntro>

      <section aria-labelledby="offer-title" className="wrap py-[var(--section)]">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="kicker text-aqua">Angebot</p>
            <h2 id="offer-title" className="display mt-4" data-split>What we run.</h2>
          </div>
          <p className="text-ink/80 md:col-span-4 md:col-start-9">
            Kein Massenhosting, sondern persönlich betreute Umgebungen. Klein
            genug, dass wir jedes Projekt kennen.
          </p>
        </div>
        <dl className="mt-14 grid border-t border-line md:grid-cols-2">
          {offers.map((o, i) => (
            <div key={o.name} data-reveal style={{ ["--i" as string]: i % 2 }} className="border-b border-line py-8 md:odd:border-r md:odd:pr-10 md:even:pl-10">
              <dt className="text-[clamp(1.375rem,1rem+1vw,1.875rem)] font-[620] tracking-[-0.03em]">{o.name}</dt>
              <dd className="mt-3 max-w-[32rem] text-ink/80">{o.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <AlpineLines height={120} layers={3} seed={37} draw="scroll" className="opacity-60" />

      <section aria-labelledby="spec-title" className="wrap grid gap-10 py-[var(--section)] md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="kicker text-aqua">Spezifikation</p>
          <h2 id="spec-title" className="head mt-4">The setup.</h2>
          <p className="mt-4 text-ink/80">
            Kapazitäten und Preise klären wir pro Projekt. Schreib uns, was
            laufen soll, dann sagen wir dir ehrlich, ob es passt.
          </p>
        </div>
        <dl className="border-t border-line md:col-span-7 md:col-start-6">
          {specs.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-4 sm:grid-cols-[11rem_1fr]">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBand
        title="Projekt hosten?"
        text="Sag uns, was laufen soll und wie viele Leute es nutzen. Wir schlagen dir eine passende Umgebung vor."
        action="Hosting anfragen"
        href="/kontakt?typ=hosting"
      />
    </>
  );
}
