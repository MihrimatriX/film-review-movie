import type { MovieTmdbExtras } from "@/lib/catalog";
import Image from "next/image";
import Link from "next/link";

type Labels = {
  tagline: string;
  voteCount: string;
  budget: string;
  revenue: string;
  originalTitle: string;
  directors: string;
  writers: string;
  producers: string;
  companies: string;
  countries: string;
  languages: string;
  keywords: string;
  status: string;
  trailer: string;
  openImdb: string;
  officialSite: string;
  cast: string;
};

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="border-b border-[var(--cv-border)]/60 py-2 last:border-0">
      <dt className="text-xs font-bold uppercase tracking-wide text-[var(--cv-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--cv-heading)]">{value}</dd>
    </div>
  );
}

export function MovieTmdbDetailSection({
  extras,
  labels,
}: {
  extras: MovieTmdbExtras;
  labels: Labels;
}) {
  return (
    <div className="space-y-10">
      {extras.backdropUrl ? (
        <div className="relative -mx-4 h-48 overflow-hidden rounded-xl border border-[var(--cv-border)] md:-mx-6 md:h-64">
          <Image
            src={extras.backdropUrl}
            alt=""
            fill
            className="object-cover object-[center_20%]"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--cv-deep)] via-[var(--cv-deep)]/50 to-transparent" />
          {extras.tagline ? (
            <p className="absolute inset-x-0 bottom-0 p-4 font-[family-name:var(--font-dosis)] text-lg italic text-white/95 md:p-6 md:text-xl">
              “{extras.tagline}”
            </p>
          ) : null}
        </div>
      ) : extras.tagline ? (
        <p className="font-[family-name:var(--font-dosis)] text-lg italic text-[var(--cv-muted)]">
          “{extras.tagline}”
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {extras.imdbUrl ? (
          <a
            href={extras.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-card)] px-3 py-2 text-sm font-semibold text-[var(--cv-accent)] hover:border-[var(--cv-accent)]/50"
          >
            {labels.openImdb} ↗
          </a>
        ) : null}
        {extras.homepage ? (
          <a
            href={extras.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-card)] px-3 py-2 text-sm font-semibold text-[var(--cv-heading)] hover:border-[var(--cv-accent)]/50"
          >
            {labels.officialSite} ↗
          </a>
        ) : null}
      </div>

      <dl className="grid gap-0 sm:grid-cols-2">
        <MetaRow
          label={labels.voteCount}
          value={
            extras.voteCount > 0 ? extras.voteCount.toLocaleString() : null
          }
        />
        <MetaRow label={labels.budget} value={extras.budgetLabel} />
        <MetaRow label={labels.revenue} value={extras.revenueLabel} />
        <MetaRow label={labels.originalTitle} value={extras.originalTitle} />
        <MetaRow
          label={labels.directors}
          value={extras.directors.join(", ") || null}
        />
        <MetaRow
          label={labels.writers}
          value={extras.writers.join(", ") || null}
        />
        <MetaRow
          label={labels.producers}
          value={extras.producers.join(", ") || null}
        />
        <MetaRow
          label={labels.companies}
          value={extras.companies.join(", ") || null}
        />
        <MetaRow
          label={labels.countries}
          value={extras.countries.join(", ") || null}
        />
        <MetaRow
          label={labels.languages}
          value={extras.languages.join(", ") || null}
        />
        <MetaRow label={labels.status} value={extras.status} />
      </dl>

      {extras.trailerYoutubeKey ? (
        <section>
          <h2 className="font-[family-name:var(--font-dosis)] text-lg font-bold uppercase tracking-wide text-[var(--cv-heading)]">
            {labels.trailer}
            {extras.trailerName ? (
              <span className="ml-2 text-sm font-normal normal-case text-[var(--cv-muted)]">
                — {extras.trailerName}
              </span>
            ) : null}
          </h2>
          <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-[var(--cv-border)] bg-black shadow-lg">
            <iframe
              title={extras.trailerName || labels.trailer}
              src={`https://www.youtube.com/embed/${extras.trailerYoutubeKey}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}

      {extras.cast.length > 0 ? (
        <section>
          <h2 className="font-[family-name:var(--font-dosis)] text-lg font-bold uppercase tracking-wide text-[var(--cv-heading)]">
            {labels.cast}
          </h2>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {extras.cast.map((c) => (
              <Link
                key={c.slug}
                href={`/celebrities/${c.slug}`}
                className="group flex w-[120px] shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] transition hover:border-[var(--cv-accent)]/45"
              >
                <div className="relative aspect-[2/3] w-full bg-[var(--cv-deep)]">
                  {c.profileUrl ? (
                    <Image
                      src={c.profileUrl}
                      alt=""
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="120px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[var(--cv-faint)]">
                      —
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="line-clamp-2 text-xs font-bold text-[var(--cv-accent)]">
                    {c.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] text-[var(--cv-muted)]">
                    {c.character}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {extras.keywords.length > 0 ? (
        <section>
          <h2 className="font-[family-name:var(--font-dosis)] text-sm font-bold uppercase tracking-wide text-[var(--cv-muted)]">
            {labels.keywords}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {extras.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-[var(--cv-border)] bg-[var(--cv-deep)] px-3 py-1 text-xs text-[var(--cv-body)]"
              >
                {k}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
