/**
 * TMDB API anahtarini ve ag baglantisini hizlica dogrular.
 * Kullanim: npm run tmdb:test
 *
 * .env.local ve .env dosyalarini proje kokunden okur (yoksa yalnizca ortam degiskenleri).
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(name) {
  const p = resolve(process.cwd(), name);
  if (!existsSync(p)) return;
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const key =
  process.env.TMDB_API_KEY?.trim() ||
  process.env.NEXT_PUBLIC_TMDB_API_KEY?.trim();

if (!key) {
  console.error(
    "[TMDB test] Anahtar yok. .env.local icine TMDB_API_KEY=... ekleyin.\n" +
    "(Alternatif: NEXT_PUBLIC_TMDB_API_KEY)",
  );
  process.exit(1);
}

if (key.length <= 8) {
  console.warn(
    "[TMDB test] Uyari: anahtar cok kisa gorunuyor; gecersiz olabilir.",
  );
}

const url = `https://api.themoviedb.org/3/configuration?api_key=${encodeURIComponent(key)}`;

try {
  const res = await fetch(url, { method: "GET" });
  const bodyText = await res.text();
  if (!res.ok) {
    console.error(
      `[TMDB test] HTTP ${res.status} ${res.statusText}\n`,
      bodyText.slice(0, 500),
    );
    process.exit(1);
  }
  let json;
  try {
    json = JSON.parse(bodyText);
  } catch {
    console.error("[TMDB test] Gecersiz JSON yaniti");
    process.exit(1);
  }
  console.log("[TMDB test] Basarili — API anahtari calisiyor.");
  console.log("Ornek: images.base_url =", json?.images?.secure_base_url ?? json?.images?.base_url ?? "(yok)");
} catch (e) {
  const msg =
    e instanceof Error && e.cause instanceof Error
      ? `${e.message} | ${e.cause.message}`
      : e instanceof Error
        ? e.message
        : String(e);
  console.error("[TMDB test] Istek basarisiz:", msg);
  console.error("Proxy (HTTPS_PROXY), guvenlik duvari veya DNS kontrol edin.");
  process.exit(1);
}
