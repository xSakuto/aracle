"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashNav({ admin }: { admin: boolean }) {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Mein Profil", active: pathname === "/dashboard" },
    ...(admin
      ? [
          { href: "/dashboard/news", label: "News", active: pathname.startsWith("/dashboard/news") },
          { href: "/dashboard/bot", label: "Discord-Bot", active: pathname.startsWith("/dashboard/bot") },
          { href: "/dashboard/anfragen", label: "Anfragen", active: pathname.startsWith("/dashboard/anfragen") },
          { href: "/dashboard/team", label: "Team verwalten", active: pathname.startsWith("/dashboard/team") },
        ]
      : []),
  ];
  return (
    <nav aria-label="Team-Bereich" className="mt-6 flex gap-1 overflow-x-auto md:flex-col">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          aria-current={it.active ? "page" : undefined}
          className={`flex h-8 shrink-0 items-center rounded-[6px] px-3 transition-colors active:scale-[0.98] ${
            it.active ? "bg-[#1c1e22] text-ink" : "text-muted hover:bg-[#16181b] hover:text-ink"
          }`}
        >
          {it.label}
        </Link>
      ))}
      <Link href="/" className="flex h-8 shrink-0 items-center rounded-[6px] px-3 text-muted hover:text-ink md:hidden">
        Zur Website
      </Link>
    </nav>
  );
}
