import BotNav from "@/components/dashboard/bot/BotNav";
import type { BotGuild } from "@/lib/bot-types";

export function Flash({ ok, fehler }: { ok?: string; fehler?: string }) {
  if (!ok && !fehler) return null;
  return (
    <p
      role={fehler ? "alert" : "status"}
      className={`mb-6 rounded-[10px] border px-4 py-3 text-sm ${
        fehler ? "border-[#5a2a24] bg-[#2a1613] text-danger" : "border-[#24403f] bg-[#10201f] text-aqua"
      }`}
    >
      {fehler ?? ok}
    </p>
  );
}

// Der Bot antwortet nicht, oder er ist auf keinem Server.
export function BotDown({ message }: { message: string }) {
  return (
    <div className="dash-panel">
      <p className="font-medium">Der Bot ist gerade nicht verfügbar</p>
      <p className="dash-help mt-1">{message}</p>
      <p className="dash-help mt-3">
        Läuft der Bot-Server und ist der Tunnel <code>bot.aracle.ch</code> aktiv? Das alte Panel im Heimnetz
        (10.1.1.6:5001) geht in der Zwischenzeit weiter.
      </p>
    </div>
  );
}

export function BotShell({
  title,
  help,
  guilds,
  current,
  version,
  flash,
  children,
}: {
  title: string;
  help?: string;
  guilds?: BotGuild[];
  current?: string;
  version?: string | null;
  flash?: { ok?: string; fehler?: string };
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[72rem]">
      <h1 className="font-sans text-2xl font-medium tracking-normal">{title}</h1>
      {help && <p className="mt-1 text-muted">{help}</p>}
      <div className="mt-6">
        {guilds && current && <BotNav guilds={guilds} current={current} version={version ?? null} />}
        <Flash ok={flash?.ok} fehler={flash?.fehler} />
        {children}
      </div>
    </div>
  );
}
