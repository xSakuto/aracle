import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  supabaseConfigured,
} from "@/lib/supabase/config";

// Hält die Login-Session frisch und schützt /dashboard.
export async function middleware(request: NextRequest) {
  if (!supabaseConfigured) {
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getClaims() erneuert eine abgelaufene Session und prüft das Token wenn möglich lokal,
  // ohne zusätzliche Anfrage an Supabase. Die verbindliche Prüfung macht requireMember().
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims ?? null;

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("weiter", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/auth/:path*"],
};
