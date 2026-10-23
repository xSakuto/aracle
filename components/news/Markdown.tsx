import type { ReactNode } from "react";
import { emojiUrl } from "@/lib/emoji";

// Das Discord-Markdown, das in den News gebraucht wird: Überschriften, Code-Blöcke, Listen,
// **fett**, *kursiv*, `code`, [Text](https://link), Server-Emojis und Rollen-Erwähnungen.
const INLINE =
  /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\(https:\/\/[^\s)]+\))|(<a?:\w+:\d+>)|(<@&\w+>)|(https:\/\/[^\s<>"')\]]+)/g;

type Variant = "site" | "discord";

const STYLE = {
  site: {
    p: "mt-4 first:mt-0 text-ink/85",
    ul: "mt-3 list-disc space-y-1 pl-5 text-ink/85",
    pre: "mt-5 overflow-x-auto rounded-[var(--radius)] bg-surface p-4 font-mono text-[0.8125rem] leading-relaxed",
    code: "rounded-[4px] bg-raised px-1.5 py-0.5 font-mono text-[0.85em]",
    link: "text-aqua underline-offset-4 hover:underline",
    mention: "rounded-[4px] bg-[color-mix(in_oklab,var(--color-aqua)_16%,transparent)] px-1 text-aqua",
    h: ["mt-6 text-2xl font-semibold", "mt-6 text-xl font-semibold", "mt-5 text-lg font-semibold"],
  },
  discord: {
    p: "mt-2 first:mt-0",
    ul: "mt-2 list-disc space-y-0.5 pl-5",
    pre: "mt-2 overflow-x-auto rounded-[4px] bg-[#1e1f22] p-2.5 font-mono text-[0.75rem] leading-relaxed",
    code: "rounded-[3px] bg-[#1e1f22] px-1 py-px font-mono text-[0.85em]",
    link: "text-[#00a8fc] hover:underline",
    mention: "rounded-[3px] bg-[#3c4270] px-0.5 text-[#c9cdfb]",
    h: ["mt-3 text-2xl font-bold text-white", "mt-3 text-xl font-bold text-white", "mt-2 text-lg font-bold text-white"],
  },
} as const;

function inline(text: string, v: Variant, mentions: Record<string, string> | undefined, base: string): ReactNode[] {
  const s = STYLE[v];
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const tok = m[0];
    const key = `${base}-${n++}`;
    if (m[1]) {
      out.push(<code key={key} className={s.code}>{tok.slice(1, -1)}</code>);
    } else if (m[2]) {
      out.push(<strong key={key} className="font-semibold">{inline(tok.slice(2, -2), v, mentions, key)}</strong>);
    } else if (m[3]) {
      out.push(<em key={key}>{inline(tok.slice(1, -1), v, mentions, key)}</em>);
    } else if (m[4]) {
      const l = /^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/.exec(tok);
      if (l) {
        out.push(
          <a key={key} href={l[2]} target="_blank" rel="noopener noreferrer" className={s.link}>{l[1]}</a>,
        );
      }
    } else if (m[5]) {
      const e = /^<(a?):(\w+):(\d+)>$/.exec(tok);
      if (e) {
        out.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={key}
            src={emojiUrl(e[3], e[1] === "a", 48)}
            alt={`:${e[2]}:`}
            title={`:${e[2]}:`}
            loading="lazy"
            className="inline-block h-[1.3em] w-[1.3em] bg-transparent align-[-0.3em]"
          />,
        );
      }
    } else if (m[6]) {
      const id = tok.slice(3, -1);
      out.push(<span key={key} className={s.mention}>@{mentions?.[id] ?? "Rolle"}</span>);
    } else {
      out.push(
        <a key={key} href={tok} target="_blank" rel="noopener noreferrer" className={s.link}>
          {tok.replace(/^https:\/\/(www\.)?/, "")}
        </a>,
      );
    }
    last = at + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Nur die Zeilen-Auszeichnung (fett, Links, Emojis), ohne Absätze. Für Titel und Signatur. */
export function Inline({
  text,
  variant = "site",
  mentions,
}: {
  text: string;
  variant?: Variant;
  mentions?: Record<string, string>;
}) {
  return <>{inline(text, variant, mentions, "i")}</>;
}

const isFence = (l: string) => l.trim().startsWith("```");
const isHeading = (l: string) => /^#{1,3}\s+/.test(l);
const isBullet = (l: string) => /^\s*[-*]\s+/.test(l);

export default function Markdown({
  text,
  variant = "site",
  mentions,
}: {
  text: string;
  variant?: Variant;
  mentions?: Record<string, string>;
}) {
  const s = STYLE[variant];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isFence(line)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !isFence(lines[i])) buf.push(lines[i++]);
      i++;
      blocks.push(<pre key={k++} className={s.pre}>{buf.join("\n")}</pre>);
      continue;
    }

    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const Tag = (`h${level + 1}` as "h2" | "h3" | "h4");
      blocks.push(
        <Tag key={k++} className={s.h[level - 1]}>
          {inline(h[2], variant, mentions, `h${k}`)}
        </Tag>,
      );
      i++;
      continue;
    }

    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ""));
      blocks.push(
        <ul key={k++} className={s.ul}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, variant, mentions, `l${k}-${j}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !isFence(lines[i]) && !isHeading(lines[i]) && !isBullet(lines[i])) {
      buf.push(lines[i++]);
    }
    blocks.push(
      <p key={k++} className={s.p}>
        {buf.map((l, j) => (
          <span key={j}>
            {j > 0 && <br />}
            {inline(l, variant, mentions, `p${k}-${j}`)}
          </span>
        ))}
      </p>,
    );
  }

  return <>{blocks}</>;
}
