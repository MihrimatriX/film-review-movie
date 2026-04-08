import type { Celebrity, Movie, Series, SeriesCast } from "@/lib/types";
import { readCelebrities, readMovies, readSeriesList } from "@/lib/data-file";
import type { Locale } from "@/lib/i18n";
import {
  tmdbBackdrop,
  tmdbIdFromSlug,
  tmdbMovieDetails,
  type TmdbMovie,
  type TmdbMovieDetails,
  type TmdbTvDetails,
  tmdbDiscoverMovies,
  tmdbPopularMovies,
  tmdbPersonDetails,
  tmdbPopularPeople,
  tmdbPopularTv,
  tmdbPoster,
  tmdbProfile,
  tmdbSlug,
  tmdbTvDetails,
  tmdbTvGenreList,
  type TmdbPersonDetails,
} from "@/lib/tmdb";

/** TMDB popular listesi sayfa başına ~20 kayıt; aşırı isteği sınırla. */
const MAX_POPULAR_FETCH_PAGES = 25;
/** İlk N TMDB kişi için detay çağrısı (doğum yeri / yaş / biyografi). */
const CELEB_DETAIL_ENRICH_TOP = 100;
const CELEB_DETAIL_CHUNK = 6;

async function allTmdbPopularPeople(locale: Locale) {
  const first = await tmdbPopularPeople(locale, 1);
  if (!first?.results?.length) return [];
  const out = [...first.results];
  const totalPages = Math.min(first.total_pages ?? 1, MAX_POPULAR_FETCH_PAGES);
  for (let p = 2; p <= totalPages; p++) {
    const r = await tmdbPopularPeople(locale, p);
    if (r?.results?.length) out.push(...r.results);
    else break;
  }
  return out;
}

async function allTmdbPopularTv(locale: Locale) {
  const first = await tmdbPopularTv(locale, 1);
  if (!first?.results?.length) return [];
  const out = [...first.results];
  const totalPages = Math.min(first.total_pages ?? 1, MAX_POPULAR_FETCH_PAGES);
  for (let p = 2; p <= totalPages; p++) {
    const r = await tmdbPopularTv(locale, p);
    if (r?.results?.length) out.push(...r.results);
    else break;
  }
  return out;
}

async function enrichTmdbCelebrityBatch(
  locale: Locale,
  list: Celebrity[],
): Promise<void> {
  const ranked = [...list]
    .filter((c) => c.slug.startsWith("tmdb-person-"))
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, CELEB_DETAIL_ENRICH_TOP);

  const ids: number[] = [];
  for (const c of ranked) {
    const p = tmdbIdFromSlug(c.slug);
    if (p?.type === "person") ids.push(p.id);
  }

  const detailById = new Map<number, TmdbPersonDetails>();
  for (let i = 0; i < ids.length; i += CELEB_DETAIL_CHUNK) {
    const slice = ids.slice(i, i + CELEB_DETAIL_CHUNK);
    const rows = await Promise.all(
      slice.map((id) => tmdbPersonDetails(locale, id)),
    );
    slice.forEach((id, j) => {
      const d = rows[j];
      if (d) detailById.set(id, d);
    });
  }

  for (const c of list) {
    const parsed = tmdbIdFromSlug(c.slug);
    if (!parsed || parsed.type !== "person") continue;
    const d = detailById.get(parsed.id);
    if (!d) continue;
    c.placeOfBirth = d.place_of_birth?.trim() || undefined;
    c.birthday = d.birthday?.trim() || undefined;
    c.deathday = d.deathday?.trim() || null;
    if (d.gender != null && d.gender > 0) c.gender = d.gender;
    if (!c.bio?.trim() && d.biography?.trim()) c.bio = d.biography;
  }
}

function toRating(voteAverage: number) {
  return Math.round(voteAverage * 10) / 10;
}

function yearFromDate(date: string | undefined) {
  if (!date) return new Date().getFullYear();
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) ? y : new Date().getFullYear();
}

function uniqStrings(list: string[]): string[] {
  return [...new Set(list.filter(Boolean))];
}

function crewNamesByJobs(
  crew: { name: string; job: string }[] | undefined,
  jobs: string[],
  limit = 40,
): string[] {
  if (!crew?.length) return [];
  const want = new Set(jobs.map((j) => j.toLowerCase()));
  const out: string[] = [];
  for (const c of crew) {
    if (want.has(c.job.toLowerCase())) out.push(c.name);
  }
  return uniqStrings(out).slice(0, limit);
}

function formatUsd(amount: number | undefined, locale: Locale): string | null {
  if (amount == null || amount <= 0) return null;
  try {
    return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

function pickYoutubeTrailer(
  videos: TmdbMovieDetails["videos"] | TmdbTvDetails["videos"],
): { key: string; name: string } | null {
  const list = videos?.results ?? [];
  const yt = list.filter((v) => v.site === "YouTube" && v.type === "Trailer");
  if (!yt.length) return null;
  const official = yt.find((v) => v.official);
  const picked = official ?? yt[0];
  return picked ? { key: picked.key, name: picked.name } : null;
}

export type MovieTmdbExtras = {
  backdropUrl: string | null;
  tagline: string | null;
  voteCount: number;
  budgetLabel: string | null;
  revenueLabel: string | null;
  originalTitle: string | null;
  homepage: string | null;
  imdbUrl: string | null;
  trailerYoutubeKey: string | null;
  trailerName: string | null;
  cast: { slug: string; name: string; character: string; profileUrl: string }[];
  directors: string[];
  writers: string[];
  producers: string[];
  keywords: string[];
  companies: string[];
  countries: string[];
  languages: string[];
  status: string | null;
};

export type SeriesTmdbExtras = {
  backdropUrl: string | null;
  tagline: string | null;
  voteCount: number;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRuntimeLabel: string | null;
  lastAirDate: string | null;
  homepage: string | null;
  imdbUrl: string | null;
  trailerYoutubeKey: string | null;
  trailerName: string | null;
  creators: { slug: string; name: string; profileUrl: string }[];
  networks: string[];
  cast: { slug: string; name: string; character: string; profileUrl: string }[];
  keywords: string[];
  status: string | null;
};

function movieFromTmdbDetails(
  details: TmdbMovieDetails,
  locale: Locale,
): Movie {
  const directors = crewNamesByJobs(details.credits?.crew, [
    "Director",
    "Co-Director",
  ]);
  const stars =
    details.credits?.cast
      ?.slice(0, 5)
      .map((c) => c.name)
      .join(", ") || undefined;
  const mpaa =
    details.release_dates?.results
      ?.find((r) => r.iso_3166_1 === "US")
      ?.release_dates?.find((d) => d.certification)?.certification || undefined;

  return {
    id: `tmdb-movie-${details.id}`,
    slug: tmdbSlug("movie", details.id, details.title),
    title: details.title,
    year: yearFromDate(details.release_date),
    rating: toRating(details.vote_average),
    genres: details.genres?.map((g) => g.name) ?? [],
    poster: tmdbPoster(details.poster_path, "w780") || "",
    synopsis: details.overview || "",
    runtime: details.runtime ? `${details.runtime} min` : undefined,
    director: directors[0],
    mpaa,
    releaseLabel: details.release_date || undefined,
    stars,
    popularity: details.popularity,
  };
}

function buildMovieTmdbExtras(
  details: TmdbMovieDetails,
  locale: Locale,
): MovieTmdbExtras {
  const trailer = pickYoutubeTrailer(details.videos);
  const cast = (details.credits?.cast ?? []).slice(0, 20).map((c) => ({
    slug: tmdbSlug("person", c.id, c.name),
    name: c.name,
    character: (c.character || "—").replace(/\s+/g, " ").trim(),
    profileUrl: tmdbProfile(c.profile_path, "w185") || "",
  }));

  const writers = uniqStrings([
    ...crewNamesByJobs(details.credits?.crew, [
      "Screenplay",
      "Writer",
      "Story",
    ]),
  ]);

  return {
    backdropUrl: details.backdrop_path
      ? tmdbBackdrop(details.backdrop_path, "w1280")
      : null,
    tagline: details.tagline?.trim() || null,
    voteCount: details.vote_count ?? 0,
    budgetLabel: formatUsd(details.budget, locale),
    revenueLabel: formatUsd(details.revenue, locale),
    originalTitle:
      details.original_title && details.original_title !== details.title
        ? details.original_title
        : null,
    homepage: details.homepage?.trim() || null,
    imdbUrl: details.external_ids?.imdb_id
      ? `https://www.imdb.com/title/${details.external_ids.imdb_id}`
      : null,
    trailerYoutubeKey: trailer?.key ?? null,
    trailerName: trailer?.name ?? null,
    cast,
    directors: crewNamesByJobs(details.credits?.crew, [
      "Director",
      "Co-Director",
    ]),
    writers,
    producers: crewNamesByJobs(
      details.credits?.crew,
      ["Producer", "Executive Producer"],
      12,
    ),
    keywords: (details.keywords?.keywords ?? []).map((k) => k.name),
    companies: (details.production_companies ?? []).map((c) => c.name),
    countries: (details.production_countries ?? []).map((c) => c.name),
    languages: (details.spoken_languages ?? []).map((l) => l.name),
    status: details.status ?? null,
  };
}

function seriesFromTmdbDetails(details: TmdbTvDetails): Series {
  const starsLine =
    details.credits?.cast
      ?.slice(0, 5)
      .map((c) => c.name)
      .join(", ") || "";
  const mpaa =
    details.content_ratings?.results?.find((r) => r.iso_3166_1 === "US")
      ?.rating || "";
  const runtime =
    details.episode_run_time?.length && details.episode_run_time[0]
      ? `${details.episode_run_time[0]} min`
      : "";
  const yearLabel = details.first_air_date
    ? details.first_air_date.slice(0, 4)
    : "";
  const trailer = pickYoutubeTrailer(details.videos);
  const director =
    details.created_by?.[0]?.name ||
    crewNamesByJobs(details.credits?.crew, ["Director"])[0] ||
    "";

  const cast: SeriesCast[] = (details.credits?.cast ?? [])
    .slice(0, 16)
    .map((c) => ({
      name: c.name,
      role: (c.character || "—").replace(/\s+/g, " ").trim(),
      image: tmdbProfile(c.profile_path, "w185") || "",
    }));

  const plotKeywords = (details.keywords?.results ?? []).map((k) => k.name);

  return {
    id: `tmdb-tv-${details.id}`,
    slug: tmdbSlug("tv", details.id, details.name),
    title: details.name,
    yearLabel,
    rating: toRating(details.vote_average),
    reviewCount: details.vote_count ?? 0,
    poster: tmdbPoster(details.poster_path, "w780") || "",
    synopsis: details.overview || "",
    runtime,
    mpaa,
    genres: details.genres?.map((g) => g.name) ?? [],
    director,
    writers: crewNamesByJobs(details.credits?.crew, [
      "Screenplay",
      "Writer",
      "Story",
    ])
      .slice(0, 4)
      .join(", "),
    starsLine,
    releaseDate: details.first_air_date || "",
    plotKeywords,
    seasons: [],
    cast,
    mediaThumbs: [],
    videoThumb: trailer?.key
      ? `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`
      : "",
    popularity: details.popularity,
  };
}

function buildSeriesTmdbExtras(
  details: TmdbTvDetails,
  locale: Locale,
): SeriesTmdbExtras {
  const trailer = pickYoutubeTrailer(details.videos);
  const creators = (details.created_by ?? []).map((p) => ({
    slug: tmdbSlug("person", p.id, p.name),
    name: p.name,
    profileUrl: tmdbProfile(p.profile_path, "w185") || "",
  }));

  const cast = (details.credits?.cast ?? []).slice(0, 20).map((c) => ({
    slug: tmdbSlug("person", c.id, c.name),
    name: c.name,
    character: (c.character || "—").replace(/\s+/g, " ").trim(),
    profileUrl: tmdbProfile(c.profile_path, "w185") || "",
  }));

  return {
    backdropUrl: details.backdrop_path
      ? tmdbBackdrop(details.backdrop_path, "w1280")
      : null,
    tagline: details.tagline?.trim() || null,
    voteCount: details.vote_count ?? 0,
    numberOfSeasons: details.number_of_seasons ?? 0,
    numberOfEpisodes: details.number_of_episodes ?? 0,
    episodeRuntimeLabel:
      details.episode_run_time?.length && details.episode_run_time[0]
        ? locale === "tr"
          ? `~${details.episode_run_time[0]} dk / bölüm`
          : `~${details.episode_run_time[0]} min / ep`
        : null,
    lastAirDate: details.last_air_date || null,
    homepage: details.homepage?.trim() || null,
    imdbUrl: details.external_ids?.imdb_id
      ? `https://www.imdb.com/title/${details.external_ids.imdb_id}`
      : null,
    trailerYoutubeKey: trailer?.key ?? null,
    trailerName: trailer?.name ?? null,
    creators,
    networks: (details.networks ?? []).map((n) => n.name),
    cast,
    keywords: (details.keywords?.results ?? []).map((k) => k.name),
    status: details.status ?? null,
  };
}

export function moviesFromTmdbResults(results: TmdbMovie[]): Movie[] {
  return results
    .filter((m) => m.poster_path)
    .map((m) => ({
      id: `tmdb-movie-${m.id}`,
      slug: tmdbSlug("movie", m.id, m.title),
      title: m.title,
      year: yearFromDate(m.release_date),
      rating: toRating(m.vote_average),
      genres: [],
      poster: tmdbPoster(m.poster_path, "w500") || "",
      synopsis: m.overview || "",
      runtime: undefined,
      director: undefined,
      mpaa: undefined,
      releaseLabel: m.release_date || undefined,
      stars: undefined,
      popularity: m.popularity,
    }));
}

export type DiscoverMoviesPage = {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
};

/** Single page of TMDB discover (for home catalog pagination). */
export async function getDiscoverMoviesPage(
  locale: Locale,
  requestedPage: number,
): Promise<DiscoverMoviesPage | null> {
  const safe = Math.max(1, Math.min(500, Math.floor(requestedPage || 1)));
  let data = await tmdbDiscoverMovies(locale, safe);
  if (!data) return null;

  const totalPages = Math.max(1, Math.min(500, data.total_pages));
  const effective = Math.min(safe, totalPages);

  if (effective !== safe) {
    const again = await tmdbDiscoverMovies(locale, effective);
    if (!again) return null;
    data = again;
  }

  return {
    movies: moviesFromTmdbResults(data.results),
    page: effective,
    totalPages,
    totalResults: data.total_results,
  };
}

export async function getMoviesMerged(locale: Locale): Promise<Movie[]> {
  const local = await readMovies();
  const tmdb = (await tmdbPopularMovies(locale))?.results ?? [];
  const mapped = moviesFromTmdbResults(tmdb);

  const bySlug = new Map<string, Movie>();
  for (const m of [...mapped, ...local]) bySlug.set(m.slug, m);
  return Array.from(bySlug.values());
}

export async function getMovieBySlugMerged(
  locale: Locale,
  slug: string,
): Promise<Movie | null> {
  const local = await readMovies();
  const hit = local.find((m) => m.slug === slug);
  if (hit) return hit;

  const parsed = tmdbIdFromSlug(slug);
  if (!parsed || parsed.type !== "movie") return null;

  const details = await tmdbMovieDetails(locale, parsed.id);
  if (!details) return null;
  return movieFromTmdbDetails(details, locale);
}

export async function getMoviePageBundle(
  locale: Locale,
  slug: string,
): Promise<{ movie: Movie; tmdb: MovieTmdbExtras | null } | null> {
  const local = await readMovies();
  const hit = local.find((m) => m.slug === slug);
  if (hit) return { movie: hit, tmdb: null };

  const parsed = tmdbIdFromSlug(slug);
  if (!parsed || parsed.type !== "movie") return null;

  const details = await tmdbMovieDetails(locale, parsed.id);
  if (!details) return null;

  return {
    movie: movieFromTmdbDetails(details, locale),
    tmdb: buildMovieTmdbExtras(details, locale),
  };
}

export async function getSeriesMerged(locale: Locale): Promise<Series[]> {
  const local = await readSeriesList();
  const [tmdb, genreRes] = await Promise.all([
    allTmdbPopularTv(locale),
    tmdbTvGenreList(locale),
  ]);
  const genreNames = new Map<number, string>();
  for (const g of genreRes?.genres ?? []) genreNames.set(g.id, g.name);

  const mapped: Series[] = tmdb.map((s) => ({
    id: `tmdb-tv-${s.id}`,
    slug: tmdbSlug("tv", s.id, s.name),
    title: s.name,
    yearLabel: s.first_air_date ? s.first_air_date.slice(0, 4) : "",
    rating: toRating(s.vote_average),
    reviewCount: 0,
    poster: tmdbPoster(s.poster_path, "w500") || "",
    synopsis: s.overview || "",
    runtime: "",
    mpaa: "",
    genres: (s.genre_ids ?? [])
      .map((id) => genreNames.get(id))
      .filter((n): n is string => Boolean(n)),
    director: "",
    writers: "",
    starsLine: "",
    releaseDate: s.first_air_date || "",
    plotKeywords: [],
    seasons: [],
    cast: [],
    mediaThumbs: [],
    videoThumb: "",
    popularity: s.popularity,
  }));
  const bySlug = new Map<string, Series>();
  for (const s of [...mapped, ...local]) bySlug.set(s.slug, s);
  return Array.from(bySlug.values());
}

export async function getSeriesBySlugMerged(
  locale: Locale,
  slug: string,
): Promise<Series | null> {
  const local = await readSeriesList();
  const hit = local.find((s) => s.slug === slug);
  if (hit) return hit;

  const parsed = tmdbIdFromSlug(slug);
  if (!parsed || parsed.type !== "tv") return null;

  const details = await tmdbTvDetails(locale, parsed.id);
  if (!details) return null;
  return seriesFromTmdbDetails(details);
}

export async function getSeriesPageBundle(
  locale: Locale,
  slug: string,
): Promise<{ series: Series; tmdb: SeriesTmdbExtras | null } | null> {
  const local = await readSeriesList();
  const hit = local.find((s) => s.slug === slug);
  if (hit) return { series: hit, tmdb: null };

  const parsed = tmdbIdFromSlug(slug);
  if (!parsed || parsed.type !== "tv") return null;

  const details = await tmdbTvDetails(locale, parsed.id);
  if (!details) return null;

  return {
    series: seriesFromTmdbDetails(details),
    tmdb: buildSeriesTmdbExtras(details, locale),
  };
}

export async function getCelebritiesMerged(
  locale: Locale,
): Promise<Celebrity[]> {
  const local = await readCelebrities();
  const tmdb = await allTmdbPopularPeople(locale);
  const mapped: Celebrity[] = tmdb.map((p) => ({
    id: `tmdb-person-${p.id}`,
    slug: tmdbSlug("person", p.id, p.name),
    name: p.name,
    role: p.known_for_department || "Actor",
    country: undefined,
    bio: undefined,
    image: tmdbProfile(p.profile_path, "h632") || "",
    imageGrid2: tmdbProfile(p.profile_path, "h632") || "",
    imageList: tmdbProfile(p.profile_path, "w342") || "",
    popularity: p.popularity,
    gender: p.gender != null && p.gender > 0 ? p.gender : undefined,
  }));
  const bySlug = new Map<string, Celebrity>();
  for (const c of [...mapped, ...local]) bySlug.set(c.slug, c);
  const merged = Array.from(bySlug.values());
  if (merged.some((c) => c.slug.startsWith("tmdb-person-"))) {
    await enrichTmdbCelebrityBatch(locale, merged);
  }
  return merged;
}

export async function getCelebrityBySlugMerged(
  locale: Locale,
  slug: string,
): Promise<Celebrity | null> {
  const local = await readCelebrities();
  const hit = local.find((c) => c.slug === slug);
  if (hit) return hit;

  const parsed = tmdbIdFromSlug(slug);
  if (!parsed || parsed.type !== "person") return null;

  const details = await tmdbPersonDetails(locale, parsed.id);
  if (!details) return null;

  return {
    id: `tmdb-person-${details.id}`,
    slug: tmdbSlug("person", details.id, details.name),
    name: details.name,
    role: details.known_for_department || "Actor",
    country: details.place_of_birth || undefined,
    placeOfBirth: details.place_of_birth?.trim() || undefined,
    bio: details.biography || undefined,
    image: tmdbProfile(details.profile_path, "h632") || "",
    imageGrid2: tmdbProfile(details.profile_path, "h632") || "",
    imageList: tmdbProfile(details.profile_path, "w342") || "",
    gender:
      details.gender != null && details.gender > 0 ? details.gender : undefined,
    birthday: details.birthday?.trim() || undefined,
    deathday: details.deathday?.trim() || null,
    popularity: details.popularity,
  };
}
