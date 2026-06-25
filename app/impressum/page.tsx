import SectionLabel from "@/components/SectionLabel";

export const metadata = { title: "Impressum · Aracle" };

const rows: [string, React.ReactNode][] = [
  [
    "Betreiber",
    <>
      J. Nef Aracle · Media &amp; Design
      <span className="mt-0.5 block text-sm text-muted">Einzelfirma</span>
    </>,
  ],
  ["Inhaber", "Joel-Sananda Nef"],
  [
    "Adresse",
    <>
      Dörflistrasse 18
      <br />
      8755 Ennenda
      <br />
      Schweiz
    </>,
  ],
  [
    "Kontakt",
    <a href="mailto:info@arcl.ch" className="text-aqua hover:opacity-80">
      info@arcl.ch
    </a>,
  ],
  [
    "Mehrwertsteuer",
    <>
      Nicht MWST-pflichtig
      <span className="mt-0.5 block text-sm text-muted">
        gemäss Art. 10 MWSTG
      </span>
    </>,
  ],
  ["Handelsregister", "Nicht eingetragen"],
];

export default function ImpressumPage() {
  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Rechtliches</SectionLabel>
        <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1] tracking-[-0.04em]">
          Im<span className="text-gradient">pressum.</span>
        </h1>

        <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface">
          {rows.map(([label, value], i) => (
            <div
              key={i}
              className="grid grid-cols-[10rem_1fr] gap-4 border-b border-line px-6 py-5 last:border-b-0 sm:grid-cols-[13rem_1fr]"
            >
              <span className="pt-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                {label}
              </span>
              <span className="text-dim">{value}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 px-1 text-sm text-muted">
          Gemäss Art. 3 lit. s UWG und DSG Schweiz.
        </p>
      </div>
    </div>
  );
}
