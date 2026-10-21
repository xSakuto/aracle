import Link from "next/link";

// Seit 2017: der Satz bleibt in der Mitte, die Bilder ziehen an den Seiten vorbei.
export default function StoryPass() {
  return (
    <section aria-labelledby="story-title" className="relative bg-field pb-[var(--section)] md:pb-0">
      <div className="wrap relative z-10 flex pt-[var(--section)] md:sticky md:top-0 md:h-svh md:items-center md:justify-center md:pt-0">
        <div className="max-w-[34rem] md:w-[30vw] md:max-w-none md:text-center">
          <h2 id="story-title" className="head">
            Seit 2017 in Glarus.
          </h2>
          <p className="lead mt-6">
            Angefangen mit einem YouTube-Kanal und einem Minecraft-Server.
            Heute ein Studio mit eigenen Marken, eigener Cloud und einem Team,
            das mitzieht.
          </p>
          <Link href="/history" className="link-under mt-6 inline-flex min-h-11 items-center">
            Die ganze Geschichte lesen
          </Link>
        </div>
      </div>

      {/* Bilder links und rechts vom Satz, nie darüber */}
      <div className="wrap relative mt-12 grid grid-cols-12 gap-y-10 md:-mt-[60svh] md:gap-y-[38svh] md:pb-[8svh]">
        <figure className="col-span-5 md:col-span-4" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Brand_assets/images/heros/cloudhosting.jpg"
            alt="Serverraum mit Racks und Arbeitsplatz"
            width={1600}
            height={1067}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
          <figcaption className="small mt-2 text-muted">Vom Minecraft-Server zur eigenen Cloud</figcaption>
        </figure>
        <figure className="col-span-6 col-start-7 md:col-span-4 md:col-start-9" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Brand_assets/arcl-header.jpg"
            alt="Der Klöntalersee im Kanton Glarus, schwarzweiss"
            width={2200}
            height={1238}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
          <figcaption className="small mt-2 text-muted">Klöntalersee, Glarus</figcaption>
        </figure>
        <figure className="col-span-5 md:col-span-3 md:col-start-1" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Brand_assets/images/heros/highside.jpg"
            alt="Zwei Motorräder in Schräglage auf einer Rennstrecke"
            width={1600}
            height={1067}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <figcaption className="small mt-2 text-muted">Highside, 2024</figcaption>
        </figure>
      </div>
    </section>
  );
}
