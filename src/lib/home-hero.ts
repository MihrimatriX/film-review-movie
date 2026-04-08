import type { Locale } from "@/lib/i18n";
import type { Movie } from "@/lib/types";
import {
  tmdbBackdrop,
  tmdbMovieDetails,
  tmdbMovieGenreList,
  tmdbPoster,
  tmdbSlug,
  tmdbTrendingMovies,
} from "@/lib/tmdb";

export type HeroSlide = {
  key: string;
  href: string;
  src: string;
  title: string;
  tag: string;
  rating: string;
};

export type FeaturedHeroMovie = {
  slug: string;
  title: string;
  year: string;
  genres: string[];
  rating: string;
  runtimeLabel: string;
  ratedLabel: string;
  releaseLabel: string;
  posterUrl: string;
  backdropUrl: string;
};

function toDisplayRating(vote: number) {
  return (Math.round(vote * 10) / 10).toFixed(1);
}

function formatRuntimeMinutes(minutes: number | undefined, locale: Locale) {
  if (!minutes || minutes < 1) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (locale === "tr") return `${h}s ${m}dk`;
  return `${h}h ${m}m`;
}

function certificationFromDetails(
  details: Awaited<ReturnType<typeof tmdbMovieDetails>>,
  locale: Locale,
) {
  if (!details?.release_dates?.results) return "";
  const prefer = locale === "tr" ? "TR" : "US";
  const row =
    details.release_dates.results.find((r) => r.iso_3166_1 === prefer) ||
    details.release_dates.results.find((r) => r.iso_3166_1 === "US") ||
    details.release_dates.results[0];
  const cert = row?.release_dates?.find((d) => d.certification)?.certification;
  return cert || "";
}

function releaseDisplay(date: string | undefined, locale: Locale) {
  if (!date) return "";
  try {
    const d = new Date(date);
    return d.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

async function genreIdToName(locale: Locale) {
  const data = await tmdbMovieGenreList(locale);
  const map = new Map<number, string>();
  for (const g of data?.genres ?? []) map.set(g.id, g.name);
  return map;
}

export async function fetchHeroSlides(
  locale: Locale,
  limit = 5,
): Promise<HeroSlide[] | null> {
  const [trending, genreMap] = await Promise.all([
    tmdbTrendingMovies(locale),
    genreIdToName(locale),
  ]);
  if (!trending?.results?.length) return null;

  const slides: HeroSlide[] = [];
  const fallbackTag = locale === "en" ? "Movie" : "Film";
  for (const m of trending.results) {
    if (!m.poster_path) continue;
    const gid = m.genre_ids?.[0];
    const tag =
      gid != null && genreMap.has(gid) ? genreMap.get(gid)! : fallbackTag;
    slides.push({
      key: `tmdb-${m.id}`,
      href: `/movies/${tmdbSlug("movie", m.id, m.title)}`,
      src: tmdbPoster(m.poster_path, "w500"),
      title: m.title,
      tag,
      rating: toDisplayRating(m.vote_average),
    });
    if (slides.length >= limit) break;
  }
  return slides.length ? slides : null;
}

function slidesFromLocal(
  movies: Movie[],
  limit: number,
  locale: Locale,
): HeroSlide[] {
  const fallbackTag = locale === "en" ? "Featured" : "Öne çıkan";
  return movies.slice(0, limit).map((m) => ({
    key: m.slug,
    href: `/movies/${m.slug}`,
    src: m.poster,
    title: m.title,
    tag: m.genres[0] ?? fallbackTag,
    rating: toDisplayRating(m.rating),
  }));
}

export async function getHeroSliderData(
  locale: Locale,
  localMovies: Movie[],
  limit = 5,
): Promise<HeroSlide[]> {
  const fromApi = await fetchHeroSlides(locale, limit);
  if (fromApi?.length) return fromApi;
  return slidesFromLocal(localMovies, limit, locale);
}

function featuredFromLocal(m: Movie, locale: Locale): FeaturedHeroMovie {
  const runtimeRaw = m.runtime?.replace(/\s*min\s*$/i, "").trim();
  const runtimeNum = runtimeRaw ? Number(runtimeRaw) : NaN;
  const runtimeLabel = Number.isFinite(runtimeNum)
    ? formatRuntimeMinutes(runtimeNum, locale)
    : m.runtime || "";
  return {
    slug: m.slug,
    title: m.title,
    year: String(m.year),
    genres: m.genres.slice(0, 4),
    rating: toDisplayRating(m.rating),
    runtimeLabel,
    ratedLabel: m.mpaa || "",
    releaseLabel: m.releaseLabel || String(m.year),
    posterUrl: m.poster,
    backdropUrl: m.poster,
  };
}

export async function getFeaturedHeroMovie(
  locale: Locale,
  localFallback: Movie | null,
): Promise<FeaturedHeroMovie | null> {
  const trending = await tmdbTrendingMovies(locale);
  const first = trending?.results?.find((m) => m.poster_path);
  if (!first) {
    return localFallback ? featuredFromLocal(localFallback, locale) : null;
  }

  const details = await tmdbMovieDetails(locale, first.id);
  if (!details) {
    return {
      slug: tmdbSlug("movie", first.id, first.title),
      title: first.title,
      year: first.release_date?.slice(0, 4) || "",
      genres: [],
      rating: toDisplayRating(first.vote_average),
      runtimeLabel: "",
      ratedLabel: "",
      releaseLabel: releaseDisplay(first.release_date, locale),
      posterUrl: tmdbPoster(first.poster_path, "w780"),
      backdropUrl:
        tmdbBackdrop(first.backdrop_path, "w1280") ||
        tmdbPoster(first.poster_path, "w780"),
    };
  }

  const genres = details.genres?.map((g) => g.name) ?? [];
  const rated = certificationFromDetails(details, locale);
  const runtimeStr = formatRuntimeMinutes(details.runtime, locale);

  return {
    slug: tmdbSlug("movie", details.id, details.title),
    title: details.title,
    year: details.release_date?.slice(0, 4) || "",
    genres: genres.slice(0, 4),
    rating: toDisplayRating(details.vote_average),
    runtimeLabel: runtimeStr,
    ratedLabel: rated,
    releaseLabel: releaseDisplay(details.release_date, locale),
    posterUrl: tmdbPoster(details.poster_path, "w780"),
    backdropUrl:
      tmdbBackdrop(details.backdrop_path, "w1280") ||
      tmdbPoster(details.poster_path, "w780"),
  };
}
