import type { ListingSortOption } from "@/components/ListingSortSelect";

/** Labels from `t(locale).topBar` */
export function movieSortSelectOptions(tb: {
  sortPopularity: string;
  sortRating: string;
  sortRelease: string;
  sortTitle: string;
}): ListingSortOption[] {
  return [
    { value: "featured", label: tb.sortPopularity },
    { value: "rating", label: tb.sortRating },
    { value: "year", label: tb.sortRelease },
    { value: "title", label: tb.sortTitle },
  ];
}

export function seriesSortSelectOptions(tb: {
  sortPopularity: string;
  sortRating: string;
  sortRelease: string;
  sortTitle: string;
}): ListingSortOption[] {
  return movieSortSelectOptions(tb);
}

export function celebritySortSelectOptions(tb: {
  sortPopularity: string;
  sortNameAsc: string;
  sortNameDesc: string;
}): ListingSortOption[] {
  return [
    { value: "featured", label: tb.sortPopularity },
    { value: "name-asc", label: tb.sortNameAsc },
    { value: "name-desc", label: tb.sortNameDesc },
  ];
}
