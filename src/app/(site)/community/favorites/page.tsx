import { MovieCard } from "@/components/MovieCard";
import { ListingSortSelectBoundary } from "@/components/MovieSortSelectBoundary";
import { StaggerOnView } from "@/components/motion/StaggerOnView";
import { PageHero } from "@/components/PageHero";
import { TopBarFilter } from "@/components/TopBarFilter";
import { UserSidebar } from "@/components/UserSidebar";
import { getMoviesMerged } from "@/lib/catalog";
import { readUserData } from "@/lib/data-file";
import { formatNameHeading, getLocale, t } from "@/lib/i18n";
import {
  applyMovieListing,
  parseMovieSort,
  pickSearchParam,
  withMovieListingQuery,
} from "@/lib/listing-sort";
import { movieSortSelectOptions } from "@/lib/listing-sort-ui";

export const metadata = { title: "Favorite movies (grid)" };

type Sp = Record<string, string | string[] | undefined>;

export default async function CommunityFavoritesGridPage({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = (await searchParams) ?? {};
  const locale = await getLocale();
  const s = t(locale);
  const c = s.community;
  const [{ profile, favoriteSlugs }, allMovies] = await Promise.all([
    readUserData(),
    getMoviesMerged(locale),
  ]);
  const favsBase = allMovies.filter((m) => favoriteSlugs.includes(m.slug));
  const favs = applyMovieListing(favsBase, sp);
  const sort = parseMovieSort(pickSearchParam(sp, "sort"));
  const tb = s.topBar;

  const userLabels = {
    changeAvatar: c.changeAvatar,
    accountDetails: c.accountDetails,
    profile: c.profile,
    favoriteMovies: s.footer.linkFavorites,
    ratedMovies: c.ratedTitle,
    others: c.others,
    changePasswordShort: c.changePasswordShort,
    logOut: c.logOut,
  };

  return (
    <>
      <PageHero
        title={formatNameHeading(c.favoritesHeading, profile.firstName)}
        crumbs={[
          { label: s.crumbs.home, href: "/" },
          { label: s.footer.linkFavorites },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full shrink-0 lg:w-64">
            <UserSidebar
              profile={profile}
              active="favorites"
              labels={userLabels}
            />
          </div>
          <div className="min-w-0 flex-1">
            <TopBarFilter
              locale={locale}
              found={{ kind: "movies", count: favs.length }}
              listHref={withMovieListingQuery("/community/favorites/list", sp)}
              gridHref={withMovieListingQuery("/community/favorites", sp)}
              active="grid"
              userVariant
              sortControl={
                <ListingSortSelectBoundary
                  options={movieSortSelectOptions(tb)}
                  currentValue={sort}
                />
              }
            />
            <StaggerOnView className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {favs.map((m, i) => (
                <div key={m.id} className="cv-stagger-item">
                  <MovieCard
                    movie={m}
                    priority={i < 4}
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
          </div>
        </div>
      </div>
    </>
  );
}
