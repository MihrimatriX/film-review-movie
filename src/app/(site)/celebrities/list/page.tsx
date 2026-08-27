import { CelebrityListingSidebar } from "@/components/CelebrityListingSidebar";
import { ListingPagination } from "@/components/ListingPagination";
import { ListingSortSelectBoundary } from "@/components/MovieSortSelectBoundary";
import { PageHero } from "@/components/PageHero";
import { TopBarFilter } from "@/components/TopBarFilter";
import { CelebrityPortraitImage } from "@/components/CelebrityPortraitImage";
import { getCelebritiesMerged } from "@/lib/catalog";
import { pickCelebrityImageSrc } from "@/lib/celebrity-image";
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
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.celebritiesPage.listTitle,
    description: s.seo.celebritiesIndexDescription,
    pathname: "/celebrities/list",
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function CelebritiesListPage({
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
      listingHref("/celebrities/list", sp, CELEB_LIST_QS_KEYS, {
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
        title={s.celebritiesPage.listTitle}
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
              active="list"
              sortControl={
                <ListingSortSelectBoundary
                  options={celebritySortSelectOptions(tb)}
                  currentValue={sort}
                />
              }
            />
            <div className="mt-6 space-y-6">
              {pageSlice.map((c) => (
                <article
                  key={c.id}
                  className="flex flex-col gap-4 border-b border-[var(--cv-border)] pb-6 sm:flex-row"
                >
                  <Link
                    href={`/celebrities/${c.slug}`}
                    className="relative mx-auto h-48 w-40 shrink-0 overflow-hidden rounded-md sm:mx-0"
                  >
                    <CelebrityPortraitImage
                      initialSrc={pickCelebrityImageSrc(c, "list")}
                      alt={c.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </Link>
                  <div>
                    <h2 className="font-[family-name:var(--font-dosis)] text-2xl font-bold text-[var(--cv-heading)]">
                      <Link
                        href={`/celebrities/${c.slug}`}
                        className="hover:text-[var(--cv-accent)]"
                      >
                        {c.name}
                      </Link>
                    </h2>
                    <p className="text-sm uppercase text-[var(--cv-accent)]">
                      {c.role}
                      {c.country ? `, ${c.country}` : ""}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--cv-muted)] line-clamp-4">
                      {c.bio?.trim() ? c.bio : s.celebritiesPage.bioPlaceholder}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <ListingPagination
              pathname="/celebrities/list"
              sp={sp}
              preserveKeys={CELEB_LIST_QS_KEYS}
              page={Math.min(page, totalPages)}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={listingPageSizeOptions()}
              labels={p}
            />
          </div>
          <div className="w-full shrink-0 lg:w-64">
            <CelebrityListingSidebar
              locale={locale}
              formAction="/celebrities/list"
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
