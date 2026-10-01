import { COOKIE, getAdminPassword } from "@/lib/auth";
import {
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  safeEqual,
} from "@/lib/session-token";
import { NextResponse } from "next/server";

/** Basit, süreç içi kaba-kuvvet freni: IP başına pencere içinde sınırlı deneme. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (
    fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local"
  );
}

function isLimited(key: string): number {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) return 0;
  return entry.count >= MAX_ATTEMPTS ? entry.resetAt - now : 0;
}

function recordFailure(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const waitMs = isLimited(key);
  if (waitMs > 0) {
    return NextResponse.json(
      { error: "Too many attempts" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(waitMs / 1000)) },
      },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body.password !== "string" ||
    !safeEqual(body.password, getAdminPassword())
  ) {
    recordFailure(key);
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  attempts.delete(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
