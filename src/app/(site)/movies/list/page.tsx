import { getDiscoverMoviesPage, getMoviesMerged } from "@/lib/catalog";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import {
  parseDiscoverPageParam,
  readSearchParams,
  withMoviesDiscoverPageHref,
} from "@/lib/listing-sort";
import { isTmdbConfigured } from "@/lib/tmdb";
import { redirect } from "next/navigation";
import { WithSearchParams } from "@/components/WithSearchParams";
import { MoviesListView } from "./view";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.moviesPage.listTitle,
    description: s.seo.moviesListDescription,
    pathname: "/movies/list",
    keywords: [...s.seo.keywords, s.nav.movies],
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function MoviesListPage({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = await readSearchParams(searchParams);
  const locale = await getLocale();
  const { requested: discoverReq, raw: discoverRaw } =
    parseDiscoverPageParam(sp);
  const [allMovies, discover] = await Promise.all([
    getMoviesMerged(locale),
    getDiscoverMoviesPage(locale, discoverReq),
  ]);
  if (
    discover &&
    discover.page !== discoverReq &&
    discoverRaw != null &&
    discoverRaw !== ""
  ) {
    redirect(withMoviesDiscoverPageHref("/movies/list", sp, discover.page));
  }
  const tmdbOn = isTmdbConfigured();

  return (
    <WithSearchParams>
      <MoviesListView
        locale={locale}
        sp={sp}
        allMovies={allMovies}
        discover={discover}
        tmdbOn={tmdbOn}
      />
    </WithSearchParams>
  );
}
