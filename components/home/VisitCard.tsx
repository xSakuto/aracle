const rows: [string, string, string][] = [
  ["E-Mail", "info@arcl.ch", "mailto:info@arcl.ch"],
  ["Discord", "Aracle Community", "https://discord.gg/BgpKdzBYtD"],
  ["Instagram", "@aracle.ch", "https://www.instagram.com/aracle.ch/"],
];

// Kontakt: der Klöntalersee, darauf eine Karte mit allem, was es braucht.
export default function VisitCard() {
  return (
    <section aria-labelledby="visit-title" className="relative pb-[var(--section)] md:h-[130svh] md:pb-0">
      <div className="relative h-[70svh] overflow-hidden md:sticky md:top-0 md:h-svh">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Brand_assets/arcl-header.jpg"
          alt="Blick über den Klöntalersee im Kanton Glarus, Sonnenstrahlen über den Bergen"
          width={2200}
          height={1238}
          loading="lazy"
          className="drift h-full w-full object-cover object-[30%_50%]"
        />
      </div>

      <div className="wrap relative z-10 -mt-20 md:absolute md:inset-0 md:mt-0 md:pt-[60px]">
        <div className="bg-surface p-8 md:sticky md:top-[calc(4.5rem+60px)] md:ml-auto md:w-[380px]">
          <h2 id="visit-title" className="lead font-display">
            Projekt anfragen
          </h2>
          <p className="mt-3">
            Aracle
            <br />
            Ennenda, Kanton Glarus
          </p>
          <dl className="mt-6 flex flex-col">
            {rows.map(([k, v, href]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-1.5">
                <dt className="text-muted">{k}</dt>
                <dd>
                  <a
                    href={href}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="link"
                  >
                    {v}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
          <a
            href="mailto:info@arcl.ch?subject=Projekt-Anfrage&body=Hallo%20Aracle%2C%0A%0AWorum%20es%20geht%3A%0AWas%20ich%20brauche%20(Video%2C%20Design%2C%20Web%2C%20Hosting)%3A%0ABis%20wann%3A%0A"
            className="btn -mx-8 -mb-8 mt-8 flex h-[3.25rem] w-[calc(100%+4rem)] md:h-[3.25rem]"
          >
            E-Mail schreiben
          </a>
        </div>
      </div>
    </section>
  );
}
