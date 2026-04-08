import { pickCelebrityImageSrc } from "@/lib/celebrity-image";
import type { Celebrity, Movie, Series } from "@/lib/types";

export type SiteSearchScope =
  | "all"
  | "movies"
  | "tv"
  | "year"
  | "actor"
  | "director"
  | "people";

export type SiteSearchMovieHit = {
  type: "movie";
  slug: string;
  title: string;
  year: number;
  poster: string;
  subtitle?: string;
};

export type SiteSearchSeriesHit = {
  type: "series";
  slug: string;
  title: string;
  yearLabel: string;
  poster: string;
};

export type SiteSearchPersonHit = {
  type: "person";
  slug: string;
  name: string;
  role: string;
  image: string;
};

export type SiteSearchResponse = {
  movies: SiteSearchMovieHit[];
  series: SiteSearchSeriesHit[];
  people: SiteSearchPersonHit[];
  /** Set when scope is `year` and a 4-digit year was parsed from the query. */
  parsedYear?: number;
};

function fold(s: string): string {
  return s.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

function rankTitleMatch(title: string, q: string): number {
  const t = fold(title);
  const qf = fold(q);
  if (!qf) return -1;
  if (t === qf) return 0;
  if (t.startsWith(qf)) return 1;
  const idx = t.indexOf(qf);
  if (idx < 0) return -1;
  const prev = idx > 0 ? t[idx - 1] : " ";
  const atWord = !/[a-z0-9ğüşıöç]/.test(prev);
  return atWord ? 2 : 3;
}

function seriesStartYear(s: Series): number {
  const fromLabel = parseInt(s.yearLabel, 10);
  if (Number.isFinite(fromLabel)) return fromLabel;
  if (s.releaseDate?.length >= 4) {
    const y = parseInt(s.releaseDate.slice(0, 4), 10);
    if (Number.isFinite(y)) return y;
  }
  return 0;
}

/** First plausible 4-digit year in the string (e.g. "film 2019" → 2019). */
export function parseYearFromSearchQuery(raw: string): number | undefined {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 4) {
    for (let i = 0; i <= digits.length - 4; i++) {
      const y = parseInt(digits.slice(i, i + 4), 10);
      if (y >= 1870 && y <= 2100) return y;
    }
  }
  return undefined;
}

function movieSearchBlob(m: Movie): string {
  return [
    m.title,
    m.synopsis,
    m.director,
    m.stars,
    m.releaseLabel,
    m.mpaa,
    m.genres.join(" "),
    String(m.year),
  ]
    .filter(Boolean)
    .join(" ");
}

function rankMovie(m: Movie, q: string): number {
  const tr = rankTitleMatch(m.title, q);
  if (tr >= 0) return tr;
  const f = fold(q);
  if (f.length < 1) return -1;
  if (fold(m.synopsis).includes(f)) return 4;
  if (m.director && fold(m.director).includes(f)) return 4;
  if (m.stars && fold(m.stars).includes(f)) return 4;
  if (m.releaseLabel && fold(m.releaseLabel).includes(f)) return 5;
  if (m.mpaa && fold(m.mpaa).includes(f)) return 6;
  const yearDigits = q.replace(/\D/g, "");
  if (yearDigits.length >= 4 && String(m.year).includes(yearDigits)) return 5;
  if (f.length >= 2 && m.genres.some((g) => fold(g).includes(f))) return 5;
  if (f.length >= 2 && movieSearchBlob(m).includes(f)) return 6;
  return -1;
}

function seriesSeasonsBlob(s: Series): string {
  return s.seasons.map((se) => `${se.title} ${se.description}`).join(" ");
}

function seriesSearchBlob(s: Series): string {
  return [
    s.title,
    s.synopsis,
    s.director,
    s.writers,
    s.starsLine,
    s.releaseDate,
    s.mpaa,
    s.genres.join(" "),
    s.plotKeywords.join(" "),
    seriesSeasonsBlob(s),
    s.cast.map((c) => `${c.name} ${c.role}`).join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

function rankSeries(s: Series, q: string): number {
  const tr = rankTitleMatch(s.title, q);
  if (tr >= 0) return tr;
  const f = fold(q);
  if (f.length < 1) return -1;
  if (fold(s.synopsis).includes(f)) return 4;
  if (fold(s.director).includes(f)) return 4;
  if (fold(s.starsLine).includes(f)) return 4;
  if (fold(s.writers).includes(f)) return 5;
  if (fold(s.releaseDate).includes(f)) return 5;
  if (fold(s.yearLabel).includes(f)) return 5;
  if (f.length >= 2 && s.genres.some((g) => fold(g).includes(f))) return 5;
  if (f.length >= 2 && s.plotKeywords.some((k) => fold(k).includes(f)))
    return 5;
  if (f.length >= 2 && fold(seriesSeasonsBlob(s)).includes(f)) return 5;
  if (f.length >= 2 && seriesSearchBlob(s).includes(f)) return 6;
  return -1;
}

/** All significant query tokens appear in the name (any order), e.g. "Parsons Jim". */
function rankNameMultiToken(name: string, q: string): number {
  const nf = fold(name);
  const tokens = fold(q)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
  if (tokens.length < 2) return -1;
  if (tokens.every((t) => nf.includes(t))) return 2;
  return -1;
}

function rankPerson(c: Celebrity, q: string): number {
  const tr = rankTitleMatch(c.name, q);
  if (tr >= 0) return tr;
  const mt = rankNameMultiToken(c.name, q);
  if (mt >= 0) return mt;
  const f = fold(q);
  if (f.length < 1) return -1;
  if (fold(c.bio ?? "").includes(f)) return 4;
  if (fold(c.role).includes(f)) return 5;
  if (c.country && fold(c.country).includes(f)) return 6;
  return -1;
}

/** Used to sort actor-scope results (acting credits first), not to hide matches. */
function actingRole(role: string): boolean {
  const r = fold(role);
  if (!r) return false;
  return (
    r.includes("act") ||
    r.includes("oyuncu") ||
    r.includes("cast") ||
    r.includes("acting") ||
    r.includes("sanat") ||
    r.includes("perform") ||
    r.includes("singer") ||
    r.includes("voice") ||
    r.includes("seslendir")
  );
}

function directorRole(role: string): boolean {
  const r = fold(role);
  return (
    r.includes("direct") || r.includes("yönetmen") || r.includes("directing")
  );
}

function rankMovieByYear(m: Movie, y: number | undefined, q: string): number {
  if (y != null) return m.year === y ? 0 : -1;
  const digits = q.replace(/\D/g, "");
  if (!digits.length) return -1;
  return String(m.year).includes(digits) ? 1 : -1;
}

function rankSeriesByYear(s: Series, y: number | undefined, q: string): number {
  const sy = seriesStartYear(s);
  if (y != null) {
    if (sy === y) return 0;
    if (s.releaseDate.startsWith(String(y))) return 0;
    if (fold(s.yearLabel).includes(String(y))) return 1;
    return -1;
  }
  const digits = q.replace(/\D/g, "");
  if (!digits.length) return -1;
  if (String(sy).includes(digits)) return 1;
  if (s.yearLabel && fold(s.yearLabel).includes(digits)) return 1;
  return -1;
}

function textMatchesCastQuery(haystack: string, q: string): boolean {
  const f = fold(haystack);
  if (!f) return false;
  const qf = fold(q);
  if (qf.length < 2) return false;
  if (f.includes(qf)) return true;
  const tokens = qf.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length < 2) return false;
  return tokens.every((t) => f.includes(t));
}

function movieCastMatches(m: Movie, q: string): boolean {
  if (!m.stars) return false;
  return textMatchesCastQuery(m.stars, q);
}

function seriesCastMatches(s: Series, q: string): boolean {
  if (textMatchesCastQuery(s.starsLine, q)) return true;
  const f = fold(q);
  if (f.length < 2) return false;
  return s.cast.some((c) => {
    if (textMatchesCastQuery(c.name, q)) return true;
    if (textMatchesCastQuery(`${c.name} ${c.role}`, q)) return true;
    if (fold(c.role).includes(f)) return true;
    return false;
  });
}

const DEFAULT_LIMIT = 8;

const POSTER_PLACEHOLDER = "/images/celebrity-placeholder.svg";

function mapSeriesHit(s: Series): SiteSearchSeriesHit {
  return {
    type: "series",
    slug: s.slug,
    title: s.title,
    yearLabel: s.yearLabel,
    poster: s.poster?.trim() ? s.poster : POSTER_PLACEHOLDER,
  };
}

function mapPersonHit(p: Celebrity): SiteSearchPersonHit {
  return {
    type: "person",
    slug: p.slug,
    name: p.name,
    role: p.role?.trim() ? p.role : "—",
    image: pickCelebrityImageSrc(p, "search"),
  };
}

function mapMovieHit(m: Movie, q: string): SiteSearchMovieHit {
  const syn = m.synopsis.replace(/\s+/g, " ").trim();
  const excerpt = syn.length > 72 ? `${syn.slice(0, 72)}…` : syn;
  return {
    type: "movie",
    slug: m.slug,
    title: m.title,
    year: m.year,
    poster: m.poster?.trim() ? m.poster : POSTER_PLACEHOLDER,
    subtitle: rankTitleMatch(m.title, q) < 0 && excerpt ? excerpt : undefined,
  };
}

export function runSiteSearch(
  movies: Movie[],
  series: Series[],
  people: Celebrity[],
  rawQ: string,
  scope: SiteSearchScope,
  limit = DEFAULT_LIMIT,
): SiteSearchResponse {
  const q = rawQ.trim();
  if (!q) {
    return { movies: [], series: [], people: [] };
  }

  const parsedYear = scope === "year" ? parseYearFromSearchQuery(q) : undefined;

  if (scope === "all") {
    const wantMovies = true;
    const wantTv = true;
    const wantPeople = true;
    const movieHits = wantMovies
      ? movies
          .map((m) => ({ m, r: rankMovie(m, q) }))
          .filter((x) => x.r >= 0)
          .sort(
            (a, b) =>
              a.r - b.r ||
              a.m.title.localeCompare(b.m.title, undefined, {
                sensitivity: "base",
              }),
          )
          .slice(0, limit)
          .map(({ m }) => mapMovieHit(m, q))
      : [];
    const seriesHits = wantTv
      ? series
          .map((s) => ({ s, r: rankSeries(s, q) }))
          .filter((x) => x.r >= 0)
          .sort(
            (a, b) =>
              a.r - b.r ||
              a.s.title.localeCompare(b.s.title, undefined, {
                sensitivity: "base",
              }),
          )
          .slice(0, limit)
          .map(({ s }) => mapSeriesHit(s))
      : [];
    const peopleHits = wantPeople
      ? people
          .map((p) => ({ p, r: rankPerson(p, q) }))
          .filter((x) => x.r >= 0)
          .sort(
            (a, b) =>
              a.r - b.r ||
              a.p.name.localeCompare(b.p.name, undefined, {
                sensitivity: "base",
              }),
          )
          .slice(0, limit)
          .map(({ p }) => mapPersonHit(p))
      : [];
    return { movies: movieHits, series: seriesHits, people: peopleHits };
  }

  if (scope === "movies") {
    const movieHits = movies
      .map((m) => ({ m, r: rankMovie(m, q) }))
      .filter((x) => x.r >= 0)
      .sort(
        (a, b) =>
          a.r - b.r ||
          a.m.title.localeCompare(b.m.title, undefined, {
            sensitivity: "base",
          }),
      )
      .slice(0, limit)
      .map(({ m }) => mapMovieHit(m, q));
    return { movies: movieHits, series: [], people: [] };
  }

  if (scope === "tv") {
    const seriesHits = series
      .map((s) => ({ s, r: rankSeries(s, q) }))
      .filter((x) => x.r >= 0)
      .sort(
        (a, b) =>
          a.r - b.r ||
          a.s.title.localeCompare(b.s.title, undefined, {
            sensitivity: "base",
          }),
      )
      .slice(0, limit)
      .map(({ s }) => mapSeriesHit(s));
    return { movies: [], series: seriesHits, people: [] };
  }

  if (scope === "people") {
    const peopleHits = people
      .map((p) => ({ p, r: rankPerson(p, q) }))
      .filter((x) => x.r >= 0)
      .sort(
        (a, b) =>
          a.r - b.r ||
          a.p.name.localeCompare(b.p.name, undefined, {
            sensitivity: "base",
          }),
      )
      .slice(0, limit)
      .map(({ p }) => mapPersonHit(p));
    return { movies: [], series: [], people: peopleHits };
  }

  if (scope === "year") {
    const movieHits = movies
      .map((m) => ({ m, r: rankMovieByYear(m, parsedYear, q) }))
      .filter((x) => x.r >= 0)
      .sort(
        (a, b) =>
          a.r - b.r ||
          b.m.year - a.m.year ||
          a.m.title.localeCompare(b.m.title, undefined, {
            sensitivity: "base",
          }),
      )
      .slice(0, limit)
      .map(({ m }) => mapMovieHit(m, q));
    const seriesHits = series
      .map((s) => ({ s, r: rankSeriesByYear(s, parsedYear, q) }))
      .filter((x) => x.r >= 0)
      .sort(
        (a, b) =>
          a.r - b.r ||
          seriesStartYear(b.s) - seriesStartYear(a.s) ||
          a.s.title.localeCompare(b.s.title, undefined, {
            sensitivity: "base",
          }),
      )
      .slice(0, limit)
      .map(({ s }) => mapSeriesHit(s));
    return {
      movies: movieHits,
      series: seriesHits,
      people: [],
      parsedYear,
    };
  }

  if (scope === "actor") {
    const peopleHits = people
      .map((p) => ({
        p,
        r: rankPerson(p, q),
        acting: actingRole(p.role),
      }))
      .filter((x) => x.r >= 0)
      .sort(
        (a, b) =>
          (a.acting === b.acting ? 0 : a.acting ? -1 : 1) ||
          a.r - b.r ||
          a.p.name.localeCompare(b.p.name, undefined, {
            sensitivity: "base",
          }),
      )
      .slice(0, limit)
      .map(({ p }) => mapPersonHit(p));
    const movieHits = movies
      .filter((m) => movieCastMatches(m, q))
      .slice(0, limit)
      .map((m) => mapMovieHit(m, q));
    const seriesHits = series
      .filter((s) => seriesCastMatches(s, q))
      .slice(0, limit)
      .map((s) => mapSeriesHit(s));
    return { movies: movieHits, series: seriesHits, people: peopleHits };
  }

  if (scope === "director") {
    const f = fold(q);
    const movieHits = movies
      .filter((m) => m.director && fold(m.director).includes(f))
      .sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      )
      .slice(0, limit)
      .map((m) => mapMovieHit(m, q));
    const seriesHits = series
      .filter((s) => s.director && fold(s.director).includes(f))
      .sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      )
      .slice(0, limit)
      .map((s) => mapSeriesHit(s));
    let peopleHits = people
      .filter((p) => rankPerson(p, q) >= 0 && directorRole(p.role))
      .sort((a, b) => rankPerson(a, q) - rankPerson(b, q))
      .slice(0, limit)
      .map((p) => mapPersonHit(p));
    if (peopleHits.length === 0 && f.length > 0) {
      peopleHits = people
        .filter((p) => directorRole(p.role) && fold(p.name).includes(f))
        .slice(0, limit)
        .map((p) => mapPersonHit(p));
    }
    return { movies: movieHits, series: seriesHits, people: peopleHits };
  }

  return { movies: [], series: [], people: [] };
}
