import Link from "next/link";
import CopyValue from "@/components/brand/CopyValue";
import ApplyForm from "@/components/smp/ApplyForm";
import PixelGround from "@/components/smp/PixelGround";

export const metadata = {
  title: "AracleSMP · Vanilla+ Minecraft-Server",
  description: "AracleSMP ist ein Langzeit-Server für Freunde und Mitglieder. Vanilla+, Minecraft 1.21.10. Bewirb dich, um mitzuspielen.",
};

const facts = [
  { title: "Vanilla+", text: "Minecraft nah am Original, mit ein paar Addons, die das Spiel besser machen, nicht anders." },
  { title: "Modpack", text: "All the Clients auf Modrinth: schneller, aber vanilla-kompatibel.", href: "/projekte/all-the-clients" },
  { title: "Langzeit", text: "Ein Server, der bleibt. Betrieben auf eigener Hardware von Aracle Cloud.", href: "/hosting" },
];

const steps = [
  ["Bewerben", "Füll das Formular unten aus. Dauert eine Minute."],
  ["Kennenlernen", "Wir melden uns per E-Mail oder Discord."],
  ["Mitspielen", "Du wirst freigeschaltet und verbindest dich mit play.aracle.ch."],
];

// AracleSMP: eigene Landing Page im Minecraft-Stil, mit Bewerbung statt offener Tür.
export default function SmpPage() {
  return (
    <div className="theme-smp">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" precedence="default" />

      <header className="relative overflow-hidden bg-[linear-gradient(to_bottom,#0b1115,#10202a_70%,#16303a)]">
        <div aria-hidden className="mc-stars pointer-events-none absolute inset-0" />
        <div className="wrap relative pb-14 pt-32 md:pb-20 md:pt-40">
          <p className="mc-label text-aqua" data-rise>Vanilla+ · Minecraft 1.21.10</p>
          <h1 className="mc-title mt-4 text-[clamp(3rem,1rem+8vw,8.5rem)] leading-[0.95]" data-rise style={{ ["--i" as string]: 1 }}>
            AracleSMP
          </h1>
          <p className="lead mt-6 max-w-[34ch] text-ink/85" data-rise style={{ ["--i" as string]: 2 }}>
            Ein Langzeit-Server für Freunde und Mitglieder. Wer mitspielen will, bewirbt sich.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" data-rise style={{ ["--i" as string]: 3 }}>
            <div className="mc-slot flex items-center gap-4 px-4 py-2">
              <span className="mc-label !mb-0 text-muted">Server</span>
              <CopyValue value="play.aracle.ch" label="Server-Adresse" />
            </div>
            <a href="#bewerben" className="mc-btn">Jetzt bewerben</a>
          </div>
        </div>
        <PixelGround className="relative block h-[clamp(48px,7vw,96px)] w-full" />
      </header>

      <section aria-label="Der Server" className="bg-[#2a1d12]/30">
        <ul className="wrap grid gap-4 py-[calc(var(--section)*0.7)] md:grid-cols-3">
          {facts.map((f, i) => (
            <li key={f.title} data-reveal style={{ ["--i" as string]: i }} className="mc-panel p-6">
              <h2 className="mc-title text-[1.375rem] text-aqua">{f.title}</h2>
              <p className="mt-3 text-ink/80">{f.text}</p>
              {f.href && (
                <Link href={f.href} className="link-under small mt-4 inline-flex min-h-10 items-center font-medium">Mehr dazu</Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="bewerben" aria-labelledby="bewerben-title" className="scroll-mt-20 border-t border-line">
        <div className="wrap grid gap-12 py-[var(--section)] md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="bewerben-title" className="mc-title text-[clamp(2rem,1rem+2.6vw,3.25rem)] leading-[1]">Join the server.</h2>
            <ol className="mt-8 border-b border-line">
              {steps.map(([k, v], i) => (
                <li key={k} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-line py-4">
                  <span className="mc-title text-aqua">{i + 1}</span>
                  <span>
                    <span className="block font-medium">{k}</span>
                    <span className="small block text-ink/70">{v}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ApplyForm />
          </div>
        </div>
      </section>
    </div>
  );
}
