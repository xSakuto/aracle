import { createHash, createHmac } from "node:crypto";
import { createSessionClient } from "@/lib/supabase/server";

// Aufrufe an die Schnittstelle des Discord-Bots (Tunnel auf dem Heimserver).
// Jede Anfrage wird mit einem Geheimnis signiert, das nur eingeloggte Admins aus der Datenbank bekommen.

const BASE = process.env.BOT_API_URL ?? "https://bot.aracle.ch";

export class BotApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function secret(): Promise<string> {
  if (process.env.BOT_API_SECRET) return process.env.BOT_API_SECRET; // nur für lokale Entwicklung
  const supabase = await createSessionClient();
  const { data, error } = await supabase.rpc("get_bot_api_secret");
  if (error || !data) throw new BotApiError("Der Zugang zum Bot ist nicht eingerichtet.", 500);
  return data as string;
}

export async function botFetch<T>(
  path: string,
  opts: { method?: "GET" | "POST"; body?: unknown; user: string },
): Promise<T> {
  const method = opts.method ?? "GET";
  const body = opts.body === undefined ? "" : JSON.stringify(opts.body);
  const ts = String(Math.floor(Date.now() / 1000));
  const bodyHash = createHash("sha256").update(body).digest("hex");
  const sig = createHmac("sha256", await secret()).update(`${ts}\n${method}\n${path}\n${bodyHash}`).digest("hex");

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      body: body || undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
      headers: {
        "Content-Type": "application/json",
        "X-Site-Ts": ts,
        "X-Site-Sig": sig,
        "X-Site-User": opts.user,
      },
    });
  } catch {
    throw new BotApiError("Der Bot ist gerade nicht erreichbar.", 503);
  }

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // Keine JSON-Antwort, zum Beispiel eine Fehlerseite des Tunnels
  }
  if (!res.ok) {
    const msg = (json as { error?: string } | null)?.error;
    throw new BotApiError(msg ?? `Der Bot hat mit Fehler ${res.status} geantwortet.`, res.status);
  }
  return json as T;
}

export * from "@/lib/bot-types";
