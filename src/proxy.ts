import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    if (request.cookies.get("admin_session")?.value === "ok") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (request.cookies.get("admin_session")?.value !== "ok") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/api/admin")) {
    if (request.cookies.get("admin_session")?.value !== "ok") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
