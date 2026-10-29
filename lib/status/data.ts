import { SERVICES, type Service } from "@/data/status";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export const DAYS = 90;

export interface DayBar {
  day: string; // YYYY-MM-DD, Zürcher Datum
  checks: number;
  ok: number;
  /** Anteil erfolgreicher Prüfungen, null ohne Daten */
  uptime: number | null;
  avgLatency: number | null;
}

export interface Incident {
  id: number;
  service: string;
  startedAt: string;
  resolvedAt: string | null;
  detail: string;
  note: string;
}

export interface ServiceStatus extends Service {
  state: "up" | "down" | "unknown";
  lastCheck: { ok: boolean; at: string; latency: number | null; detail: string } | null;
  days: DayBar[];
  uptime90: number | null;
  openIncident: Incident | null;
}

export interface StatusOverview {
  ready: boolean;
  services: ServiceStatus[];
  incidents: Incident[];
  lastRun: string | null;
}

const zurichDay = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

function lastDays(n: number) {
  const out: string[] = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) out.push(zurichDay(new Date(now - i * 86_400_000)));
  return [...new Set(out)];
}

type CheckRow = { service: string; ok: boolean; latency_ms: number | null; detail: string; checked_at: string };
type DailyRow = { service: string; day: string; checks: number; ok_checks: number; latency_sum: number };
type IncidentRow = { id: number; service: string; started_at: string; resolved_at: string | null; detail: string; note: string };

const toIncident = (r: IncidentRow): Incident => ({
  id: r.id,
  service: r.service,
  startedAt: r.started_at,
  resolvedAt: r.resolved_at,
  detail: r.detail,
  note: r.note,
});

export async function getStatus(): Promise<StatusOverview> {
  const visible = SERVICES.filter((s) => s.public);
  const ids = visible.map((s) => s.id);
  const days = lastDays(DAYS);
  const empty = (s: Service): ServiceStatus => ({
    ...s,
    state: "unknown",
    lastCheck: null,
    days: days.map((day) => ({ day, checks: 0, ok: 0, uptime: null, avgLatency: null })),
    uptime90: null,
    openIncident: null,
  });

  if (!supabaseConfigured) return { ready: false, services: visible.map(empty), incidents: [], lastRun: null };

  try {
    const db = createPublicClient();
    const since = days[0];
    const [latest, daily, incidents] = await Promise.all([
      // Letzte Prüfung pro Dienst: die jüngsten paar Minuten reichen
      db
        .from("status_checks")
        .select("service, ok, latency_ms, detail, checked_at")
        .in("service", ids)
        .gte("checked_at", new Date(Date.now() - 30 * 60_000).toISOString())
        .order("checked_at", { ascending: false })
        .limit(ids.length * 30),
      db.from("status_daily").select("service, day, checks, ok_checks, latency_sum").in("service", ids).gte("day", since),
      db
        .from("status_incidents")
        .select("id, service, started_at, resolved_at, detail, note")
        .in("service", ids)
        .gte("started_at", new Date(Date.now() - DAYS * 86_400_000).toISOString())
        .order("started_at", { ascending: false })
        .limit(100),
    ]);
    if (latest.error || daily.error || incidents.error) throw latest.error ?? daily.error ?? incidents.error;

    const checks = (latest.data ?? []) as CheckRow[];
    const dailyRows = (daily.data ?? []) as DailyRow[];
    const inc = ((incidents.data ?? []) as IncidentRow[]).map(toIncident);

    const services = visible.map((s): ServiceStatus => {
      const last = checks.find((c) => c.service === s.id) ?? null;
      const open = inc.find((i) => i.service === s.id && !i.resolvedAt) ?? null;
      const bars = days.map((day): DayBar => {
        const r = dailyRows.find((d) => d.service === s.id && d.day === day);
        if (!r || !r.checks) return { day, checks: 0, ok: 0, uptime: null, avgLatency: null };
        return {
          day,
          checks: r.checks,
          ok: r.ok_checks,
          uptime: r.ok_checks / r.checks,
          avgLatency: r.ok_checks ? Math.round(r.latency_sum / r.ok_checks) : null,
        };
      });
      const total = bars.reduce((a, b) => a + b.checks, 0);
      const ok = bars.reduce((a, b) => a + b.ok, 0);
      return {
        ...s,
        // Ausgefallen erst, wenn eine Störung offen ist, nicht schon beim ersten Wackler
        state: open ? "down" : last ? "up" : "unknown",
        lastCheck: last ? { ok: last.ok, at: last.checked_at, latency: last.latency_ms, detail: last.detail } : null,
        days: bars,
        uptime90: total ? ok / total : null,
        openIncident: open,
      };
    });

    const lastRun = checks[0]?.checked_at ?? null;
    return { ready: true, services, incidents: inc, lastRun };
  } catch (err) {
    console.warn("Status nicht ladbar:", (err as Error).message ?? err);
    return { ready: false, services: visible.map(empty), incidents: [], lastRun: null };
  }
}
