import { NextResponse, type NextRequest } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";

// Ziel des Login-Links aus der E-Mail.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const weiter = url.searchParams.get("weiter") ?? "/dashboard";
  const next = weiter.startsWith("/dashboard") ? weiter : "/dashboard";

  const supabase = await createSessionClient();
  let ok = false;

  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash) {
    ok = !(
      await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" })
    ).error;
  }

  const target = ok ? next : "/login?fehler=link";
  return NextResponse.redirect(new URL(target, url.origin));
}
