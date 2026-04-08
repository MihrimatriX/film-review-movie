import { PageHero } from "@/components/PageHero";
import { SeriesCastMemberCard } from "@/components/SeriesCastMemberCard";
import { SeriesRelatedCard } from "@/components/SeriesRelatedCard";
import { SeriesTmdbDetailSection } from "@/components/tmdb/SeriesTmdbDetailSection";
import { getSeriesMerged, getSeriesPageBundle } from "@/lib/catalog";
import { getLocale, t } from "@/lib/i18n";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const bundle = await getSeriesPageBundle(locale, slug);
  if (!bundle)
    return { title: "Not found", robots: { index: false, follow: false } };
  const { series } = bundle;
  return buildDetailMetadata({
    title: series.title,
    description: series.synopsis,
    pathname: `/series/${slug}`,
    image: series.poster || null,
  });
}

export default async function SeriesSinglePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const isEn = locale === "en";
  const dict = t(locale);
  const d = dict.tmdbDetail;
  const bundle = await getSeriesPageBundle(locale, slug);
  if (!bundle) notFound();
  const { series: s, tmdb } = bundle;

  const list = await getSeriesMerged(locale);
  const related = list.filter((x) => x.slug !== slug).slice(0, 3);

  const castNav =
    tmdb || s.cast?.length
      ? ([
          {
            id: (tmdb ? "tmdb" : "cast") as string,
            tr: "Oyuncular",
            en: "Cast",
          },
        ] as const)
      : [];

  const navTabs = [
    { id: "overview", tr: "Genel", en: "Overview" },
    ...castNav,
    { id: "media", tr: "Medya", en: "Media" },
    { id: "related", tr: "Benzer", en: "Related" },
  ];

  return (
    <>
      <PageHero
        title={s.title}
        crumbs={[
          { label: isEn ? "Home" : "Ana sayfa", href: "/" },
          { label: isEn ? "Series" : "Diziler", href: "/series" },
          { label: s.title },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="w-full max-w-sm shrink-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-[var(--cv-border)] shadow-xl">
              <Image
                src={s.poster}
                alt={s.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {tmdb?.trailerYoutubeKey ? (
                <a
                  href={`https://www.youtube.com/watch?v=${tmdb.trailerYoutubeKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-[var(--cv-red)] py-3 text-center text-sm font-bold uppercase text-[var(--cv-on-red)] hover:opacity-95"
                >
                  {isEn ? "▶ Watch trailer" : "▶ Fragmanı izle"}
                </a>
              ) : (
                <button
                  type="button"
                  className="rounded bg-[var(--cv-red)] py-3 text-center text-sm font-bold uppercase text-[var(--cv-on-red)] opacity-80"
                  disabled
                >
                  {isEn ? "▶ Watch trailer" : "▶ Fragmanı izle"}
                </button>
              )}
              <button
                type="button"
                className="rounded bg-[var(--cv-amber-btn)] py-3 text-center text-sm font-bold uppercase text-[var(--cv-on-amber)]"
              >
                {isEn ? "Buy ticket" : "Bilet al"}
              </button>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-[family-name:var(--font-dosis)] text-3xl font-bold text-[var(--cv-heading)] md:text-4xl">
              {s.title}{" "}
              <span className="text-xl text-[var(--cv-muted)]">
                {s.yearLabel}
              </span>
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--cv-muted)]">
              <span className="rounded border border-[var(--cv-border-strong)] px-3 py-1">
                {isEn ? "♥ Add to favorites" : "♥ Favorilere ekle"}
              </span>
              <span className="rounded border border-[var(--cv-border-strong)] px-3 py-1">
                {isEn ? "↗ Share" : "↗ Paylaş"}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-8 border-b border-[var(--cv-border)] pb-6">
              <div className="text-[var(--cv-accent)]">
                ★{" "}
                <span className="text-3xl text-[var(--cv-heading)]">
                  {s.rating}
                </span>
                <span className="text-[var(--cv-muted)]"> /10</span>
                <p className="text-sm text-[var(--cv-muted)]">
                  {s.reviewCount} {isEn ? "reviews" : "yorum"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-[var(--cv-muted)]">
                  {isEn ? "Rate this" : "Puan ver"}
                </p>
                <p className="text-[var(--cv-star)]">★★★★★★★★☆</p>
              </div>
            </div>

            <nav className="mt-6 flex flex-wrap gap-2 border-b border-[var(--cv-border)] pb-2 text-sm font-bold uppercase">
              {navTabs.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className="rounded px-2 py-1 text-[var(--cv-muted)] hover:bg-[var(--cv-card)] hover:text-[var(--cv-accent)]"
                >
                  {isEn ? tab.en : tab.tr}
                </a>
              ))}
            </nav>

            <section id="overview" className="mt-8 scroll-mt-24">
              <p className="leading-relaxed text-[var(--cv-body)]">
                {s.synopsis}
              </p>
              {!tmdb ? (
                <p className="mt-6 rounded-lg border border-dashed border-[var(--cv-border-strong)] bg-[var(--cv-card)]/50 p-4 text-sm text-[var(--cv-muted)]">
                  {d.localNotice}
                </p>
              ) : null}
              {s.seasons[0] && (
                <>
                  <h3 className="mt-8 font-[family-name:var(--font-dosis)] text-lg font-bold uppercase text-[var(--cv-heading)]">
                    {isEn ? "Current season" : "Güncel sezon"}
                  </h3>
                  <div className="mt-4 flex gap-4 rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
                    <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded">
                      <Image
                        src={s.seasons[0].image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-[var(--cv-accent)]">
                        {s.seasons[0].title}
                      </span>
                      <p className="text-sm text-[var(--cv-muted)]">
                        {s.seasons[0].episodes} {isEn ? "episodes" : "bölüm"}
                      </p>
                      <p className="mt-1 text-sm text-[var(--cv-faint)]">
                        {s.seasons[0].description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </section>

            {(s.mediaThumbs?.length || s.videoThumb) && (
              <section id="media" className="mt-10 scroll-mt-24">
                <h3 className="font-[family-name:var(--font-dosis)] text-lg font-bold uppercase text-[var(--cv-heading)]">
                  {isEn ? "Media" : "Medya"}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {s.mediaThumbs.filter(Boolean).map((src) => (
                    <div
                      key={src}
                      className="relative aspect-video overflow-hidden rounded border border-[var(--cv-border)]"
                    >
                      <Image src={src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                  {s.videoThumb ? (
                    <div className="relative aspect-video overflow-hidden rounded border border-[var(--cv-border)]">
                      <Image
                        src={s.videoThumb}
                        alt=""
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 grid place-items-center bg-black/40">
                        <span className="rounded-full bg-black/60 px-3 py-2 text-xs font-bold uppercase text-white">
                          {isEn ? "Play" : "Oynat"}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            )}

            {s.cast?.length && !tmdb ? (
              <section id="cast" className="mt-10 scroll-mt-24">
                <h3 className="font-[family-name:var(--font-dosis)] text-lg font-bold uppercase text-[var(--cv-heading)]">
                  {isEn ? "Cast" : "Oyuncular"}
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {s.cast.map((c) => (
                    <SeriesCastMemberCard
                      key={c.name}
                      member={c}
                      labels={{ role: dict.cardHover.role }}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <aside className="mt-10 space-y-3 rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 text-sm">
              {s.director ? (
                <div>
                  <h6 className="text-xs uppercase text-[var(--cv-muted)]">
                    {isEn ? "Director" : "Yönetmen"}
                  </h6>
                  <p className="text-[var(--cv-heading)]">{s.director}</p>
                </div>
              ) : null}
              {s.writers ? (
                <div>
                  <h6 className="text-xs uppercase text-[var(--cv-muted)]">
                    {isEn ? "Writer" : "Yazar"}
                  </h6>
                  <p className="text-[var(--cv-heading)]">{s.writers}</p>
                </div>
              ) : null}
              <div>
                <h6 className="text-xs uppercase text-[var(--cv-muted)]">
                  Stars
                </h6>
                <p className="text-[var(--cv-heading)]">{s.starsLine}</p>
              </div>
              <div>
                <h6 className="text-xs uppercase text-[var(--cv-muted)]">
                  Genres
                </h6>
                <p className="text-[var(--cv-accent)]">{s.genres.join(", ")}</p>
              </div>
              <div>
                <h6 className="text-xs uppercase text-[var(--cv-muted)]">
                  Release date
                </h6>
                <p className="text-[var(--cv-heading)]">{s.releaseDate}</p>
              </div>
              <div>
                <h6 className="text-xs uppercase text-[var(--cv-muted)]">
                  {isEn ? "Run time" : "Süre"}
                </h6>
                <p className="text-[var(--cv-heading)]">{s.runtime}</p>
              </div>
              <div>
                <h6 className="text-xs uppercase text-[var(--cv-muted)]">
                  {isEn ? "MPAA" : "Yaş sınırı"}
                </h6>
                <p className="text-[var(--cv-heading)]">{s.mpaa}</p>
              </div>
              <div>
                <h6 className="text-xs uppercase text-[var(--cv-muted)]">
                  {isEn ? "Plot keywords" : "Anahtar kelimeler"}
                </h6>
                <p className="flex flex-wrap gap-2">
                  {s.plotKeywords.map((k) => (
                    <span
                      key={k}
                      className="rounded bg-[var(--cv-deep)] px-2 py-0.5 text-xs text-[var(--cv-muted)]"
                    >
                      {k}
                    </span>
                  ))}
                </p>
              </div>
            </aside>

            {tmdb ? (
              <section
                id="tmdb"
                className="mt-12 scroll-mt-24 border-t border-[var(--cv-border)] pt-10"
              >
                <h3 className="mb-8 font-[family-name:var(--font-dosis)] text-xl font-bold uppercase tracking-wide text-[var(--cv-heading)]">
                  {d.sectionTitle}
                </h3>
                <SeriesTmdbDetailSection
                  extras={tmdb}
                  labels={{
                    tagline: d.tagline,
                    voteCount: d.voteCount,
                    seasons: d.seasons,
                    episodes: d.episodes,
                    episodeRuntime: d.episodeRuntime,
                    lastAired: d.lastAired,
                    status: d.status,
                    networks: d.networks,
                    creators: d.creators,
                    trailer: d.trailer,
                    openImdb: d.openImdb,
                    officialSite: d.officialSite,
                    cast: d.cast,
                    keywords: d.keywords,
                  }}
                />
              </section>
            ) : null}

            <section id="related" className="mt-10 scroll-mt-24">
              <h3 className="font-[family-name:var(--font-dosis)] text-lg font-bold uppercase text-[var(--cv-heading)]">
                {isEn ? "Related shows" : "Benzer diziler"}
              </h3>
              <div className="mt-4 flex flex-wrap gap-4">
                {related.map((r) => (
                  <SeriesRelatedCard key={r.id} series={r} />
                ))}
              </div>
            </section>

            <div className="mt-10">
              <Link
                href="/series"
                className="text-[var(--cv-accent)] hover:underline"
              >
                ← {isEn ? "All series" : "Tüm diziler"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
