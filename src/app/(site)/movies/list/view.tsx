"use client";

import { ListingPagination } from "@/components/ListingPagination";
import { MovieListRow } from "@/components/MovieListRow";
import { MovieListingSidebar } from "@/components/MovieListingSidebar";
import { ListingSortSelectBoundary } from "@/components/MovieSortSelectBoundary";
import { PageHero } from "@/components/PageHero";
import { TmdbDiscoverCatalogSection } from "@/components/TmdbDiscoverCatalogSection";
import { TopBarFilter } from "@/components/TopBarFilter";
import { t } from "@/lib/i18n";
import {
  applyMovieListing,
  listingPageSizeOptions,
  listingTotalPages,
  MOVIE_LIST_QS_KEYS,
  paginateList,
  parseListPage,
  parseListPageSize,
  parseMovieSort,
  pickSearchParam,
  uniqueMovieGenres,
  withMovieListingQuery,
  withMoviesDiscoverPageHref,
  yearBoundsFromMovies,
} from "@/lib/listing-sort";
import { buildMovieFilterChips, clearMovieFiltersHref } from "@/lib/listing-filter-chips";
import { movieSortSelectOptions } from "@/lib/listing-sort-ui";
import type { Locale } from "@/lib/i18n";
import type { DiscoverMoviesPage } from "@/lib/catalog";
import type { Movie } from "@/lib/types";

type Sp = Record<string, string | string[] | undefined>;

export function MoviesListView({
  locale,
  sp = {},
  allMovies,
  discover,
  tmdbOn,
}: {
  locale: Locale;
  sp?: Sp;
  allMovies: Movie[];
  discover: DiscoverMoviesPage | null;
  tmdbOn: boolean;
}) {
  const s = t(locale);
  const p = s.pagination;
  const movies = applyMovieListing(allMovies, sp);
  const sort = parseMovieSort(pickSearchParam(sp, "sort"));
  const tb = s.topBar;
  const { min: yearMin, max: yearMax } = yearBoundsFromMovies(allMovies);
  const genres = uniqueMovieGenres(allMovies);
  const discoverPageStr = pickSearchParam(sp, "discoverPage") ?? "";
  const pageSize = parseListPageSize(pickSearchParam(sp, "pageSize"));
  const page = parseListPage(pickSearchParam(sp, "page"));
  const totalPages = listingTotalPages(movies.length, pageSize);
  const pageSlice = paginateList(movies, Math.min(page, totalPages), pageSize);
  const Li = s.listings;
  const sortLabels = Object.fromEntries(
    movieSortSelectOptions(tb).map((o) => [o.value, o.label]),
  ) as Record<string, string>;
  const movieFilterChips = buildMovieFilterChips(
    "/movies/list",
    sp,
    Li,
    sortLabels,
  );
  const movieClearAll = clearMovieFiltersHref("/movies/list", sp);
  return (
    <>
      <PageHero
        title={s.moviesPage.listTitle}
        crumbs={[
          { label: s.crumbs.home, href: "/" },
          { label: s.moviesPage.crumb },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <TopBarFilter
              locale={locale}
              found={{ kind: "movies", count: movies.length }}
              listHref={withMovieListingQuery("/movies/list", sp)}
              gridHref={withMovieListingQuery("/movies", sp)}
              active="list"
              sortControl={
                <ListingSortSelectBoundary
                  options={movieSortSelectOptions(tb)}
                  currentValue={sort}
                />
              }
            />
            <div className="mt-6">
              {pageSlice.map((m) => (
                <MovieListRow key={m.id} movie={m} />
              ))}
            </div>
            <ListingPagination
              pathname="/movies/list"
              sp={sp}
              preserveKeys={MOVIE_LIST_QS_KEYS}
              page={Math.min(page, totalPages)}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={listingPageSizeOptions()}
              labels={p}
            />
          </div>
          <div className="w-full shrink-0 lg:w-72">
            <MovieListingSidebar
              locale={locale}
              formAction="/movies/list"
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
                discoverPage:
                  discoverPageStr !== "" ? discoverPageStr : undefined,
                pageSize: String(pageSize),
              }}
            />
          </div>
        </div>

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
            withMoviesDiscoverPageHref("/movies/list", sp, pg)
          }
          gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
        />
      </div>
    </>
  );
}
