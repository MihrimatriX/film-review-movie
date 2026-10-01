import { JsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/detail/ShareButton";
import { TiltPoster } from "@/components/detail/TiltPoster";
import { TrailerButton } from "@/components/detail/TrailerButton";
import { MyRating } from "@/components/library/MyRating";
import { WatchlistButton } from "@/components/library/WatchlistButton";
import { MovieCard } from "@/components/MovieCard";
import { StaggerOnView } from "@/components/motion/StaggerOnView";
import { MovieTmdbDetailSection } from "@/components/tmdb/MovieTmdbDetailSection";
import { PageHero } from "@/components/PageHero";
import { getMoviePageBundle, getMoviesMerged } from "@/lib/catalog";
import { getLocale, t } from "@/lib/i18n";
import {
  notFoundMetadata,
  parseRuntimeToSeconds,
  toIsoDate,
} from "@/lib/seo/helpers";
import { breadcrumbNode, movieNode, webPageNode } from "@/lib/seo/json-ld";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Movie } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Ortak tür sayısı → puan → popülerlik sırasıyla benzer filmler. */
function pickSimilar(movie: Movie, pool: Movie[], limit = 6): Movie[] {
  const genres = new Set(movie.genres.map((g) => g.toLowerCase()));
  return pool
    .filter((m) => m.slug !== movie.slug && m.title !== movie.title)
    .map((m) => ({
      m,
      overlap: m.genres.filter((g) => genres.has(g.toLowerCase())).length,
    }))
    .filter((x) => x.overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        b.m.rating - a.m.rating ||
        (b.m.popularity ?? 0) - (a.m.popularity ?? 0),
    )
    .slice(0, limit)
    .map((x) => x.m);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const bundle = await getMoviePageBundle(locale, slug);
  if (!bundle) return notFoundMetadata(locale);
  const { movie, tmdb } = bundle;
  const directors = tmdb?.directors?.length
    ? tmdb.directors
    : movie.director
      ? [movie.director]
      : undefined;
  return buildDetailMetadata({
    locale,
    title: movie.title,
    description: movie.synopsis || tmdb?.tagline,
    pathname: `/movies/${slug}`,
    image: tmdb?.backdropUrl || movie.poster || null,
    imageAlt: movie.title,
    type: "video.movie",
    directors,
    writers: tmdb?.writers,
    actors: tmdb?.cast?.slice(0, 8).map((c) => ({
      profile: `/celebrities/${c.slug}`,
      role: c.character,
    })),
    duration: parseRuntimeToSeconds(movie.runtime),
    releaseDate: toIsoDate(movie.releaseLabel, movie.year),
    tags: movie.genres,
    keywords: [...movie.genres, ...(tmdb?.keywords ?? [])],
    videos: tmdb?.trailerYoutubeKey
      ? [
          {
            url: `https://www.youtube.com/embed/${tmdb.trailerYoutubeKey}`,
            width: 1280,
            height: 720,
            type: "text/html",
          },
        ]
      : undefined,
  });
}

export default async function MovieSinglePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const s = t(locale);
  const [bundle, pool] = await Promise.all([
    getMoviePageBundle(locale, slug),
    getMoviesMerged(locale),
  ]);
  if (!bundle) notFound();

  const { movie, tmdb } = bundle;
  const d = s.tmdbDetail;
  const similar = pickSimilar(movie, pool);
  const libraryItem = {
    kind: "movie" as const,
    slug: movie.slug,
    title: movie.title,
    poster: movie.poster,
    year: String(movie.year),
    rating: movie.rating,
    genres: movie.genres,
  };

  return (
    <>
      <JsonLd
        data={[
          webPageNode({
            pathname: `/movies/${slug}`,
            title: movie.title,
            description: movie.synopsis,
            locale,
            image: tmdb?.backdropUrl || movie.poster,
          }),
          breadcrumbNode([
            { name: s.crumbs.home, pathname: "/" },
            { name: s.moviesPage.crumb, pathname: "/movies" },
            { name: movie.title },
          ]),
          movieNode(movie, {
            pathname: `/movies/${slug}`,
            backdropUrl: tmdb?.backdropUrl,
            voteCount: tmdb?.voteCount,
            trailerKey: tmdb?.trailerYoutubeKey,
            trailerName: tmdb?.trailerName,
            imdbUrl: tmdb?.imdbUrl,
            keywords: tmdb?.keywords,
            originalTitle: tmdb?.originalTitle,
          }),
        ]}
      />
      <PageHero
        title={movie.title}
        crumbs={[
          { label: s.crumbs.home, href: "/" },
          { label: s.moviesPage.crumb, href: "/movies" },
          { label: movie.title },
        ]}
      />
      <div className="relative isolate">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] overflow-hidden"
          aria-hidden
        >
          <Image
            src={tmdb?.backdropUrl || movie.poster}
            alt=""
            fill
            className="scale-110 object-cover opacity-[0.16] blur-2xl saturate-150"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--cv-deep)_60%,transparent)] to-[var(--cv-deep)]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <Link
            href="/movies"
            className="mb-6 inline-block text-sm font-medium text-[var(--cv-accent)] hover:underline"
          >
            ← {s.nav.movies}
          </Link>

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
            <TiltPoster
              src={movie.poster}
              alt={movie.title}
              rating={movie.rating}
            />

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
                ★{" "}
                <span className="text-[var(--cv-heading)]">{movie.rating}</span>
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

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {tmdb?.trailerYoutubeKey ? (
                  <TrailerButton
                    youtubeKey={tmdb.trailerYoutubeKey}
                    title={movie.title}
                    label={s.ui.playTrailer}
                  />
                ) : null}
                <WatchlistButton item={libraryItem} variant="full" />
                <ShareButton title={movie.title} />
              </div>

              <div className="mt-6 max-w-md">
                <MyRating item={libraryItem} />
              </div>
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

          {similar.length ? (
            <section className="mt-14 border-t border-[var(--cv-border)] pt-12">
              <h2 className="mb-8 font-[family-name:var(--font-dosis)] text-xl font-bold uppercase tracking-wide text-[var(--cv-heading)]">
                {s.ui.similarMovies}
              </h2>
              <StaggerOnView className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {similar.map((m) => (
                  <div key={m.id} className="cv-stagger-item">
                    <MovieCard
                      movie={m}
                      readMoreLabel={s.common.readMore}
                      labels={{
                        director: s.cardHover.director,
                        runtime: s.cardHover.runtime,
                        synopsis: s.cardHover.synopsis,
                      }}
                    />
                  </div>
                ))}
              </StaggerOnView>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
