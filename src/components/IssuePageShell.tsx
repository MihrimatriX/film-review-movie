import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";

const linkClass =
  "rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] px-4 py-2.5 text-sm font-semibold text-[var(--cv-heading)] transition hover:border-[var(--cv-accent)]/50 hover:text-[var(--cv-accent)]";

const primaryBtnClass =
  "rounded-lg bg-[var(--cv-red)] px-6 py-3 text-center font-[family-name:var(--font-dosis)] text-sm font-bold uppercase tracking-wide text-[var(--cv-on-red)] shadow-[0_8px_28px_-8px_rgba(221,0,63,0.45)] transition hover:brightness-110";

const secondaryBtnClass =
  "rounded-lg border border-[var(--cv-border-strong)] bg-[var(--cv-card)] px-6 py-3 text-center font-[family-name:var(--font-dosis)] text-sm font-bold uppercase tracking-wide text-[var(--cv-heading)] transition hover:border-[var(--cv-accent)]/40";

export type IssueNavItem = { href: string; label: string };

/**
 * Shared layout for 404 and recoverable error pages.
 */
export function IssuePageShell({
  code,
  eyebrow,
  title,
  message,
  hint,
  showLogo = true,
  primaryLabel,
  primaryHref,
  onPrimaryClick,
  secondaryLabel,
  secondaryHref,
  navLabel,
  navItems,
}: {
  code: string;
  eyebrow: string;
  title: string;
  message: string;
  hint?: string;
  showLogo?: boolean;
  primaryLabel: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  navLabel: string;
  navItems: IssueNavItem[];
}) {
  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden bg-[var(--cv-deep)] px-4 py-12 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--cv-accent) 0%, transparent 45%), radial-gradient(circle at 80% 70%, var(--cv-red) 0%, transparent 40%)",
        }}
      />
      <div className="relative z-[1] w-full max-w-lg text-center">
        {showLogo ? (
          <Link
            href="/"
            className="mx-auto mb-10 inline-flex items-center gap-2 opacity-90 transition hover:opacity-100"
            aria-label="Ana sayfa"
          >
            <BrandLogo variant="compact" />
          </Link>
        ) : null}

        {eyebrow.trim() ? (
          <p className="font-[family-name:var(--font-dosis)] text-xs font-bold uppercase tracking-[0.2em] text-[var(--cv-muted)]">
            {eyebrow}
          </p>
        ) : null}
        <p
          className="mt-3 font-[family-name:var(--font-dosis)] text-7xl font-black leading-none text-[var(--cv-accent)] md:text-8xl"
          aria-hidden
        >
          {code}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-dosis)] text-2xl font-bold text-[var(--cv-heading)] md:text-3xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--cv-muted)] md:text-base">
          {message}
        </p>
        {hint ? (
          <p className="mt-2 text-xs text-[var(--cv-faint)] md:text-sm">
            {hint}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          {primaryHref ? (
            <Link href={primaryHref} className={primaryBtnClass}>
              {primaryLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onPrimaryClick}
              className={primaryBtnClass}
            >
              {primaryLabel}
            </button>
          )}
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className={secondaryBtnClass}>
              {secondaryLabel}
            </Link>
          ) : null}
        </div>

        {navItems.length > 0 ? (
          <div className="mt-12 border-t border-[var(--cv-border)] pt-10">
            <p className="mb-4 font-[family-name:var(--font-dosis)] text-xs font-bold uppercase tracking-wider text-[var(--cv-muted)]">
              {navLabel}
            </p>
            <nav
              className="flex flex-wrap justify-center gap-2"
              aria-label={navLabel}
            >
              {navItems.map((n) => (
                <Link key={n.href} href={n.href} className={linkClass}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </div>
  );
}
