export const metadata = {
  title: "Kontakt · Aracle",
  description: "Projekt anfragen oder Teil von Aracle werden.",
};

const mail = "info@arcl.ch";
const subject = encodeURIComponent("Projekt-Anfrage");
const body = encodeURIComponent(
  "Hallo Aracle,\n\nWorum es geht:\nWas ich brauche (Video, Design, Web, Hosting, Immobilien):\nBis wann:\n",
);

const ways: { name: string; value: string; href: string; note: string }[] = [
  { name: "E-Mail", value: mail, href: `mailto:${mail}`, note: "Für Anfragen, Offerten und alles Schriftliche." },
  { name: "Discord", value: "Aracle Community", href: "https://discord.gg/BgpKdzBYtD", note: "Für schnelle Fragen und wenn du mitmachen willst." },
  { name: "Instagram", value: "@aracle.ch", href: "https://www.instagram.com/aracle.ch/", note: "Für Einblicke in laufende Projekte." },
];

export default function KontaktPage() {
  return (
    <>
      <div className="wrap grid grid-cols-12 gap-x-8 gap-y-16 pb-[var(--section)] pt-32 md:pt-40">
        <div className="col-span-12 md:col-span-6">
          <h1 className="display" data-rise>
            Lass uns reden
          </h1>
          <p className="lead mt-8 max-w-[34rem]" data-rise style={{ ["--i" as string]: 1 }}>
            Ein Projekt, eine Idee oder du willst Teil von Aracle werden? Schreib
            uns, worum es geht. Wir melden uns mit den nächsten Schritten.
          </p>
          <a
            href={`mailto:${mail}?subject=${subject}&body=${body}`}
            className="btn mt-10"
            data-rise
            style={{ ["--i" as string]: 2 }}
          >
            Projekt per E-Mail anfragen
          </a>
        </div>

        <section aria-label="Kontaktwege" className="col-span-12 md:col-span-5 md:col-start-8 md:self-end">
          <ul className="flex flex-col gap-1">
            {ways.map((w, i) => (
              <li key={w.name} data-reveal style={{ ["--i" as string]: i }}>
                <a
                  href={w.href}
                  {...(w.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group block bg-surface p-6 transition-[background-color,transform] duration-200 hover:bg-raised active:scale-[0.99]"
                >
                  <span className="small text-muted">{w.name}</span>
                  <span className="lead mt-1 block font-display group-hover:text-aqua">{w.value}</span>
                  <span className="mt-2 block">{w.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="relative h-[60svh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Brand_assets/arcl-header.jpg"
          alt="Klöntalersee im Kanton Glarus"
          width={2200}
          height={1238}
          loading="lazy"
          className="drift h-full w-full object-cover"
        />
      </div>
    </>
  );
}
