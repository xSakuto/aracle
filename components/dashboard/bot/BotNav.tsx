"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BotGuild } from "@/lib/bot-types";

// Server-Wechsel und Reiter des Bot-Bereichs. Der gewählte Server bleibt in der Adresse (?g=).
export default function BotNav({ guilds, current, version }: { guilds: BotGuild[]; current: string; version: string | null }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/dashboard/bot", label: "Übersicht", on: pathname === "/dashboard/bot" },
    { href: "/dashboard/bot/mitglieder", label: "Mitglieder", on: pathname.startsWith("/dashboard/bot/mitglieder") },
    { href: "/dashboard/bot/moderation", label: "Moderation", on: pathname.startsWith("/dashboard/bot/moderation") },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2">
        {guilds
          .filter((g) => g.present)
          .map((g) => (
            <Link
              key={g.id}
              href={`${pathname.startsWith("/dashboard/bot/mitglieder/") ? "/dashboard/bot/mitglieder" : pathname}?g=${g.id}`}
              aria-current={g.id === current ? "true" : undefined}
              className={`h-8 rounded-[6px] px-3 text-sm leading-8 transition-colors active:scale-[0.98] ${
                g.id === current ? "bg-[#24272c] text-ink" : "text-muted hover:bg-[#16181b] hover:text-ink"
              }`}
            >
              {g.name}
            </Link>
          ))}
        {version && <span className="nums ml-auto text-xs text-muted">Bot v{version}</span>}
      </div>
      <nav aria-label="Bot-Bereich" className="mt-4 flex gap-1 border-b border-[#24272c]">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={`${t.href}?g=${current}`}
            aria-current={t.on ? "page" : undefined}
            className={`-mb-px border-b-2 px-3 pb-2.5 pt-1 text-sm transition-colors ${
              t.on ? "border-aqua text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
