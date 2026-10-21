import { getMergedCatalogCached } from "@/lib/catalog-search";
import { getLocale } from "@/lib/i18n-server";

/**
 * Statik katalog: GitHub Pages'te `/api/search` ve `/api/surprise` olmadığı için
 * başlık araması ve “Bana sürpriz yap” bu dosyayı indirip istemcide çalışır.
 */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await getMergedCatalogCached(await getLocale()));
}
