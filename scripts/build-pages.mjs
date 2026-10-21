/**
 * GitHub Pages için statik derleme.
 * Kullanim: npm run build:pages   (çıktı: pages-dist/)
 *
 * - Türkçe site kökte, İngilizce kopya `/en` altında; dil düğmesi ikisi arasında geçer.
 * - Admin paneli ve API route'ları sunucu gerektirir; derleme süresince kenara alınır.
 * - PAGES_BASE_PATH (varsayılan `/film-review-movie`), NEXT_PUBLIC_SITE_URL ve TMDB_API_KEY
 *   ortamdan okunur. TMDB anahtarı yoksa site yerel `data/` verileriyle çıkar.
 */

import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const base = (process.env.PAGES_BASE_PATH ?? "/film-review-movie").replace(/\/+$/, "");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
const dist = join(root, "pages-dist");
const stash = join(root, ".pages-stash");
const serverOnly = ["src/app/admin", "src/app/api", "src/proxy.ts"];

function build(locale, basePath) {
  rmSync(join(root, ".next"), { recursive: true, force: true });
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "1",
      STATIC_LOCALE: locale,
      STATIC_ROOT: base,
      BASE_PATH: basePath,
      ...(siteUrl
        ? { NEXT_PUBLIC_SITE_URL: siteUrl + basePath.slice(base.length) }
        : {}),
    },
  });
}

rmSync(dist, { recursive: true, force: true });
rmSync(stash, { recursive: true, force: true });
mkdirSync(stash);

const moved = [];
try {
  for (const rel of serverOnly) {
    if (!existsSync(join(root, rel))) continue;
    const to = join(stash, rel.replaceAll("/", "__"));
    renameSync(join(root, rel), to);
    moved.push([to, join(root, rel)]);
  }

  build("tr", base);
  cpSync(join(root, "out"), dist, { recursive: true });

  build("en", `${base}/en`);
  cpSync(join(root, "out"), join(dist, "en"), { recursive: true });
} finally {
  for (const [from, to] of moved) renameSync(from, to);
  rmSync(stash, { recursive: true, force: true });
}

console.log(`\nGitHub Pages çıktısı hazır: ${dist}`);
