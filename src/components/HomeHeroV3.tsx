import type { FeaturedHeroMovie } from "@/lib/home-hero";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

const TAG_PALETTE = ["bg-amber-600/90", "bg-orange-600/90", "bg-sky-600/90"];

export function HomeHeroV3({
  locale,
  featured,
  labels,
}: {
  locale: Locale;
  featured: FeaturedHeroMovie | null;
  labels: {
    watchTrailer: string;
    favorite: string;
    share: string;
    moreDetail: string;
    runTime: string;
    rated: string;
    release: string;
    browseMovies: string;
  };
}) {
  if (!featured) {
    return (
      <section className="relative overflow-hidden border-b border-[var(--cv-border)] bg-gradient-to-br from-[var(--cv-input)] via-[var(--cv-deep)] to-[var(--cv-mid)] py-16 md:py-24">
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
          <p className="text-[var(--cv-muted)]">
            {locale === "tr"
              ? "Öne çıkan film yüklenemedi."
              : "Could not load a featured film."}
          </p>
          <Link
            href="/movies"
            className="mt-6 inline-block rounded bg-[var(--cv-red)] px-6 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)]"
          >
            {labels.browseMovies}
          </Link>
        </div>
      </section>
    );
  }

  const detailHref = `/movies/${featured.slug}`;
  const metaParts = [
    featured.runtimeLabel ? `${labels.runTime} ${featured.runtimeLabel}` : "",
    featured.ratedLabel ? `${labels.rated} ${featured.ratedLabel}` : "",
    featured.releaseLabel ? `${labels.release} ${featured.releaseLabel}` : "",
  ].filter(Boolean);

  return (
    <section className="relative overflow-hidden border-b border-[var(--cv-border)] py-16 md:py-24">
      {featured.backdropUrl ? (
        <div className="absolute inset-0">
          <Image
            src={featured.backdropUrl}
            alt=""
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[var(--cv-hero-scrim-from)] via-[var(--cv-deep)]/92 to-[var(--cv-mid)]"
            aria-hidden
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[var(--cv-input)] via-[var(--cv-deep)] to-[var(--cv-mid)]"
          aria-hidden
        />
      )}
      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
        {featured.genres.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {featured.genres.slice(0, 3).map((g, i) => (
              <span
                key={g}
                className={`rounded px-2 py-1 text-xs font-bold uppercase text-white ${TAG_PALETTE[i % TAG_PALETTE.length]}`}
              >
                {g}
              </span>
            ))}
          </div>
        )}
        <h1 className="mt-6 font-[family-name:var(--font-dosis)] text-4xl font-bold uppercase text-[var(--cv-heading)] md:text-6xl">
          <Link href={detailHref} className="hover:text-[var(--cv-accent)]">
            {featured.title}{" "}
            <span className="text-[var(--cv-accent)]">{featured.year}</span>
          </Link>
        </h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
          <span className="rounded border border-[var(--cv-border-strong)] bg-[var(--cv-card)]/40 px-3 py-1.5 text-[var(--cv-muted)] backdrop-blur-sm">
            ▶ {labels.watchTrailer}
          </span>
          <span className="rounded border border-[var(--cv-border-strong)] bg-[var(--cv-card)]/40 px-3 py-1.5 text-[var(--cv-muted)] backdrop-blur-sm">
            ♥ {labels.favorite}
          </span>
          <span className="rounded border border-[var(--cv-border-strong)] bg-[var(--cv-card)]/40 px-3 py-1.5 text-[var(--cv-muted)] backdrop-blur-sm">
            ↗ {labels.share}
          </span>
        </div>
        <div className="mt-6 text-[var(--cv-accent)]">
          ★{" "}
          <span className="text-2xl text-[var(--cv-heading)]">
            {featured.rating}
          </span>
          <span className="text-[var(--cv-muted)]"> /10</span>
        </div>
        {metaParts.length > 0 && (
          <ul className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-[var(--cv-muted)]">
            {metaParts.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
        <Link
          href={detailHref}
          className="mt-8 inline-block rounded bg-[var(--cv-red)] px-6 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)]"
        >
          {labels.moreDetail}
        </Link>
      </div>
    </section>
  );
}
