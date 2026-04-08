import type { FeaturedHeroMovie } from "@/lib/home-hero";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

export function HomeHeroV2({
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
      <section className="border-b border-[var(--cv-border)] bg-[var(--cv-mid)] py-10">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <p className="text-[var(--cv-muted)]">
            {locale === "tr"
              ? "Öne çıkan film yüklenemedi. API anahtarını kontrol edin veya film listesine göz atın."
              : "Could not load a featured film. Check your API key or browse the catalog."}
          </p>
          <Link
            href="/movies"
            className="mt-4 inline-block rounded bg-[var(--cv-red)] px-6 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)]"
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
    <section className="border-b border-[var(--cv-border)] bg-[var(--cv-mid)] py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            {featured.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {featured.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded bg-[var(--cv-accent)]/85 px-2 py-0.5 text-xs font-bold uppercase text-[var(--cv-deep)]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-[family-name:var(--font-dosis)] text-4xl font-bold uppercase leading-tight text-[var(--cv-heading)] md:text-5xl">
              <Link href={detailHref} className="hover:text-[var(--cv-accent)]">
                {featured.title}{" "}
                <span className="text-[var(--cv-accent)]">{featured.year}</span>
              </Link>
            </h1>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded border border-[var(--cv-border-strong)] px-3 py-1.5 text-[var(--cv-muted)]">
                ▶ {labels.watchTrailer}
              </span>
              <span className="rounded border border-[var(--cv-border-strong)] px-3 py-1.5 text-[var(--cv-muted)]">
                ♥ {labels.favorite}
              </span>
              <span className="rounded border border-[var(--cv-border-strong)] px-3 py-1.5 text-[var(--cv-muted)]">
                ↗ {labels.share}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[var(--cv-accent)]">
              <p>
                ★{" "}
                <span className="text-2xl text-[var(--cv-heading)]">
                  {featured.rating}
                </span>
                <span className="text-[var(--cv-muted)]"> /10</span>
              </p>
              {metaParts.length > 0 && (
                <ul className="text-sm text-[var(--cv-muted)]">
                  {metaParts.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
            <Link
              href={detailHref}
              className="inline-block rounded bg-[var(--cv-red)] px-6 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)]"
            >
              {labels.moreDetail}
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-sm shrink-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-[var(--cv-border)] shadow-xl">
              <Image
                src={featured.posterUrl}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="400px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
