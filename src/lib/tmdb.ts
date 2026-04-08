import type { Locale } from "@/lib/i18n";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

export type TmdbMedia = "movie" | "tv" | "person";

export function tmdbSlug(
  prefix: "movie" | "tv" | "person",
  id: number,
  title: string,
) {
  const safe = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `tmdb-${prefix}-${id}${safe ? `-${safe}` : ""}`;
}

export function isTmdbSlug(slug: string) {
  return (
    slug.startsWith("tmdb-movie-") ||
    slug.startsWith("tmdb-tv-") ||
    slug.startsWith("tmdb-person-")
  );
}

export function tmdbIdFromSlug(
  slug: string,
): { type: TmdbMedia; id: number } | null {
  const m = slug.match(/^tmdb-(movie|tv|person)-(\d+)(?:-|$)/);
  if (!m) return null;
  return { type: m[1] as TmdbMedia, id: Number(m[2]) };
}

function getApiKey() {
  const k =
    process.env.TMDB_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY?.trim();
  return k || undefined;
}

/** Sunucuda .env içinde geçerli TMDB anahtarı var mı (canlı veri için). */
export function isTmdbConfigured(): boolean {
  const k = getApiKey();
  return Boolean(k && k.length > 8);
}

async function tmdbFetch<T>(
  path: string,
  {
    locale,
    revalidateSeconds = 60 * 60,
    searchParams,
  }: {
    locale: Locale;
    revalidateSeconds?: number;
    searchParams?: Record<string, string | number | undefined>;
  },
): Promise<T | null> {
  const key = getApiKey();
  if (!key) return null;

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", locale === "tr" ? "tr-TR" : "en-US");
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      const detail =
        err instanceof Error && err.cause instanceof Error
          ? `${err.message} (${err.cause.message})`
          : err instanceof Error
            ? err.message
            : String(err);
      console.warn(`[TMDB] fetch failed ${path}:`, detail);
    }
    return null;
  }
}

export function tmdbPoster(
  path: string | null | undefined,
  size: "w342" | "w500" | "w780" = "w500",
) {
  if (!path) return "";
  return `${TMDB_IMG}/${size}${path}`;
}

export function tmdbBackdrop(
  path: string | null | undefined,
  size: "w780" | "w1280" | "original" = "w1280",
) {
  if (!path) return "";
  if (size === "original") return `${TMDB_IMG}/original${path}`;
  return `${TMDB_IMG}/${size}${path}`;
}

export function tmdbProfile(
  path: string | null | undefined,
  size: "w185" | "w342" | "h632" = "w342",
) {
  if (!path) return "";
  return `${TMDB_IMG}/${size}${path}`;
}

type TmdbPaged<T> = {
  results: T[];
  page?: number;
  total_pages?: number;
  total_results?: number;
};

export type TmdbDiscoverMovieResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
  popularity?: number;
};

type TmdbTv = {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path?: string | null;
  popularity?: number;
  genre_ids?: number[];
};

type TmdbPerson = {
  id: number;
  name: string;
  known_for_department?: string;
  profile_path: string | null;
  popularity?: number;
  gender?: number;
};

type TmdbReleaseDates = {
  results: {
    iso_3166_1: string;
    release_dates: { certification: string }[];
  }[];
};

export type TmdbMovieDetails = TmdbMovie & {
  original_title?: string;
  tagline?: string;
  vote_count?: number;
  budget?: number;
  revenue?: number;
  homepage?: string | null;
  status?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  release_dates?: TmdbReleaseDates;
  production_companies?: { name: string }[];
  production_countries?: { name: string }[];
  spoken_languages?: { name: string }[];
  credits?: {
    cast?: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order?: number;
    }[];
    crew?: { id: number; name: string; job: string; department?: string }[];
  };
  videos?: {
    results: {
      key: string;
      name: string;
      site: string;
      type: string;
      official?: boolean;
    }[];
  };
  keywords?: { keywords?: { id: number; name: string }[] };
  external_ids?: { imdb_id?: string | null };
};

export type TmdbTvDetails = TmdbTv & {
  original_name?: string;
  tagline?: string;
  vote_count?: number;
  popularity?: number;
  last_air_date?: string;
  homepage?: string | null;
  status?: string;
  genres?: { name: string }[];
  episode_run_time?: number[];
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
  credits?: {
    cast?: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew?: { id: number; name: string; job: string; department?: string }[];
  };
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by?: { id: number; name: string; profile_path: string | null }[];
  networks?: { name: string }[];
  videos?: {
    results: {
      key: string;
      name: string;
      site: string;
      type: string;
      official?: boolean;
    }[];
  };
  /** append_to_response keywords for TV */
  keywords?: { results?: { id: number; name: string }[] };
  external_ids?: { imdb_id?: string | null };
};

export type TmdbPersonDetails = TmdbPerson & {
  biography?: string;
  place_of_birth?: string;
  birthday?: string;
  deathday?: string | null;
};

export async function tmdbTrendingMovies(locale: Locale) {
  return tmdbFetch<TmdbPaged<TmdbMovie>>("/trending/movie/week", {
    locale,
    revalidateSeconds: 60 * 30,
  });
}

export async function tmdbMovieGenreList(locale: Locale) {
  return tmdbFetch<{ genres: { id: number; name: string }[] }>(
    "/genre/movie/list",
    {
      locale,
      revalidateSeconds: 60 * 60 * 24,
    },
  );
}

export async function tmdbPopularMovies(locale: Locale) {
  return tmdbFetch<TmdbPaged<TmdbMovie>>("/movie/popular", {
    locale,
    revalidateSeconds: 60 * 30,
  });
}

/** Paginated discover (TMDB caps at page 500). Default sort: popularity. */
export async function tmdbDiscoverMovies(locale: Locale, page: number) {
  const p = Math.max(1, Math.min(500, Math.floor(page)));
  return tmdbFetch<TmdbDiscoverMovieResponse>("/discover/movie", {
    locale,
    revalidateSeconds: 60 * 15,
    searchParams: {
      page: p,
      sort_by: "popularity.desc",
      include_adult: "false",
    },
  });
}

export async function tmdbUpcomingMovies(locale: Locale) {
  return tmdbFetch<TmdbPaged<TmdbMovie>>("/movie/upcoming", {
    locale,
    revalidateSeconds: 60 * 30,
  });
}

export async function tmdbTopRatedMovies(locale: Locale) {
  return tmdbFetch<TmdbPaged<TmdbMovie>>("/movie/top_rated", {
    locale,
    revalidateSeconds: 60 * 60,
  });
}

const MOVIE_APPEND = "credits,release_dates,videos,keywords,external_ids";

export async function tmdbMovieDetails(locale: Locale, id: number) {
  return tmdbFetch<TmdbMovieDetails>(`/movie/${id}`, {
    locale,
    revalidateSeconds: 60 * 60,
    searchParams: { append_to_response: MOVIE_APPEND },
  });
}

export async function tmdbPopularTv(locale: Locale, page = 1) {
  const p = Math.max(1, Math.floor(page));
  return tmdbFetch<TmdbPaged<TmdbTv>>("/tv/popular", {
    locale,
    revalidateSeconds: 60 * 30,
    searchParams: { page: p },
  });
}

const TV_APPEND = "credits,content_ratings,videos,keywords,external_ids";

export async function tmdbTvDetails(locale: Locale, id: number) {
  return tmdbFetch<TmdbTvDetails>(`/tv/${id}`, {
    locale,
    revalidateSeconds: 60 * 60,
    searchParams: { append_to_response: TV_APPEND },
  });
}

export async function tmdbPopularPeople(locale: Locale, page = 1) {
  const p = Math.max(1, Math.floor(page));
  return tmdbFetch<TmdbPaged<TmdbPerson>>("/person/popular", {
    locale,
    revalidateSeconds: 60 * 60,
    searchParams: { page: p },
  });
}

export async function tmdbTvGenreList(locale: Locale) {
  return tmdbFetch<{ genres: { id: number; name: string }[] }>(
    "/genre/tv/list",
    { locale, revalidateSeconds: 60 * 60 * 24 },
  );
}

export async function tmdbPersonDetails(locale: Locale, id: number) {
  return tmdbFetch<TmdbPersonDetails>(`/person/${id}`, {
    locale,
    revalidateSeconds: 60 * 60,
  });
}
