import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isTrainer = user?.email?.toLowerCase().endsWith("@adaptig.com") ?? false;

  // ── Unauthenticated users ──
  if (!user) {
    // Block access to protected areas
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/portal")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Allow /join, /login, /signup, /
    return supabaseResponse;
  }

  // ── Authenticated users ──

  // Redirect away from auth pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/join") {
    const url = request.nextUrl.clone();
    url.pathname = isTrainer ? "/dashboard" : "/portal";
    return NextResponse.redirect(url);
  }

  // Trainers trying to access /portal → redirect to /dashboard
  if (isTrainer && pathname.startsWith("/portal")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Clients trying to access /dashboard → redirect to /portal
  if (!isTrainer && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
