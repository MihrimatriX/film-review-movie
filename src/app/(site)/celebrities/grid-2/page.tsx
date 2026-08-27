import { CelebrityGridCard } from "@/components/CelebrityGridCard";
import { CelebrityListingSidebar } from "@/components/CelebrityListingSidebar";
import { ListingPagination } from "@/components/ListingPagination";
import { ListingSortSelectBoundary } from "@/components/MovieSortSelectBoundary";
import { PageHero } from "@/components/PageHero";
import { TopBarFilter } from "@/components/TopBarFilter";
import { getCelebritiesMerged } from "@/lib/catalog";
import { getLocale, t } from "@/lib/i18n";
import {
  applyCelebrityListing,
  CELEB_LIST_QS_KEYS,
  listingHref,
  listingPageSizeOptions,
  listingTotalPages,
  paginateList,
  parseCelebritySort,
  parseListPage,
  parseListPageSize,
  pickSearchParam,
  uniqueCelebrityCountryHints,
  withCelebrityListingQuery,
} from "@/lib/listing-sort";
import { celebritySortSelectOptions } from "@/lib/listing-sort-ui";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.celebritiesPage.gridTitleAlt,
    description: s.seo.celebritiesIndexDescription,
    pathname: "/celebrities/grid-2",
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function CelebritiesGrid02Page({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = (await searchParams) ?? {};
  const locale = await getLocale();
  const s = t(locale);
  const p = s.pagination;
  const all = await getCelebritiesMerged(locale);
  const list = applyCelebrityListing(all, sp);
  const sort = parseCelebritySort(pickSearchParam(sp, "sort"));
  const tb = s.topBar;

  const pageSize = parseListPageSize(pickSearchParam(sp, "pageSize"));
  const page = parseListPage(pickSearchParam(sp, "page"));
  const totalPages = listingTotalPages(list.length, pageSize);
  if (page > totalPages && list.length > 0) {
    redirect(
      listingHref("/celebrities/grid-2", sp, CELEB_LIST_QS_KEYS, {
        page: String(totalPages),
        pageSize: String(pageSize),
      }),
    );
  }
  const pageSlice = paginateList(list, Math.min(page, totalPages), pageSize);
  const countryOptions = uniqueCelebrityCountryHints(all);

  return (
    <>
      <PageHero
        title={s.celebritiesPage.gridTitleAlt}
        crumbs={[
          { label: s.crumbs.home, href: "/" },
          { label: s.celebritiesPage.crumb },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <TopBarFilter
              locale={locale}
              found={{ kind: "people", count: list.length }}
              listHref={withCelebrityListingQuery("/celebrities/list", sp)}
              gridHref={withCelebrityListingQuery("/celebrities/grid-2", sp)}
              active="grid"
              sortControl={
                <ListingSortSelectBoundary
                  options={celebritySortSelectOptions(tb)}
                  currentValue={sort}
                />
              }
            />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageSlice.map((c) => (
                <CelebrityGridCard
                  key={c.id}
                  celebrity={c}
                  variant="featured"
                  labels={{
                    country: s.cardHover.country,
                    synopsis: s.cardHover.synopsis,
                    openDetail: s.cardHover.openDetail,
                    synopsisFallback: s.celebritiesPage.bioPlaceholder,
                  }}
                />
              ))}
            </div>
            <ListingPagination
              pathname="/celebrities/grid-2"
              sp={sp}
              preserveKeys={CELEB_LIST_QS_KEYS}
              page={Math.min(page, totalPages)}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={listingPageSizeOptions()}
              labels={p}
            />
          </div>
          <div className="w-full shrink-0 lg:w-72">
            <CelebrityListingSidebar
              locale={locale}
              formAction="/celebrities/grid-2"
              countryOptions={countryOptions}
              defaults={{
                q: pickSearchParam(sp, "q") ?? "",
                sort,
                country: pickSearchParam(sp, "country") ?? "",
                gender: pickSearchParam(sp, "gender") ?? "",
                minAge: pickSearchParam(sp, "minAge") ?? "",
                maxAge: pickSearchParam(sp, "maxAge") ?? "",
                pageSize: String(pageSize),
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
