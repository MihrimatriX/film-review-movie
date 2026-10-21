import {
  listingHref,
  MOVIE_LIST_QS_KEYS,
  pickSearchParam,
  SERIES_LIST_QS_KEYS,
  type SearchParamsLike,
} from "@/lib/listing-sort";

export type FilterChipL10n = {
  chipSearch: string;
  chipSort: string;
  chipYearFrom: string;
  chipYearTo: string;
  chipMinRating: string;
  chipGenre: string;
  chipDirector: string;
  chipCast: string;
};

export type FilterChip = { label: string; href: string };

function sortLabel(
  sortOptions: Record<string, string>,
  value: string,
): string {
  return sortOptions[value] ?? value;
}

/** Aktif film süzgeçleri — tek tıkla kaldırma bağlantıları (sayfa 1’e döner). */
export function buildMovieFilterChips(
  pathname: string,
  sp: SearchParamsLike,
  l10n: FilterChipL10n,
  sortOptions: Record<string, string>,
): FilterChip[] {
  const chips: FilterChip[] = [];
  const keys = MOVIE_LIST_QS_KEYS;

  const q = pickSearchParam(sp, "q")?.trim();
  if (q) {
    chips.push({
      label: `${l10n.chipSearch}: “${q}”`,
      href: listingHref(pathname, sp, keys, { q: undefined, page: "1" }),
    });
  }

  const sort = pickSearchParam(sp, "sort") ?? "";
  if (sort && sort !== "featured") {
    chips.push({
      label: `${l10n.chipSort}: ${sortLabel(sortOptions, sort)}`,
      href: listingHref(pathname, sp, keys, { sort: undefined, page: "1" }),
    });
  }

  const fromY = pickSearchParam(sp, "fromYear")?.trim();
  if (fromY) {
    chips.push({
      label: `${l10n.chipYearFrom}: ${fromY}`,
      href: listingHref(pathname, sp, keys, { fromYear: undefined, page: "1" }),
    });
  }

  const toY = pickSearchParam(sp, "toYear")?.trim();
  if (toY) {
    chips.push({
      label: `${l10n.chipYearTo}: ${toY}`,
      href: listingHref(pathname, sp, keys, { toYear: undefined, page: "1" }),
    });
  }

  const minR = pickSearchParam(sp, "minRating")?.trim();
  if (minR) {
    chips.push({
      label: `${l10n.chipMinRating}: ≥${minR}`,
      href: listingHref(pathname, sp, keys, { minRating: undefined, page: "1" }),
    });
  }

  const genre = pickSearchParam(sp, "genre")?.trim();
  if (genre) {
    chips.push({
      label: `${l10n.chipGenre}: ${genre}`,
      href: listingHref(pathname, sp, keys, { genre: undefined, page: "1" }),
    });
  }

  const director = pickSearchParam(sp, "director")?.trim();
  if (director) {
    chips.push({
      label: `${l10n.chipDirector}: “${director}”`,
      href: listingHref(pathname, sp, keys, { director: undefined, page: "1" }),
    });
  }

  const stars = pickSearchParam(sp, "stars")?.trim();
  if (stars) {
    chips.push({
      label: `${l10n.chipCast}: “${stars}”`,
      href: listingHref(pathname, sp, keys, { stars: undefined, page: "1" }),
    });
  }

  return chips;
}

export function clearMovieFiltersHref(
  pathname: string,
  sp: SearchParamsLike,
): string {
  return listingHref(pathname, sp, MOVIE_LIST_QS_KEYS, {
    q: undefined,
    sort: undefined,
    fromYear: undefined,
    toYear: undefined,
    minRating: undefined,
    genre: undefined,
    director: undefined,
    stars: undefined,
    page: "1",
  });
}

/** Aktif dizi süzgeçleri. */
export function buildSeriesFilterChips(
  pathname: string,
  sp: SearchParamsLike,
  l10n: FilterChipL10n,
  sortOptions: Record<string, string>,
): FilterChip[] {
  const chips: FilterChip[] = [];
  const keys = SERIES_LIST_QS_KEYS;

  const q = pickSearchParam(sp, "q")?.trim();
  if (q) {
    chips.push({
      label: `${l10n.chipSearch}: “${q}”`,
      href: listingHref(pathname, sp, keys, { q: undefined, page: "1" }),
    });
  }

  const sort = pickSearchParam(sp, "sort") ?? "";
  if (sort && sort !== "featured") {
    chips.push({
      label: `${l10n.chipSort}: ${sortLabel(sortOptions, sort)}`,
      href: listingHref(pathname, sp, keys, { sort: undefined, page: "1" }),
    });
  }

  const fromY = pickSearchParam(sp, "fromYear")?.trim();
  if (fromY) {
    chips.push({
      label: `${l10n.chipYearFrom}: ${fromY}`,
      href: listingHref(pathname, sp, keys, { fromYear: undefined, page: "1" }),
    });
  }

  const toY = pickSearchParam(sp, "toYear")?.trim();
  if (toY) {
    chips.push({
      label: `${l10n.chipYearTo}: ${toY}`,
      href: listingHref(pathname, sp, keys, { toYear: undefined, page: "1" }),
    });
  }

  const minR = pickSearchParam(sp, "minRating")?.trim();
  if (minR) {
    chips.push({
      label: `${l10n.chipMinRating}: ≥${minR}`,
      href: listingHref(pathname, sp, keys, { minRating: undefined, page: "1" }),
    });
  }

  const genre = pickSearchParam(sp, "genre")?.trim();
  if (genre) {
    chips.push({
      label: `${l10n.chipGenre}: ${genre}`,
      href: listingHref(pathname, sp, keys, { genre: undefined, page: "1" }),
    });
  }

  const director = pickSearchParam(sp, "director")?.trim();
  if (director) {
    chips.push({
      label: `${l10n.chipDirector}: “${director}”`,
      href: listingHref(pathname, sp, keys, { director: undefined, page: "1" }),
    });
  }

  const stars = pickSearchParam(sp, "stars")?.trim();
  if (stars) {
    chips.push({
      label: `${l10n.chipCast}: “${stars}”`,
      href: listingHref(pathname, sp, keys, { stars: undefined, page: "1" }),
    });
  }

  return chips;
}

export function clearSeriesFiltersHref(
  pathname: string,
  sp: SearchParamsLike,
): string {
  return listingHref(pathname, sp, SERIES_LIST_QS_KEYS, {
    q: undefined,
    sort: undefined,
    fromYear: undefined,
    toYear: undefined,
    minRating: undefined,
    genre: undefined,
    director: undefined,
    stars: undefined,
    page: "1",
  });
}
