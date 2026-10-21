import type { MergedCatalog } from "@/lib/catalog-search";
import type { Movie, SurprisePick } from "@/lib/types";

/** GitHub Pages derlemesi: sunucu API'si yok, veriler `catalog.json`'dan gelir. */
export const IS_STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

let pending: Promise<MergedCatalog> | null = null;

/** Katalog dosyasını bir kez indirir; hata olursa sonraki çağrı yeniden dener. */
export function loadStaticCatalog(): Promise<MergedCatalog> {
  pending ??= fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/catalog.json`)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<MergedCatalog>;
    })
    .catch((e) => {
      pending = null;
      throw e;
    });
  return pending;
}

/** “Bana sürpriz yap” ruleti için karıştırılmış film örneklemi (Fisher–Yates). */
export function pickSurprise(movies: Movie[], count = 14): SurprisePick[] {
  const pool = movies.filter((m) => m.poster);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map((m) => ({
    slug: m.slug,
    title: m.title,
    poster: m.poster,
    year: m.year,
    rating: m.rating,
    genres: m.genres.slice(0, 3),
    synopsis: m.synopsis,
  }));
}
