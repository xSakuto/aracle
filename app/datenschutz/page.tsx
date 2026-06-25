import SectionLabel from "@/components/SectionLabel";

export const metadata = { title: "Datenschutz · Aracle" };

const sections: { n: string; title: string; body: React.ReactNode }[] = [
  {
    n: "§ 1",
    title: "Verantwortliche Stelle",
    body: (
      <>
        Verantwortlich für die Datenbearbeitung auf dieser Website ist:
        <br />
        <br />
        J. Nef Aracle · Media &amp; Design · Joel-Sananda Nef
        <br />
        Dörflistrasse 18, 8755 Ennenda, Schweiz
        <br />
        <a href="mailto:info@arcl.ch" className="text-aqua hover:opacity-80">
          info@arcl.ch
        </a>
      </>
    ),
  },
  {
    n: "§ 2",
    title: "Allgemeines zur Datenbearbeitung",
    body: "Wir bearbeiten personenbezogene Daten grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Bearbeitung erfolgt auf Grundlage des Schweizer Datenschutzgesetzes (DSG) sowie, soweit anwendbar, der DSGVO der EU.",
  },
  {
    n: "§ 3",
    title: "Hosting & Server-Logfiles",
    body: (
      <>
        Diese Website wird bei Vercel Inc. gehostet. Beim Besuch werden
        automatisch technische Daten im Server-Log gespeichert:
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>IP-Adresse des anfragenden Geräts</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Aufgerufene Seite oder Datei</li>
          <li>Verwendeter Browser und Betriebssystem</li>
          <li>HTTP-Statuscode</li>
        </ul>
        <span className="mt-3 block">
          Diese Daten dienen ausschliesslich dem technischen Betrieb und der
          Sicherheit der Website.
        </span>
      </>
    ),
  },
  {
    n: "§ 4",
    title: "Kontaktaufnahme",
    body: "Wenn du uns per E-Mail oder Discord kontaktierst, werden die übermittelten Daten zur Bearbeitung deiner Anfrage gespeichert. Wir geben diese Daten nicht ohne deine Einwilligung weiter und löschen sie, sobald sie nicht mehr benötigt werden.",
  },
  {
    n: "§ 5",
    title: "Cookies & Tracking",
    body: "Diese Website verwendet keine Cookies, kein Tracking und keine Analyse-Tools. Es werden keine Nutzungsprofile erstellt.",
  },
  {
    n: "§ 6",
    title: "Deine Rechte",
    body: (
      <>
        Du hast gemäss DSG (und soweit anwendbar der DSGVO) folgende Rechte:
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Auskunft über deine gespeicherten Daten</li>
          <li>Berichtigung unrichtiger Daten</li>
          <li>Löschung deiner Daten</li>
          <li>Einschränkung der Datenbearbeitung</li>
          <li>Datenübertragbarkeit</li>
          <li>Widerspruch gegen die Bearbeitung</li>
        </ul>
        <span className="mt-3 block">
          Anfragen an:{" "}
          <a href="mailto:info@arcl.ch" className="text-aqua hover:opacity-80">
            info@arcl.ch
          </a>
        </span>
      </>
    ),
  },
  {
    n: "§ 7",
    title: "Änderungen dieser Erklärung",
    body: "Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen. Die jeweils aktuelle Version ist auf dieser Seite abrufbar.",
  },
];

export default function DatenschutzPage() {
  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Rechtliches</SectionLabel>
        <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1] tracking-[-0.04em]">
          Daten<span className="text-gradient">schutz.</span>
        </h1>

        <div className="mt-12 flex flex-col gap-4">
          {sections.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-line bg-surface p-7"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-sm font-bold text-aqua">{s.n}</span>
                <h2 className="text-lg font-bold tracking-tight">{s.title}</h2>
              </div>
              <div className="text-sm leading-relaxed text-dim">{s.body}</div>
            </div>
          ))}
        </div>

        <p className="mt-6 px-1 text-sm text-muted">
          Stand: {new Date().getFullYear()} · Gemäss Schweizer DSG (SR 235.1)
          sowie DSGVO (EU) 2016/679.
        </p>
      </div>
    </div>
  );
}
