/**
 * Canonical site root for metadata, sitemap, and robots.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://yourdomain.com).
 * A path is kept, so GitHub Pages project sites work (https://user.github.io/repo).
 */
export function getMetadataBase(): URL {
  let raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw.replace(/^\/+/, "")}`;
  }
  const u = new URL(raw);
  u.pathname = u.pathname.replace(/\/+$/, "") + "/";
  u.hash = "";
  u.search = "";
  return u;
}

/** Site root without trailing slash (origin + optional base path). */
export function siteOrigin(): string {
  return getMetadataBase().href.replace(/\/$/, "");
}

/** `public/` varlıklarına basePath ekler (next/image ve <img> bunu kendisi yapmaz). */
export function withBase(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

/** Düz `<form action>` / `<a href>` için sayfa yolu: basePath + statik export'ta sondaki `/`. */
export function pageHref(path: string): string {
  const slash =
    process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" && !path.endsWith("/") ? "/" : "";
  return withBase(path) + slash;
}

export function siteUrl(pathname = "/"): string {
  return new URL(pathname.replace(/^\/+/, ""), getMetadataBase()).toString();
}
