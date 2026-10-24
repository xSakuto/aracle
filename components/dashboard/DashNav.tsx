"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashNav({
  admin,
  permissions = [],
  badges = {},
}: {
  admin: boolean;
  permissions?: string[];
  badges?: { anfragen?: number };
}) {
  const pathname = usePathname();
  const can = (perm: string) => admin || permissions.includes(perm);
  const items = [
    { href: "/dashboard", label: "Mein Profil", active: pathname === "/dashboard" },
    ...(can("news") ? [{ href: "/dashboard/news", label: "News", active: pathname.startsWith("/dashboard/news") }] : []),
    ...(can("bot") ? [{ href: "/dashboard/bot", label: "Discord-Bot", active: pathname.startsWith("/dashboard/bot") }] : []),
    ...(can("anfragen")
      ? [{ href: "/dashboard/anfragen", label: "Anfragen", active: pathname.startsWith("/dashboard/anfragen"), badge: badges.anfragen }]
      : []),
    ...(admin ? [{ href: "/dashboard/team", label: "Team verwalten", active: pathname.startsWith("/dashboard/team") }] : []),
  ];
  return (
    <nav aria-label="Team-Bereich" className="mt-6 flex gap-1 overflow-x-auto md:flex-col">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          aria-current={it.active ? "page" : undefined}
          className={`flex h-8 shrink-0 items-center justify-between gap-3 rounded-[6px] px-3 transition-colors active:scale-[0.98] ${
            it.active ? "bg-[#1c1e22] text-ink" : "text-muted hover:bg-[#16181b] hover:text-ink"
          }`}
        >
          {it.label}
          {Boolean(it.badge) && (
            <span className="nums rounded-full bg-aqua px-1.5 py-0.5 text-[0.6875rem] font-medium text-bg">{it.badge}</span>
          )}
        </Link>
      ))}
      <Link href="/" className="flex h-8 shrink-0 items-center rounded-[6px] px-3 text-muted hover:text-ink md:hidden">
        Zur Website
      </Link>
    </nav>
  );
}
