export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Ohne Keys läuft die Seite weiter mit den statischen Daten aus /data.
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
