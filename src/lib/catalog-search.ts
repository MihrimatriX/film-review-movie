import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n";
import {
  getMoviesMerged,
  getSeriesMerged,
  getCelebritiesMerged,
} from "@/lib/catalog";
import type { Celebrity, Movie, Series } from "@/lib/types";

export type MergedCatalog = {
  movies: Movie[];
  series: Series[];
  people: Celebrity[];
};

const getMergedCatalogData = unstable_cache(
  async (locale: Locale): Promise<MergedCatalog> => {
    const [movies, series, people] = await Promise.all([
      getMoviesMerged(locale),
      getSeriesMerged(locale),
      getCelebritiesMerged(locale),
    ]);
    return { movies, series, people };
  },
  ["site-merged-catalog"],
  { revalidate: 180 },
);

/** Short-TTL cache so header typeahead does not hit TMDB on every keystroke. */
export function getMergedCatalogCached(locale: Locale): Promise<MergedCatalog> {
  return getMergedCatalogData(locale);
}
