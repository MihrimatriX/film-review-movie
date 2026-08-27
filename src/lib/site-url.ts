/**
 * Canonical site origin for metadata, sitemap, and robots.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://yourdomain.com).
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
  u.pathname = "";
  u.hash = "";
  u.search = "";
  return u;
}

export function siteOrigin(): string {
  return getMetadataBase().origin;
}
