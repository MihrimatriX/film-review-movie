import { MovieCard } from "@/components/MovieCard";
import { ListingSortSelectBoundary } from "@/components/MovieSortSelectBoundary";
import { MovieListingSidebar } from "@/components/MovieListingSidebar";
import { StaggerOnView } from "@/components/motion/StaggerOnView";
import { PageHero } from "@/components/PageHero";
import { TmdbDiscoverCatalogSection } from "@/components/TmdbDiscoverCatalogSection";
import { TopBarFilter } from "@/components/TopBarFilter";
import { getDiscoverMoviesPage, getMoviesMerged } from "@/lib/catalog";
import {
  buildMovieFilterChips,
  clearMovieFiltersHref,
} from "@/lib/listing-filter-chips";
import { getLocale, t } from "@/lib/i18n";
import {
  applyMovieListing,
  parseDiscoverPageParam,
  parseMovieSort,
  pickSearchParam,
  uniqueMovieGenres,
  withMovieListingQuery,
  withMoviesDiscoverPageHref,
  yearBoundsFromMovies,
} from "@/lib/listing-sort";
import { movieSortSelectOptions } from "@/lib/listing-sort-ui";
import { isTmdbConfigured } from "@/lib/tmdb";
import { redirect } from "next/navigation";

export const metadata = { title: "Movie grid full width" };

type Sp = Record<string, string | string[] | undefined>;

export default async function MoviesFullWidthPage({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = (await searchParams) ?? {};
  const locale = await getLocale();
  const s = t(locale);
  const p = s.pagination;
  const { requested: discoverReq, raw: discoverRaw } =
    parseDiscoverPageParam(sp);

  const [allMovies, discover] = await Promise.all([
    getMoviesMerged(locale),
    getDiscoverMoviesPage(locale, discoverReq),
  ]);

  const movies = applyMovieListing(allMovies, sp);
  const sort = parseMovieSort(pickSearchParam(sp, "sort"));
  const tb = s.topBar;

  if (
    discover &&
    discover.page !== discoverReq &&
    discoverRaw != null &&
    discoverRaw !== ""
  ) {
    redirect(
      withMoviesDiscoverPageHref("/movies/full-width", sp, discover.page),
    );
  }

  const tmdbOn = isTmdbConfigured();
  const { min: yearMin, max: yearMax } = yearBoundsFromMovies(allMovies);
  const genres = uniqueMovieGenres(allMovies);
  const Li = s.listings;
  const sortLabels = Object.fromEntries(
    movieSortSelectOptions(tb).map((o) => [o.value, o.label]),
  ) as Record<string, string>;
  const movieFilterChips = buildMovieFilterChips(
    "/movies/full-width",
    sp,
    Li,
    sortLabels,
  );
  const movieClearAll = clearMovieFiltersHref("/movies/full-width", sp);

  return (
    <>
      <PageHero
        title={s.moviesPage.gridTitle}
        crumbs={[
          { label: s.crumbs.home, href: "/" },
          { label: s.moviesPage.crumb },
        ]}
      />
      <div className="mx-auto max-w-[1920px] px-4 py-8 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <TopBarFilter
              locale={locale}
              found={{ kind: "movies", count: movies.length }}
              listHref={withMovieListingQuery("/movies/list", sp)}
              gridHref={withMovieListingQuery("/movies/full-width", sp)}
              active="grid"
              sortControl={
                <ListingSortSelectBoundary
                  options={movieSortSelectOptions(tb)}
                  currentValue={sort}
                />
              }
            />
            <StaggerOnView className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((m, i) => (
                <div key={m.id} className="cv-stagger-item">
                  <MovieCard
                    movie={m}
                    priority={i < 12}
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

            <TmdbDiscoverCatalogSection
              discover={discover}
              title={s.home.tmdbCatalogTitle}
              hint={s.home.tmdbCatalogHint}
              emptyLabel={s.home.tmdbCatalogEmpty}
              setupHint={s.tmdb.setupBannerShort}
              fetchFailedHint={s.tmdb.fetchFailedShort}
              tmdbConfigured={tmdbOn}
              readMoreLabel={s.common.readMore}
              cardHover={{
                director: s.cardHover.director,
                runtime: s.cardHover.runtime,
                synopsis: s.cardHover.synopsis,
              }}
              pagination={{
                first: p.first,
                prev: p.prev,
                next: p.next,
                last: p.last,
                pageStatus: p.pageStatus,
              }}
              resolveHref={(pg) =>
                withMoviesDiscoverPageHref("/movies/full-width", sp, pg)
              }
              gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            />
          </div>
          <div className="w-full shrink-0 lg:w-80 xl:w-[22rem]">
            <MovieListingSidebar
              locale={locale}
              formAction="/movies/full-width"
              yearMin={yearMin}
              yearMax={yearMax}
              genres={genres}
              filterChips={movieFilterChips}
              clearAllHref={
                movieFilterChips.length ? movieClearAll : undefined
              }
              defaults={{
                q: pickSearchParam(sp, "q") ?? "",
                sort,
                fromYear: pickSearchParam(sp, "fromYear") ?? "",
                toYear: pickSearchParam(sp, "toYear") ?? "",
                minRating: pickSearchParam(sp, "minRating") ?? "",
                genre: pickSearchParam(sp, "genre") ?? "",
                director: pickSearchParam(sp, "director") ?? "",
                stars: pickSearchParam(sp, "stars") ?? "",
                discoverPage: pickSearchParam(sp, "discoverPage") ?? "",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
