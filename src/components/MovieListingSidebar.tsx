import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { movieSortSelectOptions } from "@/lib/listing-sort-ui";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  locale: Locale;
  formAction: string;
  defaults: {
    q: string;
    sort: string;
    fromYear: string;
    toYear: string;
    minRating: string;
    genre: string;
    director: string;
    stars: string;
    /** Preserved when applying filters (TMDB catalog pagination). */
    discoverPage?: string;
    pageSize?: string;
  };
  yearMin: number;
  yearMax: number;
  genres: string[];
  /** Aktif süzgeç rozetleri (sunucuda `buildMovieFilterChips` ile üretilir). */
  filterChips?: { label: string; href: string }[];
  clearAllHref?: string;
};

function yearOptions(from: number, to: number): number[] {
  const out: number[] = [];
  for (let y = to; y >= from; y--) out.push(y);
  return out;
}

function FieldSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2 border-t border-[var(--cv-border)] pt-3 first:border-t-0 first:pt-0">
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wide text-[var(--cv-accent)]">
          {title}
        </h5>
        {hint ? (
          <p className="mt-0.5 text-[11px] leading-snug text-[var(--cv-muted)]">
            {hint}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function MovieListingSidebar({
  locale,
  formAction,
  defaults,
  yearMin,
  yearMax,
  genres,
  filterChips = [],
  clearAllHref,
}: Props) {
  const L = t(locale).listings;
  const tb = t(locale).topBar;
  const sortOpts = movieSortSelectOptions(tb);
  const years = yearOptions(yearMin, yearMax);
  const showChips = filterChips.length > 0;

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 shadow-sm">
        <h4 className="border-b border-[var(--cv-accent)] pb-2 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase tracking-wide text-[var(--cv-heading)]">
          {L.filterHeading}
        </h4>

        {showChips ? (
          <div className="mt-4 space-y-2 rounded-md border border-[color-mix(in_srgb,var(--cv-accent)_22%,var(--cv-border))] bg-[color-mix(in_srgb,var(--cv-accent)_6%,var(--cv-deep))] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--cv-muted)]">
              {L.activeFiltersTitle}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {filterChips.map((c, i) => (
                <li key={`${c.href}-${i}`}>
                  <Link
                    href={c.href}
                    className="inline-flex max-w-full items-center gap-1 rounded-full border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-2.5 py-1 text-[11px] font-medium text-[var(--cv-heading)] transition hover:border-[var(--cv-accent)]/50 hover:text-[var(--cv-accent)]"
                    title={L.clearAllFilters}
                  >
                    <span className="truncate">{c.label}</span>
                    <span className="shrink-0 text-[var(--cv-muted)]" aria-hidden>
                      ×
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {clearAllHref ? (
              <Link
                href={clearAllHref}
                className="inline-block text-xs font-bold uppercase text-[var(--cv-red)] hover:underline"
              >
                {L.clearAllFilters}
              </Link>
            ) : null}
          </div>
        ) : null}

        <form method="get" action={formAction} className="mt-4 space-y-0">
          <input type="hidden" name="page" value="1" />
          {defaults.pageSize ? (
            <input type="hidden" name="pageSize" value={defaults.pageSize} />
          ) : null}
          {defaults.discoverPage ? (
            <input
              type="hidden"
              name="discoverPage"
              value={defaults.discoverPage}
            />
          ) : null}

          <FieldSection title={L.sectionSearch} hint={L.sectionSearchHint}>
            <div>
              <label className="sr-only" htmlFor="movie-sidebar-q">
                {L.movieName}
              </label>
              <input
                id="movie-sidebar-q"
                name="q"
                type="search"
                defaultValue={defaults.q}
                placeholder={L.keywordPlaceholder}
                className="w-full rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2.5 text-sm text-[var(--cv-heading)] placeholder:text-[var(--cv-faint)] focus:border-[var(--cv-accent)]/45 focus:outline-none focus:ring-1 focus:ring-[var(--cv-accent)]/30"
              />
            </div>
          </FieldSection>

          <FieldSection title={L.sectionSort} hint={L.sectionSortHint}>
            <div>
              <label className="sr-only" htmlFor="movie-sidebar-sort">
                {L.quickSort}
              </label>
              <select
                id="movie-sidebar-sort"
                name="sort"
                defaultValue={defaults.sort}
                className="w-full rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2.5 text-sm text-[var(--cv-heading)] focus:border-[var(--cv-accent)]/45 focus:outline-none focus:ring-1 focus:ring-[var(--cv-accent)]/30"
              >
                {sortOpts.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldSection>

          <FieldSection title={L.sectionRefine} hint={L.sectionRefineHint}>
            <div className="space-y-3">
              <div>
                <label
                  className="mb-1 block text-xs font-medium text-[var(--cv-body)]"
                  htmlFor="movie-sidebar-genre"
                >
                  {L.genres}
                </label>
                <select
                  id="movie-sidebar-genre"
                  name="genre"
                  defaultValue={defaults.genre}
                  className="w-full rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                >
                  <option value="">{L.allGenres}</option>
                  {genres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="mb-1 block text-xs font-medium text-[var(--cv-body)]"
                  htmlFor="movie-sidebar-rating"
                >
                  {L.ratingRange}
                </label>
                <select
                  id="movie-sidebar-rating"
                  name="minRating"
                  defaultValue={defaults.minRating}
                  className="w-full rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                >
                  <option value="">{L.anyRating}</option>
                  <option value="6">{L.rating6}</option>
                  <option value="7">{L.rating7}</option>
                  <option value="8">{L.rating8}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-[var(--cv-body)]"
                    htmlFor="movie-sidebar-from-y"
                  >
                    {L.fromYear}
                  </label>
                  <select
                    id="movie-sidebar-from-y"
                    name="fromYear"
                    defaultValue={defaults.fromYear}
                    className="w-full rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-2 py-2 text-sm text-[var(--cv-heading)]"
                  >
                    <option value="">{L.anyYear}</option>
                    {years.map((y) => (
                      <option key={`f-${y}`} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-[var(--cv-body)]"
                    htmlFor="movie-sidebar-to-y"
                  >
                    {L.toYear}
                  </label>
                  <select
                    id="movie-sidebar-to-y"
                    name="toYear"
                    defaultValue={defaults.toYear}
                    className="w-full rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-2 py-2 text-sm text-[var(--cv-heading)]"
                  >
                    <option value="">{L.anyYear}</option>
                    {years.map((y) => (
                      <option key={`t-${y}`} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </FieldSection>

          <FieldSection title={L.sectionCredits} hint={L.sectionCreditsHint}>
            <div className="space-y-3">
              <div>
                <label
                  className="mb-1 block text-xs font-medium text-[var(--cv-body)]"
                  htmlFor="movie-sidebar-dir"
                >
                  {L.director}
                </label>
                <input
                  id="movie-sidebar-dir"
                  name="director"
                  type="search"
                  defaultValue={defaults.director}
                  placeholder={L.keywordPlaceholder}
                  className="w-full rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-xs font-medium text-[var(--cv-body)]"
                  htmlFor="movie-sidebar-stars"
                >
                  {L.cast}
                </label>
                <input
                  id="movie-sidebar-stars"
                  name="stars"
                  type="search"
                  defaultValue={defaults.stars}
                  placeholder={L.keywordPlaceholder}
                  className="w-full rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                />
              </div>
            </div>
          </FieldSection>

          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-[var(--cv-red)] py-2.5 text-sm font-bold uppercase tracking-wide text-[var(--cv-on-red)] transition hover:brightness-110"
          >
            {L.apply}
          </button>
        </form>
      </div>
      <div className="rounded-lg border border-[var(--cv-border)] bg-[var(--cv-deep)] p-4 text-xs leading-relaxed text-[var(--cv-muted)]">
        {L.movieAsideHint}
      </div>
    </aside>
  );
}
