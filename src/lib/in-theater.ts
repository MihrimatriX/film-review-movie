import { readMovies } from "@/lib/data-file";
import { moviesFromTmdbResults } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import type { Movie } from "@/lib/types";
import {
  tmdbPopularMovies,
  tmdbTopRatedMovies,
  tmdbTrendingMovies,
  tmdbUpcomingMovies,
} from "@/lib/tmdb";

export type InTheaterTabSets = {
  popular: Movie[];
  upcoming: Movie[];
  topRated: Movie[];
  trending: Movie[];
};

function sliceN(list: Movie[], n: number) {
  return list.slice(0, n);
}

function dedupeFallback(fallback: Movie[], tab: Movie[]): Movie[] {
  if (tab.length >= 6) return tab;
  const seen = new Set(tab.map((m) => m.slug));
  const extra = fallback.filter((m) => !seen.has(m.slug));
  return [...tab, ...extra].slice(0, 12);
}

export async function getInTheaterTabSets(
  locale: Locale,
  limit = 12,
): Promise<InTheaterTabSets> {
  const local = await readMovies();
  const fb = sliceN(local, limit);

  const [pop, up, top, tr] = await Promise.all([
    tmdbPopularMovies(locale),
    tmdbUpcomingMovies(locale),
    tmdbTopRatedMovies(locale),
    tmdbTrendingMovies(locale),
  ]);

  const hasApi =
    pop?.results?.length ||
    up?.results?.length ||
    top?.results?.length ||
    tr?.results?.length;

  if (!hasApi) {
    return {
      popular: fb,
      upcoming: fb,
      topRated: fb,
      trending: fb,
    };
  }

  const popular = sliceN(moviesFromTmdbResults(pop?.results ?? []), limit);
  const upcoming = sliceN(moviesFromTmdbResults(up?.results ?? []), limit);
  const topRated = sliceN(moviesFromTmdbResults(top?.results ?? []), limit);
  const trending = sliceN(moviesFromTmdbResults(tr?.results ?? []), limit);

  return {
    popular: dedupeFallback(fb, popular),
    upcoming: dedupeFallback(fb, upcoming),
    topRated: dedupeFallback(fb, topRated),
    trending: dedupeFallback(fb, trending),
  };
}
