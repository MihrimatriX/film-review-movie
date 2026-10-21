import { cookies } from "next/headers";
import { getMergedCatalogCached } from "@/lib/catalog-search";
import type { Locale } from "@/lib/i18n";
import { runSiteSearch, type SiteSearchScope } from "@/lib/site-search";

async function localeFromCookies(): Promise<Locale> {
  const jar = await cookies();
  const raw = jar.get("lang")?.value;
  return raw === "en" ? "en" : "tr";
}

const SCOPES: SiteSearchScope[] = [
  "all",
  "movies",
  "tv",
  "year",
  "actor",
  "director",
  "people",
];

function parseScope(v: string | null): SiteSearchScope {
  if (v && SCOPES.includes(v as SiteSearchScope)) return v as SiteSearchScope;
  return "all";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const scope = parseScope(searchParams.get("scope"));

  if (!q.trim()) {
    return Response.json({ movies: [], series: [], people: [] });
  }

  const locale = await localeFromCookies();
  const catalog = await getMergedCatalogCached(locale);
  const body = runSiteSearch(
    catalog.movies,
    catalog.series,
    catalog.people,
    q,
    scope,
  );

  return Response.json(body);
}
