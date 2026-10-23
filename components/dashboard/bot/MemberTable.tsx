"use client";

import Link from "next/link";
import { useState } from "react";
import { fmtDuration, fmtNum, type MemberRow } from "@/lib/bot-types";

export default function MemberTable({
  members,
  rankType,
  guildId,
}: {
  members: MemberRow[];
  rankType: "voice" | "text" | null;
  guildId: string;
}) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const rows = query ? members.filter((m) => m.name.toLowerCase().includes(query) || m.id.includes(query)) : members;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="dash-help">
          {rows.length === members.length ? `${fmtNum(members.length)} Mitglieder` : `${fmtNum(rows.length)} von ${fmtNum(members.length)}`}
          , sortiert nach {rankType === "voice" ? "Voice-Zeit" : "XP"}
        </p>
        <label className="sr-only" htmlFor="member-search">Mitglied suchen</label>
        <input
          id="member-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name oder ID suchen"
          autoComplete="off"
          className="dash-input max-w-[18rem]"
        />
      </div>

      <div className="dash-panel mt-4 overflow-x-auto !p-0">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="px-4 py-3 font-medium">Mitglied</th>
              <th className="px-4 py-3 font-medium">Level und XP</th>
              <th className="px-4 py-3 font-medium">Voice</th>
              <th className="px-4 py-3 font-medium">Rang</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-t border-[#24272c] transition-colors hover:bg-[#161f25]">
                <td className="px-4 py-2.5">
                  <Link href={`/dashboard/bot/mitglieder/${m.id}?g=${guildId}`} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.avatar} alt="" loading="lazy" className="h-7 w-7 shrink-0 rounded-full bg-[#24272c] object-cover" />
                    <span className="truncate">{m.name}</span>
                  </Link>
                </td>
                <td className="nums px-4 py-2.5">Level {m.level} · {fmtNum(m.xp)}</td>
                <td className="nums px-4 py-2.5">{fmtDuration(m.seconds)}</td>
                <td className="px-4 py-2.5">{m.rank ?? <span className="text-muted">keiner</span>}</td>
                <td className="px-4 py-2.5 text-right">
                  <Link href={`/dashboard/bot/mitglieder/${m.id}?g=${guildId}`} className="text-muted hover:text-ink">
                    Verwalten
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">Niemand gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
