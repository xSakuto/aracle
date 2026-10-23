import type { ReactNode } from "react";

// Erlaubt **fett**, `code` und https-Links, genau wie in Discord. Alles andere bleibt einfacher Text.
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|https:\/\/[^\s<>"')]+)/g;

export default function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  text.split(TOKEN).forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      out.push(<strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>);
    } else if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      out.push(
        <code key={i} className="rounded-[4px] bg-raised px-1.5 py-0.5 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part.startsWith("https://")) {
      out.push(
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-aqua underline-offset-4 hover:underline">
          {part.replace(/^https:\/\/(www\.)?/, "")}
        </a>,
      );
    } else {
      out.push(part);
    }
  });
  return <>{out}</>;
}
