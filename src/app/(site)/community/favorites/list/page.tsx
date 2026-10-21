import { getMoviesMerged } from "@/lib/catalog";
import { readUserData } from "@/lib/data-file";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { WithSearchParams } from "@/components/WithSearchParams";
import { readSearchParams } from "@/lib/listing-sort";
import { CommunityFavoritesListView } from "./view";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: `${s.footer.linkFavorites} — ${s.topBar.viewList}`,
    description: s.seo.communityFavoritesDescription,
    pathname: "/community/favorites/list",
    noindex: true,
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function CommunityFavoritesListPage({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = await readSearchParams(searchParams);
  const locale = await getLocale();
  const [{ profile, favoriteSlugs }, allMovies] = await Promise.all([
    readUserData(),
    getMoviesMerged(locale),
  ]);

  return (
    <WithSearchParams>
      <CommunityFavoritesListView
        locale={locale}
        sp={sp}
        profile={profile}
        favoriteSlugs={favoriteSlugs}
        allMovies={allMovies}
      />
    </WithSearchParams>
  );
}
