"use client";

import { PosterCard3D } from "@/components/cards/PosterCard3D";
import { HeartIcon } from "@/components/library/WatchlistButton";
import { useUi } from "@/components/ui/UiProvider";
import {
  clearRatings,
  clearWatchlist,
  useLibrary,
  type LibraryKind,
} from "@/lib/user-library";
import Link from "next/link";
import { useMemo, useState } from "react";

type Tab = "watchlist" | "ratings";
type KindFilter = "all" | LibraryKind;

export function WatchlistView() {
  const { ui } = useUi();
  const library = useLibrary();
  const [tab, setTab] = useState<Tab>("watchlist");
  const [kind, setKind] = useState<KindFilter>("all");

  const ratings = useMemo(
    () =>
      Object.values(library.ratings).sort(
        (a, b) => b.value - a.value || b.ratedAt - a.ratedAt,
      ),
    [library.ratings],
  );

  const items = (tab === "watchlist" ? library.watchlist : ratings).filter(
    (i) => kind === "all" || i.kind === kind,
  );
  const total = tab === "watchlist" ? library.watchlist.length : ratings.length;

  const tabBtn = (key: Tab, label: string, count: number) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === key}
      onClick={() => setTab(key)}
      className={`relative px-1 pb-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase tracking-wide transition-colors ${
        tab === key
          ? "text-[var(--cv-accent)]"
          : "text-[var(--cv-muted)] hover:text-[var(--cv-heading)]"
      }`}
    >
      {label}
      <span className="ml-2 rounded-full bg-[var(--cv-card)] px-2 py-0.5 text-[11px] tabular-nums text-[var(--cv-heading)] ring-1 ring-[var(--cv-border)]">
        {count}
      </span>
      {tab === key ? (
        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--cv-accent)]" />
      ) : null}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--cv-border)]">
        <div className="flex gap-6" role="tablist">
          {tabBtn("watchlist", ui.watchlist, library.watchlist.length)}
          {tabBtn("ratings", ui.myRatings, ratings.length)}
        </div>
        <div className="mb-3 flex items-center gap-2">
          {(["all", "movie", "series"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase transition ${
                kind === k
                  ? "border-[var(--cv-accent)] bg-[color-mix(in_srgb,var(--cv-accent)_14%,transparent)] text-[var(--cv-accent)]"
                  : "border-[var(--cv-border-strong)] text-[var(--cv-muted)] hover:text-[var(--cv-heading)]"
              }`}
            >
              {k === "all" ? ui.all : k === "movie" ? ui.movie : ui.series}
            </button>
          ))}
          {total > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(ui.confirmClear)) return;
                if (tab === "watchlist") clearWatchlist();
                else clearRatings();
              }}
              className="ml-2 text-xs text-[var(--cv-faint)] underline-offset-2 hover:text-[var(--cv-red)] hover:underline"
            >
              {ui.clearAll}
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--cv-faint)]">{ui.watchlistHint}</p>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-[var(--cv-border-strong)] bg-[var(--cv-card)]/40 px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[color-mix(in_srgb,var(--cv-red)_15%,transparent)] text-[var(--cv-red)]">
            <HeartIcon filled={false} className="h-8 w-8" />
          </span>
          <p className="mt-5 max-w-md text-[var(--cv-muted)]">
            {tab === "watchlist" ? ui.watchlistEmpty : ui.myRatingsEmpty}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/movies"
              className="rounded-md bg-[var(--cv-red)] px-5 py-2.5 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)] hover:brightness-110"
            >
              {ui.browseMovies}
            </Link>
            <Link
              href="/series"
              className="rounded-md border border-[var(--cv-border-strong)] px-5 py-2.5 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-heading)] hover:border-[var(--cv-accent)]"
            >
              {ui.browseSeries}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((it) => (
            <div key={`${it.kind}:${it.slug}`} className="cv-pop-in">
              <PosterCard3D
                href={`/${it.kind === "movie" ? "movies" : "series"}/${it.slug}`}
                item={it}
                yearLabel={`${it.kind === "movie" ? ui.movie : ui.series} · ${it.year}`}
                variant={it.kind === "movie" ? "film" : "series"}
                footerExtra={
                  "value" in it ? (
                    <span className="ml-auto rounded bg-[color-mix(in_srgb,var(--cv-star)_18%,transparent)] px-1.5 font-bold text-[var(--cv-star)]">
                      {ui.myRating}: {it.value}
                    </span>
                  ) : null
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
