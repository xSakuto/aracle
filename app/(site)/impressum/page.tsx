export const metadata = { title: "Impressum · Aracle" };

const rows: [string, React.ReactNode][] = [
  [
    "Betreiber",
    <>
      J. Nef Aracle, Media &amp; Design
      <span className="small mt-0.5 block text-muted">Einzelfirma</span>
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
    <a href="mailto:info@arcl.ch" className="link-under">
      info@arcl.ch
    </a>,
  ],
  [
    "Mehrwertsteuer",
    <>
      Nicht MWST-pflichtig
      <span className="small mt-0.5 block text-muted">
        gemäss Art. 10 MWSTG
      </span>
    </>,
  ],
  ["Handelsregister", "Nicht eingetragen"],
];

export default function ImpressumPage() {
  return (
    <div className="wrap pb-[var(--section)] pt-28 md:pt-36">
    <div className="inner grid grid-cols-12 gap-x-3 md:gap-x-8 gap-y-12">
      <div className="col-span-12 md:col-span-6">
        <h1 className="display" data-rise>
          Impressum
        </h1>
        <p className="lead mt-5 max-w-[28rem] text-muted" data-rise style={{ ["--i" as string]: 1 }}>
          Wer hinter aracle.ch steht und wie du uns erreichst.
        </p>
      </div>
      <div className="col-span-12 md:col-span-6 md:pt-4">
      <dl className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-[11rem_1fr]">
        {rows.map(([label, value], i) => (
          <div key={i} className="contents" data-reveal>
            <dt className="text-muted">{label}</dt>
            <dd className="-mt-6 sm:mt-0">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="small mt-12 text-muted">Gemäss Art. 3 lit. s UWG und DSG Schweiz.</p>
      </div>
    </div>
    </div>
  );
}
