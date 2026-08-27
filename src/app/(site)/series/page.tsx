import { ListingPagination } from "@/components/ListingPagination";
import { ListingSortSelectBoundary } from "@/components/MovieSortSelectBoundary";
import { PageHero } from "@/components/PageHero";
import { SeriesCard } from "@/components/SeriesCard";
import { SeriesListingSidebar } from "@/components/SeriesListingSidebar";
import { TopBarFilter } from "@/components/TopBarFilter";
import { StaggerOnView } from "@/components/motion/StaggerOnView";
import { getSeriesMerged } from "@/lib/catalog";
import { getLocale, t } from "@/lib/i18n";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import {
  applySeriesListing,
  listingHref,
  listingPageSizeOptions,
  listingTotalPages,
  paginateList,
  parseListPage,
  parseListPageSize,
  parseSeriesSort,
  pickSearchParam,
  SERIES_LIST_QS_KEYS,
  uniqueSeriesGenres,
  withSeriesListingQuery,
  yearBoundsFromSeries,
} from "@/lib/listing-sort";
import {
  buildSeriesFilterChips,
  clearSeriesFiltersHref,
} from "@/lib/listing-filter-chips";
import { seriesSortSelectOptions } from "@/lib/listing-sort-ui";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.nav.series,
    description: s.seo.seriesIndexDescription,
    pathname: "/series",
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function SeriesIndexPage({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = (await searchParams) ?? {};
  const locale = await getLocale();
  const s = t(locale);
  const p = s.pagination;
  const all = await getSeriesMerged(locale);
  const series = applySeriesListing(all, sp);
  const sort = parseSeriesSort(pickSearchParam(sp, "sort"));
  const tb = s.topBar;
  const isEn = locale === "en";

  const pageSize = parseListPageSize(pickSearchParam(sp, "pageSize"));
  const page = parseListPage(pickSearchParam(sp, "page"));
  const totalPages = listingTotalPages(series.length, pageSize);
  if (page > totalPages && series.length > 0) {
    redirect(
      listingHref("/series", sp, SERIES_LIST_QS_KEYS, {
        page: String(totalPages),
        pageSize: String(pageSize),
      }),
    );
  }
  const pageSlice = paginateList(series, Math.min(page, totalPages), pageSize);

  const { min: yearMin, max: yearMax } = yearBoundsFromSeries(all);
  const genres = uniqueSeriesGenres(all);
  const Li = s.listings;
  const sortLabels = Object.fromEntries(
    seriesSortSelectOptions(tb).map((o) => [o.value, o.label]),
  ) as Record<string, string>;
  const seriesFilterChips = buildSeriesFilterChips("/series", sp, Li, sortLabels);
  const seriesClearAll = clearSeriesFiltersHref("/series", sp);

  return (
    <>
      <PageHero
        title={s.nav.series}
        crumbs={[{ label: s.crumbs.home, href: "/" }, { label: s.nav.series }]}
      />
      <div className="mx-auto max-w-[1920px] px-4 py-8 md:px-8">
        <p className="mb-6 text-[var(--cv-muted)]">
          {isEn
            ? "Browse series and open the detail page for synopsis, cast and media."
            : "Dizilere göz atın; özet, oyuncu kadrosu ve medya için detay sayfasını açın."}
        </p>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <TopBarFilter
              locale={locale}
              found={{ kind: "series", count: series.length }}
              listHref={withSeriesListingQuery("/series", sp)}
              gridHref={withSeriesListingQuery("/series", sp)}
              active="grid"
              viewToggle={false}
              sortControl={
                <ListingSortSelectBoundary
                  options={seriesSortSelectOptions(tb)}
                  currentValue={sort}
                />
              }
            />
            <StaggerOnView className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {pageSlice.map((item, i) => (
                <div key={item.id} className="cv-stagger-item">
                  <SeriesCard
                    series={item}
                    priority={i < 12}
                    readMoreLabel={s.common.readMore}
                    reviewWord={isEn ? "reviews" : "oy"}
                    labels={{
                      director: s.cardHover.director,
                      runtime: s.cardHover.runtime,
                      synopsis: s.cardHover.synopsis,
                      stars: s.cardHover.stars,
                      cast: s.cardHover.cast,
                    }}
                  />
                </div>
              ))}
            </StaggerOnView>
            <ListingPagination
              pathname="/series"
              sp={sp}
              preserveKeys={SERIES_LIST_QS_KEYS}
              page={Math.min(page, totalPages)}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={listingPageSizeOptions()}
              labels={p}
            />
          </div>
          <div className="w-full shrink-0 lg:w-80 xl:w-[22rem]">
            <SeriesListingSidebar
              locale={locale}
              formAction="/series"
              yearMin={yearMin}
              yearMax={yearMax}
              genres={genres}
              filterChips={seriesFilterChips}
              clearAllHref={
                seriesFilterChips.length ? seriesClearAll : undefined
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
                pageSize: String(pageSize),
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
