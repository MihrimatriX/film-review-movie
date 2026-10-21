import Link from "next/link";

function defaultHomeHref(p: number) {
  return p <= 1 ? "/" : `/?moviePage=${p}`;
}

function buildWindow(
  current: number,
  total: number,
  max = 7,
): (number | "gap")[] {
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "gap")[] = [];
  const push = (n: number | "gap") => {
    if (out[out.length - 1] === n && n === "gap") return;
    out.push(n);
  };
  push(1);
  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);
  if (start > 2) push("gap");
  for (let p = start; p <= end; p++) push(p);
  if (end < total - 1) push("gap");
  if (total > 1) push(total);
  return out;
}

export function HomeDiscoverPagination({
  currentPage,
  totalPages,
  firstLabel,
  prevLabel,
  nextLabel,
  lastLabel,
  pageStatusTemplate,
  resolveHref,
}: {
  currentPage: number;
  totalPages: number;
  firstLabel: string;
  prevLabel: string;
  nextLabel: string;
  lastLabel: string;
  pageStatusTemplate: string;
  /** Page 1 href may omit the query param (e.g. `/` or `/movies`). */
  resolveHref?: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const hrefForPage = resolveHref ?? defaultHomeHref;

  const pageLabel = pageStatusTemplate
    .replace(/\{current\}/g, String(currentPage))
    .replace(/\{total\}/g, String(totalPages));

  const win = buildWindow(currentPage, totalPages);

  const linkCls =
    "flex min-h-9 min-w-9 items-center justify-center rounded border border-[var(--cv-border-strong)] px-2 text-sm text-[var(--cv-heading)] hover:border-[var(--cv-accent)]/50 hover:bg-[var(--cv-deep)]";
  const activeCls =
    "flex min-h-9 min-w-9 items-center justify-center rounded border border-[var(--cv-red)] bg-[var(--cv-red)] px-2 text-sm font-bold text-[var(--cv-on-red)]";
  const disabledCls =
    "flex min-h-9 min-w-9 cursor-not-allowed items-center justify-center rounded border border-[var(--cv-border)] px-2 text-sm text-[var(--cv-faint)]";

  return (
    <nav
      className="mt-8 flex flex-col items-stretch gap-4 border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
      aria-label={pageLabel}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        {currentPage > 1 ? (
          <Link href={hrefForPage(1)} className={linkCls} title={firstLabel}>
            «
          </Link>
        ) : (
          <span className={disabledCls} aria-hidden>
            «
          </span>
        )}
        {currentPage > 1 ? (
          <Link
            href={hrefForPage(currentPage - 1)}
            className={linkCls}
            title={prevLabel}
          >
            ‹
          </Link>
        ) : (
          <span className={disabledCls} aria-hidden>
            ‹
          </span>
        )}
        <span className="px-2 text-sm font-medium text-[var(--cv-muted)]">
          {pageLabel}
        </span>
        {currentPage < totalPages ? (
          <Link
            href={hrefForPage(currentPage + 1)}
            className={linkCls}
            title={nextLabel}
          >
            ›
          </Link>
        ) : (
          <span className={disabledCls} aria-hidden>
            ›
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={hrefForPage(totalPages)}
            className={linkCls}
            title={lastLabel}
          >
            »
          </Link>
        ) : (
          <span className={disabledCls} aria-hidden>
            »
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {win.map((item, i) =>
          item === "gap" ? (
            <span
              key={`g-${i}`}
              className="px-1 text-[var(--cv-muted)]"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefForPage(item)}
              className={item === currentPage ? activeCls : linkCls}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
