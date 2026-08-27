"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { HeaderSearch } from "@/components/HeaderSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

/** True when this nav item should show as the current section. */
function navItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname === "";
  if (href.startsWith("/community")) return pathname.startsWith("/community");
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  locale,
  nav,
  admin,
  searchPlaceholder,
  searchScope,
  searchLabels,
  menuAria,
}: {
  locale: Locale;
  nav: {
    home: string;
    movies: string;
    series: string;
    celebrities: string;
    blog: string;
    community: string;
  };
  admin: string;
  searchPlaceholder: string;
  searchScope: {
    all: string;
    movies: string;
    tv: string;
    year: string;
    actor: string;
    director: string;
    people: string;
  };
  searchLabels: {
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
  menuAria: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const adminActive = pathname.startsWith("/admin");

  const mainLinks = useMemo(
    () => [
      { label: nav.home, href: "/" },
      { label: nav.movies, href: "/movies" },
      { label: nav.series, href: "/series" },
      { label: nav.celebrities, href: "/celebrities" },
      { label: nav.blog, href: "/blog" },
      { label: nav.community, href: "/community/profile" },
    ],
    [nav],
  );

  const sectionTitles = useMemo(
    () => ({
      movies: nav.movies,
      series: nav.series,
      people: nav.celebrities,
    }),
    [nav],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cv-border)] bg-[color-mix(in_srgb,var(--cv-deep)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="shrink-0 outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--cv-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_srgb,var(--cv-deep)_92%,transparent)]"
            aria-label="Film Review — Ana sayfa"
          >
            <BrandLogo variant="header" />
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
            <nav
              className="flex flex-1 flex-wrap items-center justify-center gap-1"
              aria-label={locale === "tr" ? "Site bölümleri" : "Site sections"}
            >
              {mainLinks.map((l) => {
                const active = navItemActive(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded px-2 py-2 font-[family-name:var(--font-dosis)] text-xs font-bold uppercase tracking-wide transition-colors xl:px-3 xl:text-sm ${
                      active
                        ? "bg-[color-mix(in_srgb,var(--cv-accent)_16%,var(--cv-deep))] text-[var(--cv-accent)] shadow-[inset_0_-2px_0_0_var(--cv-accent)]"
                        : "text-[var(--cv-muted)] hover:bg-[var(--cv-card)] hover:text-[var(--cv-accent)]"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/admin"
              aria-current={adminActive ? "page" : undefined}
              className={`shrink-0 rounded px-3 py-2 font-[family-name:var(--font-dosis)] text-xs font-bold uppercase transition-[box-shadow,filter] ${
                adminActive
                  ? "bg-[var(--cv-red)] text-[var(--cv-on-red)] ring-2 ring-[var(--cv-amber-btn)]/80 ring-offset-2 ring-offset-[color-mix(in_srgb,var(--cv-deep)_92%,transparent)]"
                  : "bg-[var(--cv-red)] text-[var(--cv-on-red)] hover:brightness-110"
              }`}
            >
              {admin}
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-[var(--cv-border)] lg:hidden"
            aria-label={menuAria}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="h-0.5 w-5 bg-[var(--cv-amber-btn)]" />
            <span className="h-0.5 w-5 bg-[var(--cv-amber-btn)]" />
            <span className="h-0.5 w-5 bg-[var(--cv-amber-btn)]" />
          </button>
        </div>

        <div className="hidden border-t border-[var(--cv-border)] py-3 lg:block">
          <HeaderSearch
            locale={locale}
            searchPlaceholder={searchPlaceholder}
            searchScope={searchScope}
            labels={searchLabels}
            sectionTitles={sectionTitles}
          />
        </div>
      </div>

      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-[var(--cv-border)] bg-[var(--cv-mid)] px-4 py-4 lg:hidden">
          <HeaderSearch
            locale={locale}
            compact
            className="mb-4 w-full"
            searchPlaceholder={searchPlaceholder}
            searchScope={searchScope}
            labels={searchLabels}
            sectionTitles={sectionTitles}
          />
          <nav
            className="space-y-2"
            aria-label={locale === "tr" ? "Site bölümleri" : "Site sections"}
          >
            {mainLinks.map((l) => {
              const active = navItemActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded border px-3 py-2 text-sm font-bold uppercase transition-colors ${
                    active
                      ? "border-[var(--cv-accent)] bg-[color-mix(in_srgb,var(--cv-accent)_14%,var(--cv-card))] text-[var(--cv-accent)]"
                      : "border-[var(--cv-border)] bg-[var(--cv-card)] text-[var(--cv-heading)]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex justify-center">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <Link
              href="/admin"
              aria-current={adminActive ? "page" : undefined}
              className={`block rounded py-2 text-center text-sm font-bold uppercase transition-[box-shadow,filter] ${
                adminActive
                  ? "bg-[var(--cv-red)] text-[var(--cv-on-red)] ring-2 ring-inset ring-[var(--cv-amber-btn)]/70"
                  : "bg-[var(--cv-red)] text-[var(--cv-on-red)]"
              }`}
              onClick={() => setOpen(false)}
            >
              {admin}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
