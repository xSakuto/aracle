import Contours from "@/components/alpine/Contours";
import InquiryForm from "@/components/InquiryForm";

export const metadata = {
  alternates: { canonical: "/hosting" }, openGraph: { images: [{ url: "/og/cloud.jpg", width: 1200, height: 630 }] },
  title: "Aracle Cloud · Hosting aus Glarus",
  description:
    "Webhosting, Game-Server und Server-Lösungen auf eigener Hardware im Kanton Glarus. Persönlich betreut von Aracle.",
};

const offers = [
  { name: "Webhosting", text: "Websites und Web-Apps, schnell und zuverlässig. Wir richten ein, du kümmerst dich um den Inhalt." },
  { name: "Game-Server", text: "Minecraft und andere Spiele, so wie wir sie für AracleSMP und unsere Communities betreiben." },
  { name: "Server & Wartung", text: "Eigene virtuelle Server, Updates, Backups und Monitoring. Wenn etwas klemmt, merken wir es zuerst." },
];

const specs: [string, string][] = [
  ["Standort", "Kanton Glarus"],
  ["Hardware", "Eigene Server"],
  ["Plattform", "Proxmox, TrueNAS, Docker"],
  ["Netzwerk", "UniFi"],
];

// Aracle Cloud als eigene Landing Page: Signalgrün statt Gletscherblau, sonst Aracle.
export default function HostingPage() {
  return (
    <div className="theme-cloud">
      <header className="relative flex min-h-[88svh] flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 text-aqua">
          <div className="absolute left-[64%] top-[50%] w-[max(95%,64rem)] -translate-x-1/2 -translate-y-1/2 opacity-80">
            <Contours label={false} />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_22%_62%,rgb(11_17_21/0.94),rgb(11_17_21/0.35)_70%,transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <div className="wrap relative mt-auto pb-16 pt-32 md:pb-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud/aracle-cloud-logo.png" alt="Aracle Cloud" width={640} height={371} className="mb-8 h-14 w-auto bg-transparent md:h-16" data-rise />
          <p className="small inline-flex items-center gap-2.5 text-ink/85" data-rise>
            <span aria-hidden className="led" />
            Aracle Cloud · Eigene Server im Kanton Glarus
          </p>
          <h1 className="mega mt-6 max-w-[12ch]" data-split="load">Own hardware. Swiss hosting.</h1>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="lead text-ink/85 md:col-span-6">
              Die Infrastruktur, auf der alle Aracle-Projekte laufen. Dieselbe Umgebung gibt es
              für deine Website, deinen Game-Server oder dein Projekt.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end">
              <a href="#anfrage" className="btn">Hosting anfragen</a>
              <a href="#panel" className="btn-quiet">Game-Server</a>
            </div>
          </div>
        </div>
      </header>

      <section aria-label="Angebot" className="wrap">
        <ul className="grid border-y border-line md:grid-cols-3">
          {offers.map((o, i) => (
            <li key={o.name} data-reveal style={{ ["--i" as string]: i }} className="border-b border-line py-8 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <h2 className="text-[clamp(1.5rem,1rem+1vw,2rem)] font-[620] leading-[1.05] tracking-[-0.03em]">{o.name}</h2>
              <p className="mt-3 text-ink/75">{o.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="panel" aria-labelledby="panel-title" className="wrap scroll-mt-24 py-[var(--section)]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="kicker text-aqua">In Vorbereitung</p>
            <h2 id="panel-title" className="display mt-4" data-split>Your server, your panel.</h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:pt-4">
            <p className="text-ink/85">
              Game-Server sollst du bald selbst bestellen und verwalten können: starten, stoppen,
              Dateien und Konsole über ein eigenes Panel, Abrechnung gleich dabei.
            </p>
            <dl className="mt-8 border-b border-line">
              <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line py-3 text-[0.9375rem]">
                <dt className="text-muted">Panel</dt>
                <dd>Pterodactyl</dd>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line py-3 text-[0.9375rem]">
                <dt className="text-muted">Abrechnung</dt>
                <dd>Paymenter</dd>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line py-3 text-[0.9375rem]">
                <dt className="text-muted">Bis dahin</dt>
                <dd>Persönlich per Anfrage</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="anfrage" aria-labelledby="anfrage-title" className="scroll-mt-20 border-t border-line">
        <div className="wrap grid gap-12 py-[var(--section)] md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="anfrage-title" className="head">Tell us what should run.</h2>
            <p className="mt-4 text-ink/80">
              Kapazität und Preis klären wir pro Projekt. Du bekommst eine ehrliche Einschätzung,
              ob es bei uns passt.
            </p>
            <dl className="mt-10 border-b border-line">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-line py-3 text-[0.9375rem]">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <InquiryForm defaultType="hosting" compact placeholder="Was soll laufen, wie viele Leute nutzen es, und ab wann?" />
          </div>
        </div>
      </section>
    </div>
  );
}
