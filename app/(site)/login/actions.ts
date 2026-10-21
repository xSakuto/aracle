"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

export type LoginState = {
  step: "email" | "code";
  email: string;
  error?: string;
  info?: string;
};

function safeNext(value: FormDataEntryValue | null) {
  const v = String(value ?? "");
  return v.startsWith("/dashboard") ? v : "/dashboard";
}

async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function requestCode(
  _prev: LoginState,
  form: FormData,
): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!supabaseConfigured) {
    return { step: "email", email, error: "Der Login ist noch nicht eingerichtet. Es fehlen die Supabase-Keys." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { step: "email", email, error: "Gib eine gültige E-Mail-Adresse ein." };
  }

  const supabase = await createSessionClient();
  const { data: isTeam } = await supabase.rpc("is_team_email", { check_email: email });
  if (!isTeam) {
    return {
      step: "email",
      email,
      error: "Diese E-Mail ist keinem Teammitglied zugeordnet. Frag Joel, ob er sie im Dashboard einträgt.",
    };
  }

  const next = safeNext(form.get("weiter"));
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${await siteUrl()}/auth/callback?weiter=${encodeURIComponent(next)}`,
    },
  });
  if (error) {
    const tooMany = /rate|security purposes/i.test(error.message);
    return {
      step: "email",
      email,
      error: tooMany
        ? "Zu viele Anfragen. Warte eine Minute und versuch es nochmal."
        : `Code konnte nicht gesendet werden: ${error.message}`,
    };
  }
  return {
    step: "code",
    email,
    info: `Wir haben dir eine E-Mail an ${email} geschickt. Klick den Link darin oder gib den 6-stelligen Code ein.`,
  };
}

export async function verifyCode(
  prev: LoginState,
  form: FormData,
): Promise<LoginState> {
  const token = String(form.get("code") ?? "").replace(/\s/g, "");
  const email = String(form.get("email") ?? prev.email).trim().toLowerCase();
  prev = { ...prev, step: "code", email };
  if (!/^\d{6,8}$/.test(token)) {
    return { ...prev, error: "Der Code hat 6 Ziffern." };
  }
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) {
    return { ...prev, info: undefined, error: "Code falsch oder abgelaufen. Fordere einen neuen an." };
  }
  redirect(safeNext(form.get("weiter")));
}

export async function signOut() {
  if (supabaseConfigured) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
