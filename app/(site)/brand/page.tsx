import Link from "next/link";
import PillarMark from "@/components/alpine/PillarMark";
import Ridge from "@/components/alpine/Ridge";
import CopyValue from "@/components/brand/CopyValue";
import EaseDemo from "@/components/brand/EaseDemo";
import SectionIndex from "@/components/project/SectionIndex";
import SwissFlag from "@/components/swiss/SwissFlag";
import { GLAERNISCH } from "@/data/panorama/glaernisch";
import { MOUNTAINS } from "@/lib/mountains";

export const metadata = {
  alternates: { canonical: "/brand" },
  title: "Brand Guidelines",
  description: "Wie Aracle aussieht, klingt und sich bewegt: Logo, Farben, Typografie, Designsprache und Motion.",
};

// Die Brand-Seite dokumentiert, was es gibt. Alle Werte stammen aus app/globals.css
// und den Dateien in public/Brand_assets. Nichts hier ist erfunden oder nur geplant.

const sections = [
  { id: "identitaet", label: "Identität" },
  { id: "logo", label: "Logo" },
  { id: "farben", label: "Farben" },
  { id: "typografie", label: "Typografie" },
  { id: "designsprache", label: "Designsprache" },
  { id: "motion", label: "Motion" },
  { id: "downloads", label: "Downloads" },
];


type Swatch = { name: string; hex: string; token?: string; use: string; ink?: "dark" | "light" };

const colorGroups: { title: string; text: string; swatches: Swatch[] }[] = [
  {
    title: "Grundfarben",
    text: "Nachtschiefer trägt jede Seite. Gletscherblau vom Klöntalersee ist der einzige laute Ton.",
    swatches: [
      { name: "Nachtschiefer", hex: "#0B1115", token: "--color-bg", use: "Hintergrund jeder Seite" },
      { name: "Gletscherblau", hex: "#8FD6D3", token: "--color-aqua", use: "Hauptaktion, aktive Zustände, Kicker", ink: "dark" },
      { name: "Firn", hex: "#EEF3F3", token: "--color-ink", use: "Text und Linienzeichnungen", ink: "dark" },
    ],
  },
  {
    title: "Akzente",
    text: "Sparsam. Alpenglühen markiert, was nicht im Normalbetrieb ist. Rot gehört nur dem Kreuz.",
    swatches: [
      { name: "Alpenglühen", hex: "#F2A98F", token: "--color-glow", use: "Status ausser «Aktiv», Highside", ink: "dark" },
      { name: "Schweizer Rot", hex: "#DA291C", token: "--color-swiss", use: "Nur das Schweizer Kreuz" },
      { name: "Hinweis", hex: "#FF8A7A", token: "--color-danger", use: "Fehler in Formularen", ink: "dark" },
    ],
  },
  {
    title: "Flächen und Linien",
    text: "Stufen desselben Schiefers. Tiefe entsteht über Helligkeit, nicht über Schatten.",
    swatches: [
      { name: "Feld", hex: "#0F171B", token: "--color-field", use: "Eingabefelder, tiefe Flächen" },
      { name: "Fläche", hex: "#121A1F", token: "--color-surface", use: "Kacheln, Platzhalter" },
      { name: "Erhöht", hex: "#1B252B", token: "--color-raised", use: "Felder, erhöhte Flächen" },
      { name: "Linie", hex: "#26323A", token: "--color-line", use: "Haarlinien, Raster" },
      { name: "Gedämpft", hex: "#9AA8AD", token: "--color-muted", use: "Sekundärtext, Beschriftungen", ink: "dark" },
      { name: "Akzent-Tinte", hex: "#0B1418", token: "--color-accent-ink", use: "Text auf Gletscherblau" },
    ],
  },
  {
    title: "Im Logo",
    text: "Das Zeichen hat eigene Farbvarianten. Sie gehören zum Logo und nicht zur Website-Palette.",
    swatches: [
      { name: "Logo-Blau", hex: "#00ACEC", use: "Farbvariante des Zeichens", ink: "dark" },
      { name: "Logo-Rot", hex: "#ED1C24", use: "Farbvariante des Zeichens" },
      { name: "Logo-Grün", hex: "#00A350", use: "Farbvariante des Zeichens" },
    ],
  },
];

const typeScale = [
  { name: "Mega", cls: "mega", size: "48 bis 160 px", lh: "0.9", track: "-0.04em", sample: "Let’s build something." },
  { name: "Display", cls: "display", size: "40 bis 112 px", lh: "0.95", track: "-0.035em", sample: "Selected work." },
  { name: "Head", cls: "head", size: "32 bis 56 px", lh: "1", track: "-0.03em", sample: "Built with purpose." },
  { name: "Lead", cls: "lead", size: "19 bis 24 px", lh: "1.33", track: "-0.015em", sample: "Wir melden uns mit einer ehrlichen Einschätzung." },
  { name: "Text", cls: "", size: "17 px", lh: "1.5", track: "-0.005em", sample: "Wir filmen, gestalten, entwickeln und betreiben unsere eigenen Server." },
  { name: "Klein", cls: "small", size: "14 px", lh: "1.43", track: "-0.01em", sample: "Tödi vom Schilt aus, 30 km entfernt" },
  { name: "Kicker", cls: "kicker", size: "13 px, Versalien", lh: "1.5", track: "0.06em", sample: "Create. Connect. Inspire." },
];

const L = "/Brand_assets/logo";
const D = "/Brand_assets/logo/download";

// Neues Logo (Oktober 2026): das A als Zeichen, dazu Schriftzug und Leitsatz.
const lockups = [
  { src: `${L}/aracle-horizontal-white.png`, title: "Horizontal", note: "Für dunklen Grund", w: 1200, h: 279, bg: "dark" as const },
  { src: `${L}/aracle-horizontal-black.png`, title: "Horizontal", note: "Für hellen Grund", w: 1200, h: 279, bg: "light" as const },
  { src: `${L}/aracle-vertical-white.png`, title: "Vertikal", note: "Für dunklen Grund", w: 831, h: 615, bg: "dark" as const },
  { src: `${L}/aracle-vertical-black.png`, title: "Vertikal", note: "Für hellen Grund", w: 831, h: 615, bg: "light" as const },
];

const markColors = [
  { src: `${L}/aracle-mark-white.png`, title: "Weiss", hex: "Standard auf dunklem Grund" },
  { src: `${L}/aracle-mark-aqua.png`, title: "Blau", hex: "#00ACEC" },
  { src: `${L}/aracle-mark-red.png`, title: "Rot", hex: "#ED1C24" },
  { src: `${L}/aracle-mark-green.png`, title: "Grün", hex: "#00A350" },
];

const downloads = [
  { file: `${D}/aracle-a-white.png`, preview: `${L}/aracle-mark-white.png`, title: "Zeichen, weiss", note: "Für dunklen Grund", size: "2614 × 2614 px", bg: "dark" as const },
  { file: `${D}/aracle-a-black.png`, preview: `${L}/aracle-mark-black.png`, title: "Zeichen, schwarz", note: "Für hellen Grund", size: "2614 × 2614 px", bg: "light" as const },
  { file: `${D}/aracle-a-aqua.png`, preview: `${L}/aracle-mark-aqua.png`, title: "Zeichen, blau", note: "Farbvariante", size: "2614 × 2614 px", bg: "dark" as const },
  { file: `${D}/aracle-a-red.png`, preview: `${L}/aracle-mark-red.png`, title: "Zeichen, rot", note: "Farbvariante", size: "2614 × 2614 px", bg: "dark" as const },
  { file: `${D}/aracle-a-green.png`, preview: `${L}/aracle-mark-green.png`, title: "Zeichen, grün", note: "Farbvariante", size: "2614 × 2614 px", bg: "dark" as const },
  { file: `${D}/aracle-horizontal-white.png`, preview: `${L}/aracle-horizontal-white.png`, title: "Horizontal, weiss", note: "Für dunklen Grund", size: "1593 × 370 px", bg: "dark" as const },
  { file: `${D}/aracle-horizontal-black.png`, preview: `${L}/aracle-horizontal-black.png`, title: "Horizontal, schwarz", note: "Für hellen Grund", size: "1593 × 370 px", bg: "light" as const },
  { file: `${D}/aracle-vertical-white.png`, preview: `${L}/aracle-vertical-white.png`, title: "Vertikal, weiss", note: "Für dunklen Grund", size: "831 × 615 px", bg: "dark" as const },
  { file: `${D}/aracle-vertical-black.png`, preview: `${L}/aracle-vertical-black.png`, title: "Vertikal, schwarz", note: "Für hellen Grund", size: "1000 × 1000 px", bg: "light" as const },
];


const misuse = [
  { label: "So", ok: true, style: {} },
  { label: "Nicht verzerren", ok: false, style: { transform: "scaleX(1.35)" } },
  { label: "Nicht drehen", ok: false, style: { transform: "rotate(-8deg)" } },
  { label: "Keine Effekte", ok: false, style: { filter: "drop-shadow(0 0 10px #8fd6d3) drop-shadow(0 0 2px #8fd6d3)" } },
  { label: "Nicht auf hellem Grund", ok: false, style: {}, light: true },
  { label: "Nicht umfärben", ok: false, style: { filter: "sepia(1) saturate(4) hue-rotate(-30deg)" } },
];

const values = [
  { title: "Präzision", text: "Bis ins Detail. Raster, Abstände und Höhenangaben stimmen, auch dort, wo es niemand nachmisst." },
  { title: "Ehrlichkeit", text: "Nur echte Angaben. Keine erfundenen Kunden, Zahlen oder Erfolge, und ein Konzept heisst Konzept." },
  { title: "Selbst gemacht", text: "Was wir für andere bauen, setzen wir zuerst bei uns um. Bis zur eigenen Hardware." },
  { title: "Herkunft", text: "Aus dem Glarnerland. Die Berge auf der Website sind echte Gipfel, aus Höhendaten berechnet." },
];

const tone = [
  { yes: "Headlines auf Englisch, kurz, mit Punkt am Ende.", no: "Headlines in Mundart oder als halbe Sätze ohne Schluss." },
  { yes: "Fliesstext auf Hochdeutsch, in der Du-Form, mit «ss».", no: "Schweizerdeutscher Dialekt oder steifes Sie im Fliesstext." },
  { yes: "Konkret sagen, was da ist: «In Entwicklung», «Konzept».", no: "Leere Versprechen, Superlative, erfundene Zahlen." },
  { yes: "Kommas und Punkte statt Gedankenstrichen.", no: "Gedankenstriche als Trenner im Satz." },
];

function Head({ id, title, lead }: { id: string; title: string; lead?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-9">
      <h2 id={`${id}-title`} className="head md:col-span-5">{title}</h2>
      {lead && <p className="text-ink/80 md:col-span-4 md:pt-2">{lead}</p>}
    </div>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="small mt-16 border-t border-line pt-5 text-muted">{children}</h3>;
}

export default function BrandPage() {
  return (
    <>
      <header className="relative overflow-hidden">
        <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0" />
        <div className="wrap relative pt-28 md:pt-36">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="kicker text-aqua" data-rise>Brand</p>
              <h1 className="mega mt-5" data-split="load">Brand guidelines.</h1>
            </div>
            <div className="md:col-span-4" data-rise style={{ ["--i" as string]: 2 }}>
              <p className="text-ink/85">
                Wie Aracle aussieht, klingt und sich bewegt. Für alle, die mit der Marke
                arbeiten, und für alle, die wissen wollen, warum die Seite so aussieht.
              </p>
              <p className="small mt-4 text-muted">Stand Oktober 2026</p>
            </div>
          </div>
        </div>
        <div aria-hidden className="relative mt-14 text-ink opacity-60 md:mt-20">
          <Ridge data={GLAERNISCH} depths={[2, 1]} yMax={260} className="w-full" />
        </div>
      </header>

      <div className="wrap grid gap-10 border-t border-line pb-[var(--section)] pt-14 md:grid-cols-12 md:pt-20">
        <aside className="hidden md:col-span-3 md:block">
          <div className="sticky top-24">
            <SectionIndex items={sections} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-[var(--section)] md:col-span-9">
          {/* ---------- Identität ---------- */}
          <section id="identitaet" aria-labelledby="identitaet-title" className="scroll-mt-24">
            <Head
              id="identitaet"
              title="Swiss precision meets creative technology."
              lead="Aracle ist ein Creative & Technology Studio aus Glarus. Wir entwickeln eigene Produkte und Marken, produzieren Content und betreiben die Infrastruktur dahinter."
            />

            <div className="mt-12 grid gap-8 md:grid-cols-9">
              <p className="lead text-ink/90 md:col-span-5">
                Angefangen hat es 2017 mit einem YouTube-Kanal und einem Minecraft-Server.
                Seit Mai 2023 heisst das Ganze Aracle. Der Anspruch ist geblieben:
                kreativ denken, technisch sauber umsetzen.
              </p>
              <div className="md:col-span-4">
                <p className="small text-muted">Leitsatz</p>
                <p className="mt-2 text-[clamp(1.5rem,1rem+1vw,2rem)] font-[620] leading-[1.05] tracking-[-0.03em]">Create. Connect. Inspire.</p>
              </div>
            </div>

            <Sub>Werte</Sub>
            <ul className="border-b border-line">
              {values.map((v) => (
                <li key={v.title} className="grid gap-x-8 gap-y-1 border-t border-line py-5 first:border-t-0 sm:grid-cols-9">
                  <span className="font-medium sm:col-span-3">{v.title}</span>
                  <span className="text-ink/75 sm:col-span-6">{v.text}</span>
                </li>
              ))}
            </ul>

            <Sub>Tonalität</Sub>
            <div className="grid gap-x-8 sm:grid-cols-2">
              <div>
                <p className="small mt-4 font-medium text-aqua">So klingen wir</p>
                <ul className="mt-2 border-b border-line">
                  {tone.map((t) => <li key={t.yes} className="border-t border-line py-3 text-[0.9375rem]">{t.yes}</li>)}
                </ul>
              </div>
              <div>
                <p className="small mt-4 font-medium text-danger">So nicht</p>
                <ul className="mt-2 border-b border-line">
                  {tone.map((t) => <li key={t.no} className="border-t border-line py-3 text-[0.9375rem] text-ink/70">{t.no}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* ---------- Logo ---------- */}
          <section id="logo" aria-labelledby="logo-title" className="scroll-mt-24">
            <Head id="logo" title="Logo." lead="Das A ist das Zeichen von Aracle: zwei Linien, die sich zu einem Gipfel treffen. Es steht allein oder zusammen mit Schriftzug und Leitsatz." />

            <div className="mt-12 grid gap-4 md:grid-cols-9">
              <figure className="md:col-span-5">
                <div className="tile grid min-h-[20rem] place-items-center p-10 md:min-h-[24rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${L}/aracle-mark-white.png`} alt="Aracle Zeichen" width={512} height={413} className="h-auto w-full max-w-[14rem] bg-transparent" />
                </div>
                <figcaption className="small mt-2 text-muted">Zeichen. In der Navigation, als Favicon und überall, wo wenig Platz ist.</figcaption>
              </figure>
              <figure className="md:col-span-4">
                <div className="grid min-h-[20rem] place-items-center rounded-[var(--radius)] bg-ink p-10 md:min-h-[24rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${L}/aracle-mark-black.png`} alt="Aracle Zeichen schwarz" width={512} height={413} className="h-auto w-full max-w-[10rem] bg-transparent" />
                </div>
                <figcaption className="small mt-2 text-muted">Auf hellem Grund in Schwarz.</figcaption>
              </figure>
            </div>

            <Sub>Mit Schriftzug</Sub>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {lockups.map((f) => (
                <li key={f.src}>
                  <div className={`grid h-44 place-items-center rounded-[var(--radius)] px-8 ${f.bg === "light" ? "bg-ink" : "bg-surface"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.src} alt={`Aracle ${f.title}, ${f.note}`} width={f.w} height={f.h} loading="lazy" className={`h-auto bg-transparent ${f.title === "Horizontal" ? "w-full max-w-[18rem]" : "max-h-32 w-auto"}`} />
                  </div>
                  <p className="small mt-2 flex justify-between gap-4">
                    <span>{f.title}</span>
                    <span className="text-muted">{f.note}</span>
                  </p>
                </li>
              ))}
            </ul>

            <Sub>Farbvarianten des Zeichens</Sub>
            <p className="mt-3 max-w-[60ch] text-[0.9375rem] text-ink/75">
              Die linke Flanke des A kann eine Farbe tragen. Standard ist Weiss mit grauem Verlauf.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {markColors.map((m) => (
                <li key={m.src}>
                  <div className="tile grid h-36 place-items-center p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.src} alt={`Aracle Zeichen ${m.title}`} width={512} height={413} loading="lazy" className="h-20 w-auto bg-transparent" />
                  </div>
                  <p className="small mt-2 flex justify-between gap-3">
                    <span>{m.title}</span>
                    <span className="nums text-muted">{m.hex}</span>
                  </p>
                </li>
              ))}
            </ul>

            <Sub>Schutzzone und Mindestgrösse</Sub>
            <div className="mt-6 grid gap-8 md:grid-cols-9 md:items-center">
              <div className="tile grid place-items-center p-10 md:col-span-5">
                <div className="relative">
                  <div className="clearzone p-[1.5rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${L}/aracle-horizontal-white.png`} alt="" width={1200} height={279} className="h-16 w-auto bg-transparent outline outline-1 outline-line" />
                  </div>
                  <span aria-hidden className="small nums absolute -top-6 left-1/2 -translate-x-1/2 text-aqua">x</span>
                  <span aria-hidden className="small nums absolute -left-5 top-1/2 -translate-y-1/2 text-aqua">x</span>
                </div>
              </div>
              <ul className="border-b border-line md:col-span-4">
                <li className="border-t border-line py-4">
                  <p className="font-medium">Schutzzone x</p>
                  <p className="small mt-1 text-ink/75">Ein Viertel der Logohöhe, rundum frei von Text, Kanten und Bildmotiven.</p>
                </li>
                <li className="border-t border-line py-4">
                  <p className="font-medium">Zeichen ab 24 px, Schriftzug ab 32 px Höhe</p>
                  <p className="small mt-1 text-ink/75">Kleiner wird der Leitsatz unter dem Schriftzug unlesbar. Dann nur das Zeichen.</p>
                </li>
              </ul>
            </div>

            <Sub>Richtig und falsch</Sub>
            <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {misuse.map((m) => (
                <li key={m.label}>
                  <div className={`grid h-32 place-items-center overflow-hidden rounded-[var(--radius)] px-6 ${m.light ? "bg-ink" : "bg-surface"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${L}/aracle-horizontal-white.png`} alt="" width={1200} height={279} loading="lazy" className="h-auto w-full max-w-[11rem] bg-transparent" style={m.style} />
                  </div>
                  <p className={`small mt-2 font-medium ${m.ok ? "text-aqua" : "text-danger"}`}>
                    <span aria-hidden className="mr-1.5">{m.ok ? "✓" : "✕"}</span>
                    {m.label}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- Farben ---------- */}
          <section id="farben" aria-labelledby="farben-title" className="scroll-mt-24">
            <Head id="farben" title="Colors." lead="Die Farben kommen aus dem Glarnerland: Schiefer, Gletscherwasser, Firn und das Licht am Abend. Alle Werte sind Tokens in der Website." />
            {colorGroups.map((g) => (
              <div key={g.title}>
                <Sub>{g.title}</Sub>
                <p className="mt-3 max-w-[60ch] text-[0.9375rem] text-ink/75">{g.text}</p>
                <ul className="mt-6 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                  {g.swatches.map((c) => (
                    <li key={c.name}>
                      <div
                        className="flex h-28 items-end rounded-[var(--radius)] p-4 shadow-[inset_0_0_0_1px_rgb(238_243_243/0.08)]"
                        style={{ background: c.hex, color: c.ink === "dark" ? "#0b1418" : "#eef3f3" }}
                      >
                        <span className="font-medium">{c.name}</span>
                      </div>
                      <div className="mt-2">
                        <CopyValue value={c.hex} label={c.name} />
                        {c.token && <p className="small nums text-muted">{c.token}</p>}
                        <p className="small mt-1 text-ink/75">{c.use}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Sub>Im Einsatz</Sub>
            <div className="mt-6 overflow-hidden rounded-[var(--radius)] border border-line bg-bg">
              <div className="grid gap-8 p-6 md:grid-cols-9 md:p-10">
                <div className="md:col-span-5">
                  <p className="kicker text-aqua">Kicker in Gletscherblau</p>
                  <p className="head mt-3">Titel in Firn.</p>
                  <p className="mt-3 text-muted">Sekundärtext in Gedämpft, auf Nachtschiefer.</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="btn">Hauptaktion</span>
                    <span className="btn-quiet">Nebenaktion</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-6 md:col-span-4">
                  <div className="tile p-5">
                    <p className="small text-muted">Fläche</p>
                    <p className="mt-1">Status: <span className="text-glow">In Entwicklung</span></p>
                  </div>
                  <p className="small inline-flex items-center gap-2 text-ink/85">
                    Made in Switzerland <SwissFlag className="h-[1em] w-[1em]" />
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ---------- Typografie ---------- */}
          <section id="typografie" aria-labelledby="typografie-title" className="scroll-mt-24">
            <Head id="typografie" title="Typography." lead="Zwei Schriften mit klaren Rollen. Satoshi gibt den Titeln Charakter, Helvetica hält alles andere ruhig." />

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="tile p-6 md:p-8">
                <p className="small text-muted">Titel und grosse Zahlen</p>
                <p className="mt-6 font-[family-name:var(--font-display)] text-[clamp(4rem,2rem+5vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em]">Aa</p>
                <p className="mt-6 font-[family-name:var(--font-display)] text-[1.5rem] font-bold tracking-[-0.02em]">Satoshi</p>
                <p className="small mt-1 text-muted">Schnitte 400, 500, 700, 900 · über Fontshare</p>
              </div>
              <div className="tile p-6 md:p-8">
                <p className="small text-muted">Text, Bedienung, Beschriftung</p>
                <p className="mt-6 text-[clamp(4rem,2rem+5vw,7rem)] font-medium leading-[0.9] tracking-[-0.04em]">Aa</p>
                <p className="mt-6 text-[1.5rem] font-medium tracking-[-0.02em]">Helvetica Neue</p>
                <p className="small mt-1 text-muted">Systemschrift, Ersatz Helvetica und Arial</p>
              </div>
            </div>

            <Sub>Hierarchie</Sub>
            <ul className="border-b border-line">
              {typeScale.map((t) => (
                <li key={t.name} className="grid gap-x-8 gap-y-3 border-t border-line py-6 first:border-t-0 md:grid-cols-9">
                  <div className="md:col-span-2">
                    <p className="font-medium">{t.name}</p>
                    <p className="small nums mt-1 text-muted">{t.size}</p>
                    <p className="small nums text-muted">Zeile {t.lh} · Laufweite {t.track}</p>
                  </div>
                  <p className={`min-w-0 break-words md:col-span-7 ${t.cls} ${t.cls === "kicker" ? "text-aqua" : ""} ${t.cls === "mega" ? "!text-[clamp(2.5rem,1rem+5vw,6rem)]" : ""}`}>{t.sample}</p>
                </li>
              ))}
            </ul>

            <Sub>Technische Beschriftungen</Sub>
            <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-3">
              {[
                ["Höhen", `${"3'614"} m`, "Hochkomma als Tausendertrennung, wie in der Schweiz üblich."],
                ["Koordinaten", "47°02′ N  9°04′ E", "Grad und Minuten, Ziffern in Tabellenbreite."],
                ["Jahre und Zahlen", "2017 · 11 · 3", "Immer tabellarische Ziffern, damit Spalten stehen."],
              ].map(([k, v, d]) => (
                <div key={k} className="border-t border-line pt-4">
                  <p className="small text-muted">{k}</p>
                  <p className="nums mt-2 text-[1.5rem] font-[620] tracking-[-0.02em]">{v}</p>
                  <p className="small mt-2 text-ink/75">{d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Designsprache ---------- */}
          <section id="designsprache" aria-labelledby="designsprache-title" className="scroll-mt-24">
            <Head id="designsprache" title="Design language." lead="Ein Raster, feine Linien und echte Berge. Alles Weitere ist Zurückhaltung." />

            <Sub>Linien und Raster</Sub>
            <div className="mt-6 grid gap-8 md:grid-cols-9">
              <div className="relative h-56 overflow-hidden rounded-[var(--radius)] border border-line md:col-span-5">
                <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, var(--color-line) 1px, transparent 1px)", backgroundSize: "calc(100% / 12) 100%" }} />
                <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-ink/40" />
                <div aria-hidden className="absolute left-0 top-1/2 h-px w-1/3 bg-aqua" />
                <p className="small absolute bottom-3 left-3 text-muted">12 Spalten · Haarlinie 1 px</p>
              </div>
              <ul className="border-b border-line md:col-span-4">
                <li className="border-t border-line py-3 text-[0.9375rem]">12 Spalten ab Tablet, 4 auf dem Handy.</li>
                <li className="border-t border-line py-3 text-[0.9375rem]">Linien sind 1 px stark und in Linie (#26323A) gehalten.</li>
                <li className="border-t border-line py-3 text-[0.9375rem]">Ein Segment in Gletscherblau auf einer Linie heisst: hier bist du.</li>
              </ul>
            </div>

            <Sub>Formen</Sub>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                ["6 px", "Bilder, Kacheln, Buttons", "rounded-[6px]"],
                ["Pille", "Filter und Status", "rounded-full"],
                ["Kreis", "Punkte im Verlauf", "rounded-full aspect-square !w-14 mx-auto"],
              ].map(([k, d, cls]) => (
                <div key={k}>
                  <div className="grid h-28 place-items-center rounded-[var(--radius)] border border-line">
                    <span className={`block h-14 w-24 border border-aqua ${cls}`} />
                  </div>
                  <p className="mt-2 font-medium">{k}</p>
                  <p className="small text-muted">{d}</p>
                </div>
              ))}
            </div>

            <Sub>Abstände und Layout</Sub>
            <ul className="mt-2 border-b border-line">
              {[
                ["--margin", "20 bis 48 px", "Seitenrand, wächst mit dem Bildschirm"],
                ["--section", "80 bis 136 px", "Abstand zwischen Abschnitten"],
                ["Spaltenabstand", "32 px", "Zwischen Rasterspalten"],
                ["Textbreite", "bis 44 Zeichen", "Für Fliesstext neben Bildern und Titeln"],
                ["--radius", "6 px", "Ecken von Bildern, Kacheln und Buttons"],
              ].map(([k, v, d]) => (
                <li key={k} className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 border-t border-line py-4 sm:grid-cols-9">
                  <span className="nums font-medium sm:col-span-3">{k}</span>
                  <span className="nums text-muted sm:order-last sm:col-span-2 sm:text-right">{v}</span>
                  <span className="col-span-2 text-ink/75 sm:col-span-4">{d}</span>
                </li>
              ))}
            </ul>

            <Sub>Alpine Motive</Sub>
            <p className="mt-3 max-w-[60ch] text-[0.9375rem] text-ink/75">
              Die Silhouetten sind echte Glarner Gipfel, aus Höhendaten berechnet. Jeder
              Bereich hat seinen festen Berg, damit die Berge etwas bedeuten und nicht als
              Dekoration wiederholt werden.
            </p>
            <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
              {[
                [MOUNTAINS.toedi, "Digital Experiences"],
                [MOUNTAINS.glaernisch, "Creative Production"],
                [MOUNTAINS.kaerpf, "Cloud & Infrastructure"],
                [MOUNTAINS.wiggis, "Community & Gaming"],
              ].map(([m, pillar]) => (
                <li key={pillar as string}>
                  <PillarMark mountain={m as (typeof MOUNTAINS)["toedi"]} className="text-ink" />
                  <p className="small mt-2 font-medium text-aqua">{pillar as string}</p>
                </li>
              ))}
            </ul>

            <Sub>Interaktion</Sub>
            <div className="mt-6 grid gap-8 md:grid-cols-9">
              <div className="flex flex-wrap items-center gap-3 md:col-span-5">
                <Link href="/kontakt" className="btn">Projekt anfragen</Link>
                <Link href="/projekte" className="btn-quiet">Projekte ansehen</Link>
                <Link href="/history" className="link-under inline-flex min-h-11 items-center font-medium">The Aracle Journey</Link>
              </div>
              <ul className="border-b border-line md:col-span-4">
                <li className="border-t border-line py-3 text-[0.9375rem]">Ein Gletscherblau-Button pro Bereich, für die eine Hauptaktion.</li>
                <li className="border-t border-line py-3 text-[0.9375rem]">Textlinks in Gletscherblau unterstreichen sich beim Überfahren.</li>
                <li className="border-t border-line py-3 text-[0.9375rem]">Jedes Bedienelement hat Hover, Fokus und Druck.</li>
              </ul>
            </div>
          </section>

          {/* ---------- Motion ---------- */}
          <section id="motion" aria-labelledby="motion-title" className="scroll-mt-24">
            <Head id="motion" title="Motion." lead="Bewegung antwortet auf das, was jemand tut, oder zeichnet einmal eine Linie. Sie dekoriert nicht." />

            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-3">
              <EaseDemo name="Auslaufen" token="--ease-out" curve={[0.22, 1, 0.36, 1]} duration={900} use="Einblenden, Hover, Linien-Segmente" />
              <EaseDemo name="Gleiten" token="--ease-in-out" curve={[0.76, 0, 0.24, 1]} duration={1800} use="Panorama zeichnen, grosse Wechsel" />
              <EaseDemo name="Weich" token="--ease-soft" curve={[0.33, 1, 0.68, 1]} duration={1200} use="Bilder, Zoom beim Laden" />
            </div>

            <Sub>Grundsätze</Sub>
            <ul className="border-b border-line">
              {[
                ["Nur transform und opacity", "Der Browser muss nichts neu zeichnen. Bewegung bleibt flüssig, auch auf dem Handy."],
                ["Kurz für Antworten, lang für Linien", "Druck 140 ms, Farbe 180 ms, Segment 420 ms. Panorama-Linien dürfen sich 1.8 bis 2.4 s Zeit nehmen."],
                ["Einmal pro Element", "Titel und Inhalte erscheinen beim ersten Sichtkontakt und bleiben dann stehen."],
                ["Reduzierte Bewegung respektieren", "Wer das im System einstellt, sieht alle Inhalte sofort, ohne Animation und ohne weiches Scrollen."],
              ].map(([k, d]) => (
                <li key={k} className="grid gap-x-8 gap-y-1 border-t border-line py-5 first:border-t-0 sm:grid-cols-9">
                  <span className="font-medium sm:col-span-3">{k}</span>
                  <span className="text-ink/75 sm:col-span-6">{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- Downloads ---------- */}
          <section id="downloads" aria-labelledby="downloads-title" className="scroll-mt-24">
            <Head id="downloads" title="Downloads." lead="Alle Logo-Dateien in voller Grösse, PNG mit transparentem Hintergrund." />
            <ul className="mt-10 border-b border-line">
              {downloads.map((f) => (
                <li key={f.file}>
                  <a
                    href={f.file}
                    download
                    className="seg-host group relative grid grid-cols-[5.5rem_1fr_auto] items-center gap-x-5 border-t border-line py-4 sm:grid-cols-[7rem_1fr_auto_auto]"
                  >
                    <span aria-hidden className="seg seg-top" />
                    <span className={`grid h-12 place-items-center rounded-[4px] px-2 ${f.bg === "light" ? "bg-ink" : "bg-surface"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.preview} alt="" loading="lazy" className="h-auto max-h-8 w-full bg-transparent object-contain" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium transition-colors group-hover:text-aqua">{f.title}</span>
                      <span className="small block truncate text-muted">{f.note}</span>
                    </span>
                    <span className="small nums hidden text-muted sm:block">{f.size}</span>
                    <span className="small font-medium text-aqua">PNG laden</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="small mt-6 max-w-[60ch] text-muted">
              Vektordateien (AI, SVG) für Druck und grosse Formate gibt es auf Anfrage:{" "}
              <a href="mailto:info@aracle.ch" className="link-under">info@aracle.ch</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
