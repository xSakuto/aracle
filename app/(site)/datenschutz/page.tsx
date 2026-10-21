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
        J. Nef Aracle, Media &amp; Design, Joel-Sananda Nef
        <br />
        Dörflistrasse 18, 8755 Ennenda, Schweiz
        <br />
        <a href="mailto:info@arcl.ch" className="link-under">
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
    body: "Für Besucherinnen und Besucher setzt diese Website keine Cookies, kein Tracking und keine Analyse-Tools ein. Es werden keine Nutzungsprofile erstellt. Schriften werden von unserem eigenen Server geladen, nicht von Google.",
  },
  {
    n: "§ 6",
    title: "Team-Login",
    body: "Der Login-Bereich ist nur für Mitglieder des Aracle-Teams. Für die Anmeldung wird ein technisch notwendiges Cookie gesetzt, das die Sitzung speichert. Login, Teamprofile und Profilbilder werden bei Supabase Inc. gespeichert, einem Anbieter für Datenbanken und Authentifizierung. Gespeichert werden E-Mail-Adresse, Name, Rolle, Kurzbeschreibung, Profilbild und selbst angegebene Social-Media-Links. Diese Angaben (ausser der E-Mail-Adresse) erscheinen auf der Teamseite. Teammitglieder können ihre Angaben jederzeit selbst ändern oder die Löschung verlangen.",
  },
  {
    n: "§ 7",
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
          <a href="mailto:info@arcl.ch" className="link-under">
            info@arcl.ch
          </a>
        </span>
      </>
    ),
  },
  {
    n: "§ 8",
    title: "Änderungen dieser Erklärung",
    body: "Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen. Die jeweils aktuelle Version ist auf dieser Seite abrufbar.",
  },
];

export default function DatenschutzPage() {
  return (
    <div data-shape="wave" className="wrap pb-[var(--section)] pt-28 md:pt-36">
    <div className="inner grid grid-cols-12 gap-x-3 md:gap-x-8 gap-y-12">
      <div className="col-span-12 md:col-span-5">
        <div className="md:sticky md:top-24">
          <h1 className="display" data-split="load">
            Datenschutz
          </h1>
          <p className="lead mt-5 max-w-[28rem] text-muted" data-rise style={{ ["--i" as string]: 1 }}>
            Kurz gesagt: kein Tracking, keine Cookies für Besucher. Gespeichert
            wird nur, was der Betrieb und der Team-Login brauchen.
          </p>
        </div>
      </div>
      <div className="col-span-12 flex flex-col gap-12 md:col-span-6 md:col-start-7 md:pt-4">
        {sections.map((s) => (
          <section key={s.n} aria-label={s.title} data-reveal>
            <h2 className="text-[1.3125rem] tracking-[-0.02em]">{s.title}</h2>
            <div className="mt-3 text-ink/85">{s.body}</div>
          </section>
        ))}
        <p className="small text-muted">
          Stand: Oktober 2026. Gemäss Schweizer DSG (SR 235.1) sowie DSGVO (EU) 2016/679.
        </p>
      </div>
    </div>
    </div>
  );
}
