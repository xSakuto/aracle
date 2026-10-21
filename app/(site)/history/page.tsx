import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Story · Aracle",
  description: "Von einem YouTube-Kanal zum Creative Studio. Die Geschichte von Aracle seit 2017.",
};

type Tag = "Aktiv" | "Pausiert" | "Eingestellt" | "Kernmarke";
const tagText: Record<Tag, string> = {
  Aktiv: "läuft",
  Kernmarke: "Kernmarke",
  Pausiert: "pausiert",
  Eingestellt: "eingestellt",
};

const timeline: {
  year: string;
  items: { name: string; desc: string; tag?: Tag }[];
}[] = [
  {
    year: "2017",
    items: [
      {
        name: "Kanal xSakuto (Rex_HD)",
        desc: "Beginn mit Content Creation auf YouTube. Grundstein für eine kreative Laufbahn als Creator.",
      },
    ],
  },
  {
    year: "2018",
    items: [
      {
        name: "RexArmy.de · Ursprung von Aracle",
        desc: "Gründung durch Joel Nef und Yao Kaiser. Start als Minecraft-Community-Server, erste Erfahrungen mit Hosting und Serverbetrieb.",
      },
    ],
  },
  {
    year: "2019",
    items: [
      {
        name: "RexArmy · Slogan & Expansion",
        desc: "Neuer Slogan «Dein Servernetzwerk». Erste strategische Ausrichtung auf Multi-Plattform-Wachstum, Discord-Fokus auf Zelda-Content.",
      },
    ],
  },
  {
    year: "2020",
    items: [
      {
        name: "RA Coding Community",
        desc: "Discord-Server für Coding-Support. Entwicklung des Discord-Bots «Sakumo».",
        tag: "Eingestellt",
      },
    ],
  },
  {
    year: "2021",
    items: [
      {
        name: "RexusMods",
        desc: "3D-Modelling für GTA V: MLO-Maps und Fahrzeuglackierungen. Zusammenarbeit von Joel Nef und Tim Mockweiss.",
        tag: "Pausiert",
      },
      {
        name: "Rebranding: Sakuto",
        desc: "Kanal-Rebranding zu Sakuto. Erstes hochdeutsches Videoessay, Shift hin zu anspruchsvollerem Format.",
      },
      {
        name: "Alcatros · Coding & Support",
        desc: "Community für technischen Support. Geführt von Yao Kaiser. Offiziell eingestellt 2023.",
        tag: "Eingestellt",
      },
    ],
  },
  {
    year: "2022",
    items: [
      {
        name: "The Legend of Zelda DE",
        desc: "Gründung der grössten deutschen Zelda-Discord-Community. Fokus auf Theorien, Speedruns und Nostalgie.",
        tag: "Aktiv",
      },
    ],
  },
  {
    year: "2023",
    items: [
      {
        name: "Rebranding: Aracle.ch",
        desc: "Offizielles Rebranding. Aracle wird zum Creative Studio mit Media & Design als neuer Ausrichtung.",
        tag: "Kernmarke",
      },
      {
        name: "All the Clients (ATC)",
        desc: "Vanilla+ Modpack für Minecraft-Server. Performance-optimiert und zu 100% vanilla-kompatibel.",
        tag: "Aktiv",
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        name: "Swizzly & Highside.ch",
        desc: "Erstes Motorrad-Video auf TikTok. Parallel der Launch von Highside.ch, Schweizer Bikerstreetwear als eigenständige Brand.",
        tag: "Aktiv",
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        name: "Beer Game",
        desc: "Steam-Release geplant, Wishlist-Kampagne gestartet. Nach 3 Monaten Entwicklung eingestellt.",
        tag: "Eingestellt",
      },
      {
        name: "AracleSMP",
        desc: "Langzeit Vanilla+ Multiplayer-Server mit zusätzlichen Addons. Community-orientiertes Langzeitprojekt.",
        tag: "Aktiv",
      },
      {
        name: "NoReply",
        desc: "Multiplayer-Indie-Game. Entwicklung aktuell pausiert.",
        tag: "Pausiert",
      },
    ],
  },
];

export default function HistoryPage() {
  return (
    <>
      <div data-shape="mountains" className="wrap pb-[var(--section)] pt-28 md:pt-36">
        <div className="inner">
        <div className="text-center">
        <h1 className="display" data-split="load">
          Die Story.
        </h1>
        <p className="lead mx-auto mt-5 max-w-[38rem] text-muted" data-rise style={{ ["--i" as string]: 1 }}>
          Von einem YouTube-Kanal zum Creative Studio. Acht Jahre Projekte,
          Rebrandings und Erfahrungen, Jahr für Jahr.
        </p>
        </div>

        <ol className="mt-14 flex flex-col gap-3">
          {timeline.map((y) => (
            <li key={y.year} className="tile grid grid-cols-12 gap-x-3 md:gap-x-8 gap-y-6 p-8 md:p-10">
              <h2 className="head nums col-span-12 text-muted md:col-span-3" data-reveal>
                {y.year}
              </h2>
              <ul className="col-span-12 flex flex-col gap-10 md:col-span-8 md:col-start-5">
                {y.items.map((it, i) => (
                  <li key={it.name} data-reveal style={{ ["--i" as string]: i + 1 }}>
                    <h3 className="text-[1.3125rem] tracking-[-0.02em]">{it.name}</h3>
                    {it.tag && <p className="small mt-1 text-muted">{tagText[it.tag]}</p>}
                    <p className="mt-2 max-w-[60ch] text-ink/85">{it.desc}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        </div>
      </div>
      <CtaBand
        title="Das nächste Kapitel?"
        text="Vielleicht ist es dein Projekt. Erzähl uns, woran du arbeitest."
        action="Projekt anfragen"
      />
    </>
  );
}
