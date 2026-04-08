import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { isTmdbConfigured } from "@/lib/tmdb";

export function TmdbSetupBanner({ locale }: { locale: Locale }) {
  if (isTmdbConfigured()) return null;

  const s = t(locale);

  return (
    <div
      role="status"
      className="border-b border-[color-mix(in_srgb,var(--cv-star)_55%,var(--cv-border))] bg-[color-mix(in_srgb,var(--cv-star)_14%,var(--cv-deep))] px-4 py-2.5 text-center text-sm text-[var(--cv-heading)]"
    >
      <p>
        <strong className="font-[family-name:var(--font-dosis)] uppercase tracking-wide text-[var(--cv-accent)]">
          {s.tmdb.setupTitle}
        </strong>
        <span className="mx-2 text-[var(--cv-muted)]">—</span>
        <span className="text-[var(--cv-body)]">{s.tmdb.setupBanner}</span>
      </p>
      <p className="mt-1">
        <Link
          href="https://www.themoviedb.org/settings/api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold uppercase text-[var(--cv-red)] hover:underline"
        >
          {s.tmdb.getKey}
        </Link>
      </p>
    </div>
  );
}
