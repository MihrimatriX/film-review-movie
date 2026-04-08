import { HeroSlider } from "@/components/HeroSlider";
import { InTheaterTabs } from "@/components/InTheaterTabs";
import { TmdbDiscoverCatalogSection } from "@/components/TmdbDiscoverCatalogSection";
import { readPosts } from "@/lib/data-file";
import { getDiscoverMoviesPage, getMoviesMerged } from "@/lib/catalog";
import { getHeroSliderData } from "@/lib/home-hero";
import { getInTheaterTabSets } from "@/lib/in-theater";
import { getLocale, t } from "@/lib/i18n";
import { pickSearchParam } from "@/lib/listing-sort";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import { isTmdbConfigured } from "@/lib/tmdb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.seo.homeTitle,
    description: s.seo.homeDescription,
    pathname: "/",
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = (await searchParams) ?? {};
  const locale = await getLocale();
  const s = t(locale);
  const p = s.pagination;

  const rawPage = pickSearchParam(sp, "moviePage");
  const parsed =
    rawPage != null && rawPage !== "" ? Number(rawPage) : Number.NaN;
  const requested =
    Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;

  const [theaterTabs, posts, mergedForSlider, discover] = await Promise.all([
    getInTheaterTabSets(locale),
    readPosts(),
    getMoviesMerged(locale),
    getDiscoverMoviesPage(locale, requested),
  ]);

  if (
    discover &&
    discover.page !== requested &&
    rawPage != null &&
    rawPage !== ""
  ) {
    redirect(discover.page <= 1 ? "/" : `/?moviePage=${discover.page}`);
  }

  const slides = await getHeroSliderData(locale, mergedForSlider);
  const tmdbOn = isTmdbConfigured();

  return (
    <>
      <HeroSlider
        slides={slides}
        followUs={s.hero.followUs}
        socialHint={s.hero.socialHint}
        trending={s.hero.trending}
        sliderEmpty={s.hero.sliderEmpty}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-end justify-between border-b-2 border-[var(--cv-accent)] pb-2">
              <h2 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
                {s.home.inTheater}
              </h2>
              <Link
                href="/movies"
                className="text-sm font-semibold text-[var(--cv-muted)] hover:text-[var(--cv-accent)]"
              >
                {s.home.viewAll}
              </Link>
            </div>
            <InTheaterTabs tabs={theaterTabs} locale={locale} />

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
              resolveHref={(pg) => (pg <= 1 ? "/" : `/?moviePage=${pg}`)}
              headerAside={
                <Link
                  href="/movies"
                  className="text-sm font-semibold text-[var(--cv-muted)] hover:text-[var(--cv-accent)]"
                >
                  {s.home.viewAll}
                </Link>
              }
            />
          </div>
          <aside className="w-full shrink-0 lg:w-80">
            <h2 className="mb-4 border-b-2 border-[var(--cv-accent)] pb-2 font-[family-name:var(--font-dosis)] text-xl font-bold uppercase text-[var(--cv-heading)]">
              {s.home.latestNews}
            </h2>
            <ul className="flex flex-col gap-4">
              {posts.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex gap-3 rounded-md border border-[var(--cv-border)] bg-[var(--cv-card)] p-2 transition hover:border-[var(--cv-accent)]/40"
                  >
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded">
                      <Image
                        src={p.cover}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase text-[var(--cv-muted)]">
                        {p.date}
                      </p>
                      <p className="font-[family-name:var(--font-dosis)] text-sm font-bold text-[var(--cv-heading)] group-hover:text-[var(--cv-accent)] line-clamp-2">
                        {p.title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/blog"
              className="mt-4 inline-block font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-red)] hover:underline"
            >
              {s.home.allNews}
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
