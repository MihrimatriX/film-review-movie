import type { Locale } from "@/lib/i18n";
import { formatFoundCount, formatSeriesFound, t } from "@/lib/i18n";
import Link from "next/link";
import type { ReactNode } from "react";

export type TopBarFoundKind = "movies" | "people" | "ratings" | "series";

type Props = {
  locale: Locale;
  found: { kind: TopBarFoundKind; count: number };
  listHref: string;
  gridHref: string;
  active: "list" | "grid";
  /** Client control wired to `?sort=` (wrap in `<Suspense>` when using `useSearchParams`). */
  sortControl?: ReactNode;
  /** When false, hides the list/grid toggle (e.g. single-layout index like TV series). */
  viewToggle?: boolean;
  userVariant?: boolean;
  children?: ReactNode;
};

export function TopBarFilter({
  locale,
  found,
  listHref,
  gridHref,
  active,
  sortControl,
  viewToggle = true,
  userVariant,
  children,
}: Props) {
  const s = t(locale).topBar;
  const summary =
    found.kind === "movies"
      ? formatFoundCount(s.moviesFound, found.count)
      : found.kind === "people"
        ? formatFoundCount(s.peopleFound, found.count)
        : found.kind === "series"
          ? formatSeriesFound(locale, found.count)
          : formatFoundCount(s.ratingsFound, found.count);

  return (
    <div
      className={`flex flex-col gap-3 border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${userVariant ? "" : ""}`}
    >
      <p className="text-sm text-[var(--cv-muted)]">
        <span className="font-bold text-[var(--cv-accent)]">{summary}</span>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {sortControl ? (
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs uppercase text-[var(--cv-muted)]">
              {s.sortBy}:
            </label>
            {sortControl}
          </div>
        ) : null}
        {viewToggle ? (
          <div className="flex rounded border border-[var(--cv-border-strong)]">
            <Link
              href={listHref}
              className={`px-3 py-1.5 text-lg ${active === "list" ? "bg-[var(--cv-red)] text-[var(--cv-on-red)]" : "text-[var(--cv-muted)] hover:text-[var(--cv-heading)]"}`}
              aria-label={s.viewList}
              title={s.viewList}
            >
              ≡
            </Link>
            <Link
              href={gridHref}
              className={`px-3 py-1.5 text-lg ${active === "grid" ? "bg-[var(--cv-red)] text-[var(--cv-on-red)]" : "text-[var(--cv-muted)] hover:text-[var(--cv-heading)]"}`}
              aria-label={s.viewGrid}
              title={s.viewGrid}
            >
              ⊞
            </Link>
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
