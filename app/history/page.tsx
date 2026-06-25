import SectionLabel from "@/components/SectionLabel";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Story · Aracle",
  description: "Von einem YouTube-Kanal zum Creative Studio. Die Geschichte von Aracle seit 2017.",
};

type Tag = "Aktiv" | "Pausiert" | "Eingestellt" | "Kernmarke";
const tagStyle: Record<Tag, string> = {
  Aktiv: "bg-aqua/15 text-aqua border-aqua/30",
  Kernmarke: "bg-aqua/15 text-aqua border-aqua/30",
  Pausiert: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  Eingestellt: "bg-white/10 text-white/50 border-white/15",
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
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-[820px]">
        <SectionLabel>2017 bis heute</SectionLabel>
        <h1 className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.96] tracking-[-0.04em]">
          Die Story<span className="text-gradient">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-dim">
          Von einem YouTube-Kanal zu einem Creative Studio. Acht Jahre
          Projekte, Rebrandings und Erfahrungen.
        </p>

        <div className="relative mt-16 border-l border-line pl-8 md:pl-12">
          {timeline.map((y) => (
            <Reveal key={y.year} className="relative mb-14">
              <span className="absolute -left-[2.1rem] top-1.5 h-3 w-3 rounded-full bg-aqua ring-4 ring-aqua/15 md:-left-[3.1rem]" />
              <div className="mb-5 text-3xl font-bold tracking-tight text-aqua">
                {y.year}
              </div>
              <div className="flex flex-col gap-3">
                {y.items.map((it) => (
                  <div
                    key={it.name}
                    className="rounded-xl border border-line bg-surface/50 p-5 transition hover:border-aqua/25"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-bold tracking-tight">{it.name}</h3>
                      {it.tag && (
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tagStyle[it.tag]}`}
                        >
                          {it.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {it.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
