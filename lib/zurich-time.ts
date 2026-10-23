// Formularzeiten sind Schweizer Ortszeit, gespeichert wird UTC.

const TZ = "Europe/Zurich";

function parts(ts: number) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return Object.fromEntries(fmt.formatToParts(new Date(ts)).map((p) => [p.type, p.value])) as Record<string, string>;
}

function offsetMs(ts: number) {
  const p = parts(ts);
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUtc - Math.floor(ts / 1000) * 1000;
}

/** "2026-10-23T14:30" in Zürcher Ortszeit zu einem ISO-Zeitpunkt in UTC. */
export function zurichLocalToIso(value: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!m) return null;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  let ts = guess - offsetMs(guess);
  const second = offsetMs(ts);
  if (second !== guess - ts) ts = guess - second;
  const date = new Date(ts);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** ISO-Zeitpunkt zu "2026-10-23T14:30" in Zürcher Ortszeit, für das Eingabefeld. */
export function isoToZurichLocal(iso: string): string {
  const p = parts(new Date(iso).getTime());
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
