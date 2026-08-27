"use client";

import { CelebrityPortraitImage } from "@/components/CelebrityPortraitImage";
import type { SiteSearchResponse, SiteSearchScope } from "@/lib/site-search";
import { parseYearFromSearchQuery } from "@/lib/site-search";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

function useDebounced<T>(value: T, ms: number): T {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return d;
}

type Labels = {
  searchNoResults: string;
  searchLoading: string;
  searchSeeAllMovies: string;
  searchSeeAllSeries: string;
  searchSeeAllPeople: string;
  searchSubmit: string;
  searchPanelAll: string;
  searchPanelMovies: string;
  searchPanelTv: string;
  searchPanelYear: string;
  searchPanelActor: string;
  searchPanelDirector: string;
  searchPanelPeople: string;
  searchHintAll: string;
  searchHintMovies: string;
  searchHintTv: string;
  searchHintYear: string;
  searchHintActor: string;
  searchHintDirector: string;
  searchHintPeople: string;
  searchYearMovies: string;
  searchYearSeries: string;
  searchCastMovies: string;
  searchCastSeries: string;
  searchDirMovies: string;
  searchDirSeries: string;
};

type SectionTitles = {
  movies: string;
  series: string;
  people: string;
};

type SectionKind = "movies" | "series" | "people";

function sectionOrder(scope: SiteSearchScope): SectionKind[] {
  switch (scope) {
    case "year":
      return ["movies", "series"];
    case "actor":
      return ["people", "movies", "series"];
    case "director":
      return ["movies", "series", "people"];
    case "people":
      return ["people"];
    case "movies":
      return ["movies"];
    case "tv":
      return ["series"];
    default:
      return ["movies", "series", "people"];
  }
}

function panelAccent(scope: SiteSearchScope): string {
  switch (scope) {
    case "year":
      return "border-l-4 border-l-[var(--cv-red)]";
    case "actor":
      return "border-l-4 border-l-amber-500/80";
    case "director":
      return "border-l-4 border-l-sky-500/70";
    case "people":
      return "border-l-4 border-l-violet-500/70";
    case "movies":
      return "border-l-4 border-l-[var(--cv-accent)]";
    case "tv":
      return "border-l-4 border-l-emerald-600/70";
    default:
      return "border-l-4 border-l-[var(--cv-accent)]/60";
  }
}

/** Arama kapsami secimine gore select cerceve/odak rengi (panelAccent ile uyumlu). */
function scopeSelectChrome(scope: SiteSearchScope): string {
  const base =
    "max-w-[9.5rem] shrink-0 rounded border-2 bg-[var(--cv-input)] px-2 py-2 text-sm font-semibold text-[var(--cv-heading)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--cv-deep)]";
  switch (scope) {
    case "year":
      return `${base} border-red-500/65 focus:border-red-500 focus:ring-red-500/35`;
    case "actor":
      return `${base} border-amber-500/65 focus:border-amber-500 focus:ring-amber-500/35`;
    case "director":
      return `${base} border-sky-500/65 focus:border-sky-500 focus:ring-sky-500/35`;
    case "people":
      return `${base} border-violet-500/65 focus:border-violet-500 focus:ring-violet-500/35`;
    case "movies":
      return `${base} border-[color-mix(in_srgb,var(--cv-accent)_75%,var(--cv-border-strong))] focus:border-[var(--cv-accent)] focus:ring-[var(--cv-accent)]/35`;
    case "tv":
      return `${base} border-emerald-600/65 focus:border-emerald-500 focus:ring-emerald-500/35`;
    default:
      return `${base} border-[var(--cv-border-strong)] focus:border-[var(--cv-accent)]/80 focus:ring-[var(--cv-accent)]/30`;
  }
}

function panelTitleHint(
  scope: SiteSearchScope,
  L: Labels,
): { title: string; hint: string } {
  switch (scope) {
    case "movies":
      return { title: L.searchPanelMovies, hint: L.searchHintMovies };
    case "tv":
      return { title: L.searchPanelTv, hint: L.searchHintTv };
    case "year":
      return { title: L.searchPanelYear, hint: L.searchHintYear };
    case "actor":
      return { title: L.searchPanelActor, hint: L.searchHintActor };
    case "director":
      return { title: L.searchPanelDirector, hint: L.searchHintDirector };
    case "people":
      return { title: L.searchPanelPeople, hint: L.searchHintPeople };
    default:
      return { title: L.searchPanelAll, hint: L.searchHintAll };
  }
}

const SCOPE_OPTIONS: SiteSearchScope[] = [
  "all",
  "movies",
  "tv",
  "year",
  "actor",
  "director",
  "people",
];

export function HeaderSearch({
  locale,
  className = "",
  compact = false,
  searchPlaceholder,
  searchScope,
  labels,
  sectionTitles,
}: {
  locale: Locale;
  className?: string;
  compact?: boolean;
  searchPlaceholder: string;
  searchScope: Record<SiteSearchScope, string>;
  labels: Labels;
  sectionTitles: SectionTitles;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seqRef = useRef(0);

  const [rawQ, setRawQ] = useState("");
  const [scope, setScope] = useState<SiteSearchScope>("all");
  const debouncedQ = useDebounced(rawQ, 280);
  const [data, setData] = useState<SiteSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const trimmed = rawQ.trim();
  const debouncedTrim = debouncedQ.trim();

  useEffect(() => {
    if (!debouncedTrim) {
      seqRef.current += 1;
      setData(null);
      setLoading(false);
      return;
    }

    const myId = ++seqRef.current;
    const ac = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const r = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedTrim)}&scope=${scope}`,
          { signal: ac.signal },
        );
        const json = (await r.json()) as SiteSearchResponse;
        if (seqRef.current === myId) setData(json);
      } catch (e) {
        if ((e as Error).name !== "AbortError" && seqRef.current === myId) {
          setData({ movies: [], series: [], people: [] });
        }
      } finally {
        if (seqRef.current === myId) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [debouncedTrim, scope]);

  useEffect(() => {
    if (!panelOpen) return;
    const onDoc = (e: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setPanelOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanelOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const totalHits =
    (data?.movies.length ?? 0) +
    (data?.series.length ?? 0) +
    (data?.people.length ?? 0);

  const pendingSync = trimmed.length > 0 && trimmed !== debouncedTrim;

  const showPanel =
    panelOpen &&
    trimmed.length > 0 &&
    (loading || pendingSync || data !== null);

  const enc = encodeURIComponent(trimmed);
  const qParam = encodeURIComponent(debouncedTrim || trimmed);

  const yearForBrowse = useMemo(() => {
    if (scope !== "year") return undefined;
    return data?.parsedYear ?? parseYearFromSearchQuery(trimmed);
  }, [scope, data?.parsedYear, trimmed]);

  const submitTarget = useCallback(() => {
    switch (scope) {
      case "tv":
        return `/series?q=${enc}`;
      case "movies":
        return `/movies?q=${enc}`;
      case "year": {
        const y = parseYearFromSearchQuery(trimmed);
        if (y !== undefined) return `/movies?fromYear=${y}&toYear=${y}`;
        return `/movies/list?q=${enc}`;
      }
      case "actor":
        return `/movies/list?stars=${enc}`;
      case "director":
        return `/movies/list?director=${enc}`;
      case "people":
        return `/celebrities?q=${enc}`;
      default:
        return `/movies?q=${enc}`;
    }
  }, [scope, trimmed, enc]);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    setPanelOpen(false);
    router.push(submitTarget());
  };

  const order = sectionOrder(scope);
  const { title: panelTitle, hint: panelHint } = panelTitleHint(scope, labels);
  const accent = panelAccent(scope);

  const moviesFooter = (() => {
    if (scope === "all" || scope === "movies")
      return { href: `/movies?q=${qParam}`, label: labels.searchSeeAllMovies };
    if (scope === "year" && yearForBrowse !== undefined)
      return {
        href: `/movies?fromYear=${yearForBrowse}&toYear=${yearForBrowse}`,
        label: labels.searchYearMovies,
      };
    if (scope === "year")
      return {
        href: `/movies/list?q=${qParam}`,
        label: labels.searchSeeAllMovies,
      };
    if (scope === "actor")
      return {
        href: `/movies/list?stars=${enc}`,
        label: labels.searchCastMovies,
      };
    if (scope === "director")
      return {
        href: `/movies/list?director=${enc}`,
        label: labels.searchDirMovies,
      };
    return null;
  })();

  const seriesFooter = (() => {
    if (scope === "all" || scope === "tv")
      return { href: `/series?q=${qParam}`, label: labels.searchSeeAllSeries };
    if (scope === "year" && yearForBrowse !== undefined)
      return {
        href: `/series?fromYear=${yearForBrowse}&toYear=${yearForBrowse}`,
        label: labels.searchYearSeries,
      };
    if (scope === "year")
      return { href: `/series?q=${qParam}`, label: labels.searchSeeAllSeries };
    if (scope === "actor")
      return { href: `/series?stars=${enc}`, label: labels.searchCastSeries };
    if (scope === "director")
      return { href: `/series?director=${enc}`, label: labels.searchDirSeries };
    return null;
  })();

  const peopleFooter =
    scope === "all" ||
    scope === "actor" ||
    scope === "director" ||
    scope === "people"
      ? { href: `/celebrities?q=${qParam}`, label: labels.searchSeeAllPeople }
      : null;

  const renderMovies =
    order.includes("movies") && (data?.movies.length ?? 0) > 0;
  const renderSeries =
    order.includes("series") && (data?.series.length ?? 0) > 0;
  const renderPeople =
    order.includes("people") && (data?.people.length ?? 0) > 0;

  return (
    <div ref={rootRef} className={`relative min-w-0 flex-1 ${className}`}>
      <form
        onSubmit={onSubmitForm}
        className={`flex gap-2 ${compact ? "flex-col" : ""}`}
        role="search"
      >
        <label className="sr-only" htmlFor={listId}>
          {searchPlaceholder}
        </label>
        <select
          className={scopeSelectChrome(scope)}
          aria-label={locale === "tr" ? "Arama kapsamı" : "Search scope"}
          value={scope}
          onChange={(e) => setScope(e.target.value as SiteSearchScope)}
        >
          {SCOPE_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {searchScope[v]}
            </option>
          ))}
        </select>
        <div className="flex min-w-0 flex-1 gap-2">
          <input
            ref={inputRef}
            id={listId}
            type="search"
            name="q"
            autoComplete="off"
            placeholder={searchPlaceholder}
            value={rawQ}
            onChange={(e) => {
              setRawQ(e.target.value);
              setPanelOpen(true);
            }}
            onFocus={() => setPanelOpen(true)}
            className="min-w-0 flex-1 rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)] placeholder:text-[var(--cv-faint)] focus:border-[var(--cv-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--cv-accent)]/40"
          />
          <button
            type="submit"
            className="shrink-0 rounded bg-[var(--cv-amber-btn)] px-3 py-2 text-sm font-bold uppercase text-[var(--cv-deep)]"
          >
            {labels.searchSubmit}
          </button>
        </div>
      </form>

      {showPanel ? (
        <div
          className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-[min(70vh,28rem)] overflow-y-auto rounded border border-[var(--cv-border-strong)] bg-[var(--cv-card)] shadow-lg"
          role="listbox"
          aria-label={searchPlaceholder}
        >
          <div
            className={`border-b border-[var(--cv-border)] bg-[color-mix(in_srgb,var(--cv-deep)_55%,transparent)] px-3 py-2 ${accent}`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--cv-accent)]">
              {panelTitle}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-[var(--cv-muted)]">
              {panelHint}
            </p>
          </div>
          <div className="py-2">
            {loading || pendingSync ? (
              <p className="px-3 py-2 text-sm text-[var(--cv-muted)]">
                {labels.searchLoading}
              </p>
            ) : null}

            {!loading && !pendingSync && data && totalHits === 0 ? (
              <div className="px-3 py-2">
                <p className="text-sm text-[var(--cv-muted)]">
                  {labels.searchNoResults}
                </p>
                {scope === "year" && yearForBrowse !== undefined ? (
                  <div className="mt-2 flex flex-col gap-1.5 text-xs font-semibold">
                    <Link
                      href={`/movies?fromYear=${yearForBrowse}&toYear=${yearForBrowse}`}
                      className="text-[var(--cv-accent)] hover:underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPanelOpen(false)}
                    >
                      {labels.searchYearMovies}
                    </Link>
                    <Link
                      href={`/series?fromYear=${yearForBrowse}&toYear=${yearForBrowse}`}
                      className="text-[var(--cv-accent)] hover:underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPanelOpen(false)}
                    >
                      {labels.searchYearSeries}
                    </Link>
                  </div>
                ) : null}
                {scope === "actor" ? (
                  <div className="mt-2 flex flex-col gap-1.5 text-xs font-semibold">
                    <Link
                      href={`/movies/list?stars=${enc}`}
                      className="text-[var(--cv-accent)] hover:underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPanelOpen(false)}
                    >
                      {labels.searchCastMovies}
                    </Link>
                    <Link
                      href={`/series?stars=${enc}`}
                      className="text-[var(--cv-accent)] hover:underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPanelOpen(false)}
                    >
                      {labels.searchCastSeries}
                    </Link>
                  </div>
                ) : null}
                {scope === "director" ? (
                  <div className="mt-2 flex flex-col gap-1.5 text-xs font-semibold">
                    <Link
                      href={`/movies/list?director=${enc}`}
                      className="text-[var(--cv-accent)] hover:underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPanelOpen(false)}
                    >
                      {labels.searchDirMovies}
                    </Link>
                    <Link
                      href={`/series?director=${enc}`}
                      className="text-[var(--cv-accent)] hover:underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPanelOpen(false)}
                    >
                      {labels.searchDirSeries}
                    </Link>
                  </div>
                ) : null}
                {scope === "people" ? (
                  <Link
                    href={`/celebrities?q=${qParam}`}
                    className="mt-2 inline-block text-xs font-semibold text-[var(--cv-accent)] hover:underline"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setPanelOpen(false)}
                  >
                    {labels.searchSeeAllPeople}
                  </Link>
                ) : null}
              </div>
            ) : null}

            {renderMovies ? (
              <div className="border-b border-[var(--cv-border)] pb-2">
                <p className="px-3 py-1 text-xs font-bold uppercase text-[var(--cv-accent)]">
                  {sectionTitles.movies}
                </p>
                <ul className="space-y-0.5">
                  {data!.movies.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/movies/${m.slug}`}
                        className="flex gap-2 px-3 py-2 text-sm hover:bg-[var(--cv-deep)]"
                        onClick={() => setPanelOpen(false)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-[var(--cv-border)]">
                          <Image
                            src={m.poster}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-[var(--cv-heading)]">
                            {m.title}{" "}
                            <span className="font-normal text-[var(--cv-muted)]">
                              ({m.year})
                            </span>
                          </span>
                          {m.subtitle ? (
                            <span className="line-clamp-2 text-xs text-[var(--cv-muted)]">
                              {m.subtitle}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {moviesFooter ? (
                  <Link
                    href={moviesFooter.href}
                    className="mt-1 block px-3 py-1.5 text-xs font-semibold text-[var(--cv-accent)] hover:underline"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setPanelOpen(false)}
                  >
                    {moviesFooter.label}
                  </Link>
                ) : null}
              </div>
            ) : null}

            {renderSeries ? (
              <div className="border-b border-[var(--cv-border)] pb-2">
                <p className="px-3 py-1 text-xs font-bold uppercase text-[var(--cv-accent)]">
                  {sectionTitles.series}
                </p>
                <ul className="space-y-0.5">
                  {data!.series.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/series/${s.slug}`}
                        className="flex gap-2 px-3 py-2 text-sm hover:bg-[var(--cv-deep)]"
                        onClick={() => setPanelOpen(false)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-[var(--cv-border)]">
                          <Image
                            src={s.poster}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-[var(--cv-heading)]">
                            {s.title}
                          </span>
                          {s.yearLabel ? (
                            <span className="text-xs text-[var(--cv-muted)]">
                              {s.yearLabel}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {seriesFooter ? (
                  <Link
                    href={seriesFooter.href}
                    className="mt-1 block px-3 py-1.5 text-xs font-semibold text-[var(--cv-accent)] hover:underline"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setPanelOpen(false)}
                  >
                    {seriesFooter.label}
                  </Link>
                ) : null}
              </div>
            ) : null}

            {renderPeople ? (
              <div className="pb-1">
                <p className="px-3 py-1 text-xs font-bold uppercase text-[var(--cv-accent)]">
                  {sectionTitles.people}
                </p>
                <ul className="space-y-0.5">
                  {data!.people.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/celebrities/${p.slug}`}
                        className="flex gap-2 px-3 py-2 text-sm hover:bg-[var(--cv-deep)]"
                        onClick={() => setPanelOpen(false)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-full bg-[var(--cv-border)]">
                          <CelebrityPortraitImage
                            initialSrc={p.image}
                            alt=""
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-[var(--cv-heading)]">
                            {p.name}
                          </span>
                          <span className="text-xs text-[var(--cv-muted)]">
                            {p.role}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {peopleFooter ? (
                  <Link
                    href={peopleFooter.href}
                    className="mt-1 block px-3 py-1.5 text-xs font-semibold text-[var(--cv-accent)] hover:underline"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setPanelOpen(false)}
                  >
                    {peopleFooter.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
