import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { isTmdbConfigured } from "@/lib/tmdb";

const TMDB_LOGO_SRC =
  "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f79a66ac52658e32389de7e12426503451.svg";

export function SiteFooter({ locale }: { locale: Locale }) {
  const s = t(locale);
  const tmdbOn = isTmdbConfigured();

  const cols = [
    {
      titleKey: "resources" as const,
      links: [
        { label: s.footer.linkAbout, href: "/blog" },
        { label: s.nav.movies, href: "/movies" },
        { label: s.nav.series, href: "/series" },
        { label: s.nav.blog, href: "/blog" },
        { label: s.footer.linkHelp, href: "/movies/list" },
      ],
    },
    {
      titleKey: "legal" as const,
      links: [
        { label: s.footer.linkTerms, href: "#" },
        { label: s.footer.linkPrivacy, href: "#" },
        { label: s.footer.linkSecurity, href: "#" },
      ],
    },
    {
      titleKey: "account" as const,
      links: [
        { label: s.footer.linkProfile, href: "/community/profile" },
        { label: s.footer.linkFavorites, href: "/community/favorites" },
        { label: s.footer.linkRated, href: "/community/rated" },
        { label: s.footer.linkAdmin, href: "/admin" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--cv-border)] bg-[var(--cv-mid)]">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex outline-none transition-opacity hover:opacity-90"
              aria-label="Film Review — Ana sayfa"
            >
              <BrandLogo variant="footer" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--cv-muted)]">
              {s.footer.tagline}
            </p>
            <p className="mt-2 text-sm text-[var(--cv-muted)]">
              {s.footer.callUs}{" "}
              <a
                href="mailto:hello.portfolio.demo@local"
                className="text-[var(--cv-accent)] hover:underline"
              >
                hello.portfolio.demo@local
              </a>
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.titleKey}>
              <h4 className="font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-heading)]">
                {s.footer[c.titleKey]}
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-[var(--cv-muted)]">
                {c.links.map((l) => (
                  <li key={`${c.titleKey}-${l.label}`}>
                    <Link
                      href={l.href}
                      className="hover:text-[var(--cv-accent)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-heading)]">
              {s.footer.newsletter}
            </h4>
            <p className="mt-4 text-sm text-[var(--cv-muted)]">
              {s.footer.newsletterHint}
            </p>
            <form className="mt-3 flex flex-col gap-2" action="#" method="post">
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder={s.footer.emailPlaceholder}
                className="rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)] placeholder:text-[var(--cv-faint)]"
              />
              <button
                type="button"
                className="rounded bg-[var(--cv-red)] px-4 py-2 text-left text-sm font-bold uppercase text-[var(--cv-on-red)]"
              >
                {s.footer.subscribeNow}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--cv-border)] bg-[var(--cv-deep)] px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
          {tmdbOn ? (
            <>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 opacity-90 transition hover:opacity-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={TMDB_LOGO_SRC}
                  alt="The Movie Database (TMDB)"
                  width={120}
                  height={12}
                  className="h-3.5 w-auto md:h-4"
                />
              </a>
              <p className="max-w-xl text-center text-[10px] leading-relaxed text-[var(--cv-faint)] md:text-left">
                {s.tmdb.attribution}
              </p>
              <span className="shrink-0 rounded border border-[var(--cv-accent)]/40 bg-[color-mix(in_srgb,var(--cv-accent)_12%,transparent)] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--cv-accent)]">
                {s.tmdb.liveData}
              </span>
            </>
          ) : (
            <p className="w-full text-center text-xs text-[var(--cv-muted)] md:text-left">
              {s.tmdb.setupBannerShort}{" "}
              <Link
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--cv-accent)] hover:underline"
              >
                {s.tmdb.getKey}
              </Link>
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-[var(--cv-border)] py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-[var(--cv-faint)] md:flex-row md:px-6">
          <p>Film Review · {s.footer.nextEdition}</p>
          <Link href="/" className="hover:text-[var(--cv-accent)]">
            {s.footer.backToTop}
          </Link>
        </div>
      </div>
    </footer>
  );
}
