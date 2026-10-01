/**
 * Admin oturum jetonu: `<expiresAtMs>.<hmacSha256Base64url>`.
 *
 * Web Crypto kullanır; hem Node route handler’larında hem de `proxy` (edge benzeri)
 * çalışma ortamında aynı kod doğrular. Sır, `ADMIN_SESSION_SECRET` tanımlı değilse
 * yönetici şifresinden türetilir — şifre değişince eski oturumlar geçersiz olur.
 */

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    `film-review::session::${getAdminPassword()}`
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  let bin = "";
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(
    await crypto.subtle.sign("HMAC", key, encoder.encode(payload)),
  );
}

/** Uzunluk sızdırmadan sabit zamanlı karşılaştırma. */
export function safeEqual(a: string, b: string): boolean {
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

export async function createSessionToken(
  maxAgeSeconds = SESSION_MAX_AGE_SECONDS,
): Promise<string> {
  const expires = String(Date.now() + maxAgeSeconds * 1000);
  return `${expires}.${await sign(expires)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expires = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expMs = Number(expires);
  if (!Number.isFinite(expMs) || expMs < Date.now()) return false;
  return safeEqual(sig, await sign(expires));
}
