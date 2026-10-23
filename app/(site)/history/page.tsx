import Link from "next/link";
import Panorama from "@/components/alpine/Panorama";
import { GLAERNISCH } from "@/data/panorama/glaernisch";
import Journey from "@/components/journey/Journey";
import { journey } from "@/data/journey";

export const metadata = {
  alternates: { canonical: "/history" },
  title: "The Aracle Journey",
  description: "Von einem YouTube-Kanal zum Creative & Technology Studio. Die Geschichte von Aracle seit 2017.",
};

export default function HistoryPage() {
  const first = journey[0].year;
  return (
    <>
      <header className="wrap pt-28 md:pt-36">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="kicker text-aqua" data-rise>
              {first} bis heute
            </p>
            <h1 className="mega mt-5" data-split="load">
              The Aracle Journey.
            </h1>
          </div>
          <p className="text-ink/80 md:col-span-4" data-rise style={{ ["--i" as string]: 2 }}>
            Vom YouTube-Kanal über Minecraft-Server und Communities bis zum
            Studio für Creative Production, Web und Infrastruktur. Folge dem
            Weg, Station für Station.
          </p>
        </div>
      </header>

      {/* Die Geschichte beginnt im Glarnerland: der Glärnisch, vom Schilt aus */}
      <div className="mt-16 md:mt-10">
        <Panorama
          data={GLAERNISCH}
          labels={[
            { peak: "Vrenelisgärtli", title: "Glärnisch", sub: "Vrenelisgärtli", row: 0 },
            { peak: "Ruchen", row: 1, side: "right", minor: true },
            { peak: "Bächistock", row: 2, side: "left", minor: true },
          ]}
          yMax={420}
          mobileView={{ x0: 300, x1: 1200 }}
        />
      </div>

      <div className="wrap pb-[var(--section)]">
        <Journey stages={journey} />

        {/* Ziel des Wegs: heute */}
        <div className="relative grid grid-cols-12 gap-x-3 border-t border-line pt-14 md:gap-x-8">
          <div className="col-span-12 pl-12 md:col-span-8 md:col-start-3 md:pl-0 md:text-center">
            <p className="journey-year !text-aqua">Heute</p>
            <h2 className="head mt-3">Where the path continues.</h2>
            <p className="mx-auto mt-4 max-w-[34rem] text-ink/80">
              Der Weg geht weiter, vielleicht mit deinem Projekt. Erzähl uns,
              woran du arbeitest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:justify-center">
              <Link href="/kontakt" className="btn">Projekt anfragen</Link>
              <Link href="/projekte" className="btn-quiet">Alle Projekte</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
