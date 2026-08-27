import { MovieTmdbDetailSection } from "@/components/tmdb/MovieTmdbDetailSection";
import { PageHero } from "@/components/PageHero";
import { getMoviePageBundle } from "@/lib/catalog";
import { getLocale, t } from "@/lib/i18n";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const bundle = await getMoviePageBundle(locale, slug);
  if (!bundle)
    return { title: "Not found", robots: { index: false, follow: false } };
  const { movie } = bundle;
  return buildDetailMetadata({
    title: movie.title,
    description: movie.synopsis,
    pathname: `/movies/${slug}`,
    image: movie.poster || null,
  });
}

export default async function MovieSinglePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const s = t(locale);
  const bundle = await getMoviePageBundle(locale, slug);
  if (!bundle) notFound();

  const { movie, tmdb } = bundle;
  const d = s.tmdbDetail;

  return (
    <>
      <PageHero
        title={movie.title}
        crumbs={[
          { label: s.crumbs.home, href: "/" },
          { label: s.moviesPage.crumb, href: "/movies" },
          { label: movie.title },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <Link
          href="/movies"
          className="mb-6 inline-block text-sm font-medium text-[var(--cv-accent)] hover:underline"
        >
          ← {s.nav.movies}
        </Link>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-sm shrink-0 overflow-hidden rounded-xl border border-[var(--cv-border)] shadow-xl lg:mx-0">
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width:1024px) 100vw, 400px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-md bg-[var(--cv-card)] px-2 py-1 text-xs font-semibold uppercase text-[var(--cv-accent)] ring-1 ring-[var(--cv-border)]"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="mt-3 text-sm text-[var(--cv-muted)]">
              {movie.year}
              {movie.runtime ? ` · ${movie.runtime}` : ""}
              {movie.director ? ` · ${movie.director}` : ""}
              {movie.releaseLabel ? ` · ${movie.releaseLabel}` : ""}
              {movie.mpaa ? ` · ${movie.mpaa}` : ""}
            </p>

            <p className="mt-4 text-2xl text-[var(--cv-accent)]">
              ★ <span className="text-[var(--cv-heading)]">{movie.rating}</span>
              <span className="text-lg text-[var(--cv-muted)]">/10</span>
            </p>

            {movie.stars ? (
              <p className="mt-2 text-sm text-[var(--cv-muted)]">
                <span className="font-semibold text-[var(--cv-faint)]">
                  {d.cast}:{" "}
                </span>
                {movie.stars}
              </p>
            ) : null}

            <p className="mt-6 leading-relaxed text-[var(--cv-body)]">
              {movie.synopsis}
            </p>

            {!tmdb ? (
              <p className="mt-6 rounded-lg border border-dashed border-[var(--cv-border-strong)] bg-[var(--cv-card)]/50 p-4 text-sm text-[var(--cv-muted)]">
                {d.localNotice}
              </p>
            ) : null}

            {tmdb?.trailerYoutubeKey ? (
              <a
                href={`https://www.youtube.com/watch?v=${tmdb.trailerYoutubeKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-md bg-[var(--cv-red)] px-8 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)] hover:opacity-95"
              >
                {d.trailer} ▶
              </a>
            ) : (
              <button
                type="button"
                className="mt-8 rounded-md bg-[var(--cv-red)] px-8 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)] opacity-80"
                disabled
              >
                {d.trailer}
              </button>
            )}
          </div>
        </div>

        {tmdb ? (
          <div className="mt-14 border-t border-[var(--cv-border)] pt-12">
            <h2 className="mb-8 font-[family-name:var(--font-dosis)] text-xl font-bold uppercase tracking-wide text-[var(--cv-heading)]">
              {d.sectionTitle}
            </h2>
            <MovieTmdbDetailSection
              extras={tmdb}
              labels={{
                tagline: d.tagline,
                voteCount: d.voteCount,
                budget: d.budget,
                revenue: d.revenue,
                originalTitle: d.originalTitle,
                directors: d.directors,
                writers: d.writers,
                producers: d.producers,
                companies: d.companies,
                countries: d.countries,
                languages: d.languages,
                keywords: d.keywords,
                status: d.status,
                trailer: d.trailer,
                openImdb: d.openImdb,
                officialSite: d.officialSite,
                cast: d.cast,
              }}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
