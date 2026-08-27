import type { Celebrity, Movie, Series } from "@/lib/types";

export type MovieSortMode = "featured" | "rating" | "year" | "title";

export type CelebritySortMode = "featured" | "name-asc" | "name-desc";

export type SeriesSortMode = "featured" | "rating" | "year" | "title";

export function parseMovieSort(v: string | undefined | null): MovieSortMode {
  if (v === "rating" || v === "year" || v === "title") return v;
  return "featured";
}

export function parseCelebritySort(
  v: string | undefined | null,
): CelebritySortMode {
  if (v === "name-asc" || v === "name-desc") return v;
  return "featured";
}

export function parseSeriesSort(v: string | undefined | null): SeriesSortMode {
  if (v === "rating" || v === "year" || v === "title") return v;
  return "featured";
}

export function parseYearParam(
  v: string | undefined | null,
): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function parseMinRating(
  v: string | undefined | null,
): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function parseListPage(v: string | undefined | null): number {
  if (v == null || v === "") return 1;
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

const ALLOWED_PAGE_SIZES = [12, 24, 48] as const;

export function parseListPageSize(v: string | undefined | null): number {
  if (v == null || v === "") return 24;
  const n = Number(v);
  if (!Number.isFinite(n)) return 24;
  return ALLOWED_PAGE_SIZES.includes(n as (typeof ALLOWED_PAGE_SIZES)[number])
    ? n
    : 24;
}

export function listingPageSizeOptions(): readonly number[] {
  return ALLOWED_PAGE_SIZES;
}

export function paginateList<T>(
  items: T[],
  page: number,
  pageSize: number,
): T[] {
  const p = Math.max(1, page);
  const ps = Math.max(1, pageSize);
  const start = (p - 1) * ps;
  return items.slice(start, start + ps);
}

export function listingTotalPages(
  totalItems: number,
  pageSize: number,
): number {
  if (totalItems <= 0) return 1;
  return Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
}

export type SearchParamsLike =
  | Record<string, string | string[] | undefined>
  | undefined;

export function listingHref(
  pathname: string,
  sp: SearchParamsLike,
  preserveKeys: readonly string[],
  patch: Record<string, string | undefined>,
): string {
  const q = new URLSearchParams();
  for (const key of preserveKeys) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) continue;
    const v = pickSearchParam(sp, key);
    if (v != null && v !== "") q.set(key, v);
  }
  for (const [key, val] of Object.entries(patch)) {
    if (val != null && val !== "") q.set(key, val);
  }
  const s = q.toString();
  return s ? `${pathname}?${s}` : pathname;
}

/** TMDB: 1 kadın, 2 erkek, 3 non-binary */
export function parseGenderFilter(
  v: string | undefined | null,
): number | undefined {
  if (v == null || v === "" || v === "any") return undefined;
  const n = Number(v);
  if (n === 1 || n === 2 || n === 3) return n;
  return undefined;
}

export function celebrityComputedAge(c: Celebrity): number | undefined {
  const b = c.birthday?.trim();
  if (!b || !/^\d{4}/.test(b)) return undefined;
  const birth = new Date(b);
  if (Number.isNaN(birth.getTime())) return undefined;
  const death = c.deathday?.trim();
  const end =
    death && death.length >= 4 && !Number.isNaN(new Date(death).getTime())
      ? new Date(death)
      : new Date();
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
  if (age < 0 || age > 120) return undefined;
  return age;
}

function celebrityLocaleText(c: Celebrity): string {
  return [c.country, c.placeOfBirth].filter(Boolean).join(" ").toLowerCase();
}

function moviePopularityScore(m: Movie): number {
  if (m.popularity != null && m.popularity > 0) return m.popularity;
  return m.rating * 15 + m.year * 0.001;
}

export function sortMovies(movies: Movie[], mode: MovieSortMode): Movie[] {
  const copy = [...movies];
  switch (mode) {
    case "rating":
      return copy.sort(
        (a, b) =>
          b.rating - a.rating ||
          b.year - a.year ||
          a.title.localeCompare(b.title),
      );
    case "year":
      return copy.sort(
        (a, b) =>
          b.year - a.year ||
          b.rating - a.rating ||
          a.title.localeCompare(b.title),
      );
    case "title":
      return copy.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      );
    case "featured":
    default:
      return copy.sort(
        (a, b) =>
          moviePopularityScore(b) - moviePopularityScore(a) ||
          b.rating - a.rating,
      );
  }
}

export function filterMovies(
  movies: Movie[],
  filters: {
    q?: string;
    fromYear?: number;
    toYear?: number;
    minRating?: number;
    genre?: string;
    director?: string;
    stars?: string;
  },
): Movie[] {
  const q = filters.q?.trim().toLowerCase();
  const genreNeedle = filters.genre?.trim().toLowerCase();
  const dirNeedle = filters.director?.trim().toLowerCase();
  const starsNeedle = filters.stars?.trim().toLowerCase();
  return movies.filter((m) => {
    if (filters.fromYear != null && m.year < filters.fromYear) return false;
    if (filters.toYear != null && m.year > filters.toYear) return false;
    if (filters.minRating != null && m.rating < filters.minRating) return false;
    if (genreNeedle) {
      const hit = m.genres.some((g) => g.toLowerCase() === genreNeedle);
      if (!hit) return false;
    }
    if (dirNeedle) {
      if (!m.director?.toLowerCase().includes(dirNeedle)) return false;
    }
    if (starsNeedle) {
      if (!m.stars?.toLowerCase().includes(starsNeedle)) return false;
    }
    if (q) {
      const inTitle = m.title.toLowerCase().includes(q);
      const inSyn = m.synopsis.toLowerCase().includes(q);
      if (!inTitle && !inSyn) return false;
    }
    return true;
  });
}

export function pickSearchParam(
  sp: Record<string, string | string[] | undefined> | undefined,
  key: string,
): string | undefined {
  if (!sp) return undefined;
  const v = sp[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

export function yearBoundsFromMovies(movies: Movie[]): {
  min: number;
  max: number;
} {
  const y = new Date().getFullYear();
  if (!movies.length) return { min: 1950, max: y };
  let min = Infinity;
  let max = -Infinity;
  for (const m of movies) {
    if (m.year < min) min = m.year;
    if (m.year > max) max = m.year;
  }
  return {
    min: Number.isFinite(min) ? min : 1950,
    max: Number.isFinite(max) ? max : y,
  };
}

export function uniqueMovieGenres(movies: Movie[]): string[] {
  const set = new Set<string>();
  for (const m of movies) {
    for (const g of m.genres) {
      if (g.trim()) set.add(g);
    }
  }
  return [...set].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

export function yearBoundsFromSeries(series: Series[]): {
  min: number;
  max: number;
} {
  const y = new Date().getFullYear();
  if (!series.length) return { min: 1990, max: y };
  let min = Infinity;
  let max = -Infinity;
  for (const s of series) {
    const sy = seriesStartYear(s);
    if (sy <= 0) continue;
    if (sy < min) min = sy;
    if (sy > max) max = sy;
  }
  return {
    min: Number.isFinite(min) ? min : 1990,
    max: Number.isFinite(max) ? max : y,
  };
}

export function uniqueSeriesGenres(series: Series[]): string[] {
  const set = new Set<string>();
  for (const s of series) {
    for (const g of s.genres) {
      if (g.trim()) set.add(g);
    }
  }
  return [...set].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/** Ülke / doğum yeri son segmenti — select seçenekleri için. */
export function uniqueCelebrityCountryHints(list: Celebrity[]): string[] {
  const set = new Set<string>();
  for (const c of list) {
    if (c.country?.trim()) set.add(c.country.trim());
    const pob = c.placeOfBirth?.trim();
    if (pob) {
      const last = pob.split(",").pop()?.trim();
      if (last) set.add(last);
    }
  }
  return [...set].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

export function applyMovieListing(
  movies: Movie[],
  sp: Record<string, string | string[] | undefined> | undefined,
): Movie[] {
  const sort = parseMovieSort(pickSearchParam(sp, "sort"));
  const filtered = filterMovies(movies, {
    q: pickSearchParam(sp, "q"),
    fromYear: parseYearParam(pickSearchParam(sp, "fromYear")),
    toYear: parseYearParam(pickSearchParam(sp, "toYear")),
    minRating: parseMinRating(pickSearchParam(sp, "minRating")),
    genre: pickSearchParam(sp, "genre")?.trim() || undefined,
    director: pickSearchParam(sp, "director")?.trim() || undefined,
    stars: pickSearchParam(sp, "stars")?.trim() || undefined,
  });
  return sortMovies(filtered, sort);
}

export function filterCelebrities(
  list: Celebrity[],
  filters: {
    q?: string;
    country?: string;
    gender?: number;
    minAge?: number;
    maxAge?: number;
  },
): Celebrity[] {
  const q = filters.q?.trim().toLowerCase();
  const countryNeedle = filters.country?.trim().toLowerCase();
  return list.filter((c) => {
    if (filters.gender != null) {
      if (c.gender == null || c.gender !== filters.gender) return false;
    }
    if (countryNeedle) {
      const hay = celebrityLocaleText(c);
      if (!hay.includes(countryNeedle)) return false;
    }
    if (filters.minAge != null || filters.maxAge != null) {
      const age = celebrityComputedAge(c);
      if (age == null) return false;
      if (filters.minAge != null && age < filters.minAge) return false;
      if (filters.maxAge != null && age > filters.maxAge) return false;
    }
    if (q) {
      const inName = c.name.toLowerCase().includes(q);
      const inBio = c.bio?.toLowerCase().includes(q) ?? false;
      const inRole = c.role.toLowerCase().includes(q);
      if (!inName && !inBio && !inRole) return false;
    }
    return true;
  });
}

export function applyCelebrityListing(
  list: Celebrity[],
  sp: Record<string, string | string[] | undefined> | undefined,
): Celebrity[] {
  const sort = parseCelebritySort(pickSearchParam(sp, "sort"));
  const filtered = filterCelebrities(list, {
    q: pickSearchParam(sp, "q"),
    country: pickSearchParam(sp, "country")?.trim() || undefined,
    gender: parseGenderFilter(pickSearchParam(sp, "gender")),
    minAge: parseYearParam(pickSearchParam(sp, "minAge")),
    maxAge: parseYearParam(pickSearchParam(sp, "maxAge")),
  });
  return sortCelebrities(filtered, sort);
}

export type SeriesListFilters = {
  q?: string;
  fromYear?: number;
  toYear?: number;
  director?: string;
  stars?: string;
  minRating?: number;
  genre?: string;
};

function seriesStartYear(s: Series): number {
  const fromLabel = parseInt(s.yearLabel, 10);
  if (Number.isFinite(fromLabel)) return fromLabel;
  if (s.releaseDate?.length >= 4) {
    const y = parseInt(s.releaseDate.slice(0, 4), 10);
    if (Number.isFinite(y)) return y;
  }
  return 0;
}

export function filterSeries(
  series: Series[],
  filtersOrQ?: string | SeriesListFilters,
): Series[] {
  const f: SeriesListFilters =
    typeof filtersOrQ === "string" ? { q: filtersOrQ } : (filtersOrQ ?? {});
  const q = f.q?.trim().toLowerCase();
  const dirNeedle = f.director?.trim().toLowerCase();
  const starsNeedle = f.stars?.trim().toLowerCase();
  const genreNeedle = f.genre?.trim().toLowerCase();

  return series.filter((s) => {
    const sy = seriesStartYear(s);
    if (f.fromYear != null && sy > 0 && sy < f.fromYear) return false;
    if (f.toYear != null && sy > 0 && sy > f.toYear) return false;
    if (f.minRating != null && s.rating < f.minRating) return false;
    if (genreNeedle) {
      const hit = s.genres.some((g) => g.toLowerCase() === genreNeedle);
      if (!hit) return false;
    }
    if (dirNeedle && !s.director.toLowerCase().includes(dirNeedle))
      return false;
    if (starsNeedle) {
      const inLine = s.starsLine.toLowerCase().includes(starsNeedle);
      const inCast = s.cast.some((c) =>
        c.name.toLowerCase().includes(starsNeedle),
      );
      if (!inLine && !inCast) return false;
    }
    if (q) {
      const inTitle = s.title.toLowerCase().includes(q);
      const inSyn = s.synopsis?.toLowerCase().includes(q) ?? false;
      const inDir = s.director.toLowerCase().includes(q);
      const inStars = s.starsLine.toLowerCase().includes(q);
      if (!inTitle && !inSyn && !inDir && !inStars) return false;
    }
    return true;
  });
}

export function applySeriesListing(
  series: Series[],
  sp: Record<string, string | string[] | undefined> | undefined,
): Series[] {
  const sort = parseSeriesSort(pickSearchParam(sp, "sort"));
  const filtered = filterSeries(series, {
    q: pickSearchParam(sp, "q"),
    fromYear: parseYearParam(pickSearchParam(sp, "fromYear")),
    toYear: parseYearParam(pickSearchParam(sp, "toYear")),
    director: pickSearchParam(sp, "director")?.trim() || undefined,
    stars: pickSearchParam(sp, "stars")?.trim() || undefined,
    minRating: parseMinRating(pickSearchParam(sp, "minRating")),
    genre: pickSearchParam(sp, "genre")?.trim() || undefined,
  });
  return sortSeries(filtered, sort);
}

export const MOVIE_LIST_QS_KEYS = [
  "sort",
  "q",
  "fromYear",
  "toYear",
  "minRating",
  "genre",
  "director",
  "stars",
  "page",
  "pageSize",
  /** TMDB discover catalog pagination on movie index pages */
  "discoverPage",
] as const;

export function parseDiscoverPageParam(
  sp: Record<string, string | string[] | undefined> | undefined,
): { requested: number; raw: string | undefined } {
  const raw = pickSearchParam(sp, "discoverPage");
  const parsed = raw != null && raw !== "" ? Number(raw) : Number.NaN;
  const requested =
    Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
  return { requested, raw };
}

/** Build `/movies?...&discoverPage=n` while preserving sort / filters. */
export function withMoviesDiscoverPageHref(
  pathname: string,
  sp: Record<string, string | string[] | undefined> | undefined,
  page: number,
): string {
  const q = new URLSearchParams();
  if (sp) {
    for (const key of MOVIE_LIST_QS_KEYS) {
      if (key === "discoverPage") continue;
      const v = pickSearchParam(sp, key);
      if (v != null && v !== "") q.set(key, v);
    }
  }
  if (page > 1) q.set("discoverPage", String(page));
  const s = q.toString();
  return s ? `${pathname}?${s}` : pathname;
}

export function withMovieListingQuery(
  basePath: string,
  sp: Record<string, string | string[] | undefined> | undefined,
): string {
  if (!sp) return basePath;
  const q = new URLSearchParams();
  for (const key of MOVIE_LIST_QS_KEYS) {
    const v = pickSearchParam(sp, key);
    if (v != null && v !== "") q.set(key, v);
  }
  const s = q.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export const CELEB_LIST_QS_KEYS = [
  "sort",
  "q",
  "country",
  "gender",
  "minAge",
  "maxAge",
  "page",
  "pageSize",
] as const;

export function withCelebrityListingQuery(
  basePath: string,
  sp: Record<string, string | string[] | undefined> | undefined,
): string {
  if (!sp) return basePath;
  const q = new URLSearchParams();
  for (const key of CELEB_LIST_QS_KEYS) {
    const v = pickSearchParam(sp, key);
    if (v != null && v !== "") q.set(key, v);
  }
  const s = q.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export const SERIES_LIST_QS_KEYS = [
  "sort",
  "q",
  "fromYear",
  "toYear",
  "director",
  "stars",
  "minRating",
  "genre",
  "page",
  "pageSize",
] as const;

export function withSeriesListingQuery(
  basePath: string,
  sp: Record<string, string | string[] | undefined> | undefined,
): string {
  if (!sp) return basePath;
  const q = new URLSearchParams();
  for (const key of SERIES_LIST_QS_KEYS) {
    const v = pickSearchParam(sp, key);
    if (v != null && v !== "") q.set(key, v);
  }
  const s = q.toString();
  return s ? `${basePath}?${s}` : basePath;
}

function seriesPopularityScore(s: Series): number {
  if (s.popularity != null && s.popularity > 0) return s.popularity;
  return s.rating * 15 + seriesStartYear(s) * 0.001;
}

export function sortSeries(series: Series[], mode: SeriesSortMode): Series[] {
  const copy = [...series];
  switch (mode) {
    case "rating":
      return copy.sort(
        (a, b) =>
          b.rating - a.rating ||
          seriesStartYear(b) - seriesStartYear(a) ||
          a.title.localeCompare(b.title),
      );
    case "year":
      return copy.sort(
        (a, b) =>
          seriesStartYear(b) - seriesStartYear(a) ||
          b.rating - a.rating ||
          a.title.localeCompare(b.title),
      );
    case "title":
      return copy.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      );
    case "featured":
    default:
      return copy.sort(
        (a, b) =>
          seriesPopularityScore(b) - seriesPopularityScore(a) ||
          b.rating - a.rating,
      );
  }
}

function celebPopularityScore(c: Celebrity): number {
  if (c.popularity != null && c.popularity > 0) return c.popularity;
  return 0;
}

export function sortCelebrities(
  list: Celebrity[],
  mode: CelebritySortMode,
): Celebrity[] {
  const copy = [...list];
  switch (mode) {
    case "name-asc":
      return copy.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
    case "name-desc":
      return copy.sort((a, b) =>
        b.name.localeCompare(a.name, undefined, { sensitivity: "base" }),
      );
    case "featured":
    default:
      return copy.sort(
        (a, b) =>
          celebPopularityScore(b) - celebPopularityScore(a) ||
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
  }
}
