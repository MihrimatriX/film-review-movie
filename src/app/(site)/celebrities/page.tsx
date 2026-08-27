import { CelebrityGridCard } from "@/components/CelebrityGridCard";
import { CelebrityListingSidebar } from "@/components/CelebrityListingSidebar";
import { ListingPagination } from "@/components/ListingPagination";
import { ListingSortSelectBoundary } from "@/components/MovieSortSelectBoundary";
import { PageHero } from "@/components/PageHero";
import { TopBarFilter } from "@/components/TopBarFilter";
import { StaggerOnView } from "@/components/motion/StaggerOnView";
import { getCelebritiesMerged } from "@/lib/catalog";
import { getLocale, t } from "@/lib/i18n";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
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
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.celebritiesPage.gridTitle,
    description: s.seo.celebritiesIndexDescription,
    pathname: "/celebrities",
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function CelebritiesGrid01Page({
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
      listingHref("/celebrities", sp, CELEB_LIST_QS_KEYS, {
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
        title={s.celebritiesPage.gridTitle}
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
              gridHref={withCelebrityListingQuery("/celebrities", sp)}
              active="grid"
              sortControl={
                <ListingSortSelectBoundary
                  options={celebritySortSelectOptions(tb)}
                  currentValue={sort}
                />
              }
            />
            <StaggerOnView className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {pageSlice.map((c) => (
                <div key={c.id} className="cv-stagger-item">
                  <CelebrityGridCard
                    celebrity={c}
                    variant="compact"
                    labels={{
                      country: s.cardHover.country,
                      synopsis: s.cardHover.synopsis,
                      openDetail: s.cardHover.openDetail,
                      synopsisFallback: s.celebritiesPage.bioPlaceholder,
                    }}
                  />
                </div>
              ))}
            </StaggerOnView>
            <ListingPagination
              pathname="/celebrities"
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
              formAction="/celebrities"
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
