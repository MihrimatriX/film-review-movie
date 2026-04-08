import { PageHero } from "@/components/PageHero";
import { PaginationBlock } from "@/components/PaginationBlock";
import { TopBarFilter } from "@/components/TopBarFilter";
import { UserSidebar } from "@/components/UserSidebar";
import { getMoviesMerged } from "@/lib/catalog";
import { readUserData } from "@/lib/data-file";
import { formatNameHeading, getLocale, t } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Rated movies" };

export default async function CommunityRatedPage() {
  const locale = await getLocale();
  const s = t(locale);
  const c = s.community;
  const [{ profile, ratings }, allMovies] = await Promise.all([
    readUserData(),
    getMoviesMerged(locale),
  ]);

  const rows = ratings
    .map((r) => {
      const movie = allMovies.find((m) => m.slug === r.movieSlug);
      return movie ? { movie, r } : null;
    })
    .filter(Boolean) as {
    movie: (typeof allMovies)[0];
    r: (typeof ratings)[0];
  }[];

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
        title={formatNameHeading(c.ratedHeading, profile.firstName)}
        crumbs={[{ label: s.crumbs.home, href: "/" }, { label: c.ratedTitle }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full shrink-0 lg:w-64">
            <UserSidebar profile={profile} active="rated" labels={userLabels} />
          </div>
          <div className="min-w-0 flex-1">
            <TopBarFilter
              locale={locale}
              found={{ kind: "ratings", count: rows.length }}
              listHref="/community/rated"
              gridHref="/community/favorites"
              active="list"
              userVariant
            />
            <div className="mt-6 space-y-0">
              {rows.map(({ movie, r }, idx) => (
                <article
                  key={movie.id}
                  className={`flex flex-col gap-4 border-b border-[var(--cv-border)] py-8 sm:flex-row ${idx === rows.length - 1 ? "last:border-0" : ""}`}
                >
                  <Link
                    href={`/movies/${movie.slug}`}
                    className="relative mx-auto h-48 w-36 shrink-0 overflow-hidden rounded-md sm:mx-0"
                  >
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </Link>
                  <div>
                    <h2 className="font-[family-name:var(--font-dosis)] text-xl font-bold text-[var(--cv-heading)]">
                      <Link
                        href={`/movies/${movie.slug}`}
                        className="hover:text-[var(--cv-accent)]"
                      >
                        {movie.title}{" "}
                        <span className="text-[var(--cv-muted)]">
                          ({movie.year})
                        </span>
                      </Link>
                    </h2>
                    <p className="mt-2 text-xs uppercase text-[var(--cv-muted)]">
                      {c.yourRating}
                    </p>
                    <p className="text-[var(--cv-accent)]">
                      ★{" "}
                      <span className="text-xl text-[var(--cv-heading)]">
                        {r.userRating}
                      </span>
                      <span className="text-[var(--cv-muted)]"> /10</span>
                    </p>
                    {r.reviewTitle && (
                      <>
                        <p className="mt-4 text-xs uppercase text-[var(--cv-muted)]">
                          {c.yourReview}
                        </p>
                        <h3 className="font-bold text-[var(--cv-heading)]">
                          {r.reviewTitle}
                        </h3>
                        {r.reviewDate && (
                          <p className="text-xs text-[var(--cv-faint)]">
                            {r.reviewDate}
                          </p>
                        )}
                        {r.reviewBody && (
                          <p className="mt-2 text-sm leading-relaxed text-[var(--cv-muted)]">
                            “{r.reviewBody}”
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <PaginationBlock page={1} totalPages={1} />
          </div>
        </div>
      </div>
    </>
  );
}
