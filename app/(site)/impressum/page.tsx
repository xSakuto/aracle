export const metadata = { title: "Impressum", alternates: { canonical: "/impressum" } };

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
      Joel-Sananda Nef
      <br />
      Büel-Waid 12
      <br />
      8750 Glarus
      <br />
      Schweiz
    </>,
  ],
  [
    "Kontakt",
    <a href="mailto:info@aracle.ch" className="link-under">
      info@aracle.ch
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

// Impressum in der Mitte, der Blick von der Schwammhöhe ins Klöntal als Rahmen an den Rändern.
export default function ImpressumPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <picture>
          <source type="image/webp" srcSet="/images/hero/kloentalersee-1280.webp 1280w, /images/hero/kloentalersee-2560.webp 2560w" sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero/kloentalersee-1280.jpg"
            srcSet="/images/hero/kloentalersee-1280.jpg 1280w, /images/hero/kloentalersee-2560.jpg 2560w"
            sizes="100vw"
            alt=""
            width={2560}
            height={1440}
            className="h-full w-full object-cover object-[55%_45%] opacity-75"
          />
        </picture>
        {/* Mitte ruhig, Ränder offen */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_44%_70%_at_50%_50%,var(--color-bg)_55%,rgb(11_17_21/0.82)_72%,rgb(11_17_21/0.25))]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="wrap flex min-h-svh flex-col items-center justify-center pb-[var(--section)] pt-28 md:pt-36">
        <div className="w-full max-w-[36rem]">
          <h1 className="display text-center" data-split="load">
            Impressum
          </h1>
          <p className="lead mx-auto mt-5 max-w-[26rem] text-center text-muted" data-rise style={{ ["--i" as string]: 1 }}>
            Wer hinter aracle.ch steht und wie du uns erreichst.
          </p>
          <dl className="mt-12 border-b border-line">
            {rows.map(([label, value], i) => (
              <div key={i} className="grid gap-x-8 gap-y-1 border-t border-line py-4 sm:grid-cols-[10rem_1fr]">
                <dt className="text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="small mt-8 text-center text-muted">Gemäss Art. 3 lit. s UWG und DSG Schweiz.</p>
        </div>
      </div>
    </div>
  );
}
