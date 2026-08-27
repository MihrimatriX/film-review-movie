import type { DiscoverMoviesPage } from "@/lib/catalog";
import { HomeDiscoverPagination } from "@/components/HomeDiscoverPagination";
import { MovieCard } from "@/components/MovieCard";
import { StaggerOnView } from "@/components/motion/StaggerOnView";
import type { ReactNode } from "react";

export function TmdbDiscoverCatalogSection({
  discover,
  title,
  hint,
  emptyLabel,
  setupHint,
  fetchFailedHint,
  tmdbConfigured = false,
  readMoreLabel,
  cardHover,
  pagination,
  resolveHref,
  gridClassName,
  headerAside,
  wrapperClassName = "mt-12 border-t border-[var(--cv-border)] pt-8",
}: {
  discover: DiscoverMoviesPage | null;
  title: string;
  hint: string;
  emptyLabel: string;
  setupHint: string;
  /** Anahtar tanımlı ama TMDB isteği başarısız / boş döndüğünde gösterilir. */
  fetchFailedHint: string;
  /** `isTmdbConfigured()` — anahtarın Next sunucusunda görünüp görünmediği. */
  tmdbConfigured?: boolean;
  readMoreLabel: string;
  cardHover: {
    director: string;
    runtime: string;
    synopsis: string;
  };
  pagination: {
    first: string;
    prev: string;
    next: string;
    last: string;
    pageStatus: string;
  };
  resolveHref: (page: number) => string;
  gridClassName?: string;
  headerAside?: ReactNode;
  wrapperClassName?: string;
}) {
  const grid =
    gridClassName ?? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4";

  return (
    <div className={wrapperClassName}>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--cv-muted)]">
            {hint}
          </p>
        </div>
        {headerAside ? <div className="shrink-0">{headerAside}</div> : null}
      </div>
      {discover && discover.movies.length > 0 ? (
        <>
          <StaggerOnView className={grid}>
            {discover.movies.map((m, i) => (
              <div key={m.id} className="cv-stagger-item">
                <MovieCard
                  movie={m}
                  priority={i < 8}
                  readMoreLabel={readMoreLabel}
                  labels={{
                    director: cardHover.director,
                    runtime: cardHover.runtime,
                    synopsis: cardHover.synopsis,
                  }}
                />
              </div>
            ))}
          </StaggerOnView>
          <HomeDiscoverPagination
            currentPage={discover.page}
            totalPages={discover.totalPages}
            firstLabel={pagination.first}
            prevLabel={pagination.prev}
            nextLabel={pagination.next}
            lastLabel={pagination.last}
            pageStatusTemplate={pagination.pageStatus}
            resolveHref={resolveHref}
          />
        </>
      ) : discover && discover.movies.length === 0 ? (
        <p className="py-6 text-sm text-[var(--cv-muted)]">{emptyLabel}</p>
      ) : (
        <p className="py-6 text-sm text-[var(--cv-muted)]">
          {tmdbConfigured ? fetchFailedHint : setupHint}
        </p>
      )}
    </div>
  );
}
