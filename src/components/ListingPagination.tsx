import { listingHref, type SearchParamsLike } from "@/lib/listing-sort";
import Link from "next/link";

type Labels = {
  perPage: string;
  pageStatus: string;
  first: string;
  prev: string;
  next: string;
  last: string;
};

type Props = {
  pathname: string;
  sp: SearchParamsLike;
  preserveKeys: readonly string[];
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  labels: Labels;
};

function windowPages(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  start = Math.max(1, end - 4);
  const out: number[] = [];
  for (let p = start; p <= end; p++) out.push(p);
  return out;
}

const linkBtn =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded border border-[var(--cv-border-strong)] px-2 text-sm text-[var(--cv-heading)] hover:border-[var(--cv-accent)] hover:text-[var(--cv-accent)]";
const linkBtnActive =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded bg-[var(--cv-red)] px-2 text-sm font-bold text-[var(--cv-on-red)]";
const linkBtnDisabled =
  "inline-flex min-h-9 min-w-9 cursor-not-allowed items-center justify-center rounded border border-[var(--cv-border)] px-2 text-sm text-[var(--cv-faint)]";

export function ListingPagination({
  pathname,
  sp,
  preserveKeys,
  page,
  totalPages,
  pageSize,
  pageSizeOptions,
  labels,
}: Props) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  const pages = windowPages(page, totalPages);
  const status = labels.pageStatus
    .replace(/\{current\}/g, String(page))
    .replace(/\{total\}/g, String(totalPages));

  return (
    <div className="mt-8 flex flex-col gap-4 border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--cv-muted)]">
        <span>{labels.perPage}:</span>
        <div className="flex flex-wrap gap-1">
          {pageSizeOptions.map((ps) => {
            const active = ps === pageSize;
            const href = listingHref(pathname, sp, preserveKeys, {
              pageSize: String(ps),
              page: String(active ? page : 1),
            });
            return (
              <Link
                key={ps}
                href={href}
                className={active ? linkBtnActive : linkBtn}
              >
                {ps}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <p className="text-sm text-[var(--cv-muted)]">{status}</p>
        <nav
          className="flex flex-wrap items-center gap-1"
          aria-label="Pagination"
        >
          {page <= 1 ? (
            <span className={linkBtnDisabled}>{labels.first}</span>
          ) : (
            <Link
              href={listingHref(pathname, sp, preserveKeys, { page: "1" })}
              className={linkBtn}
            >
              {labels.first}
            </Link>
          )}
          {page <= 1 ? (
            <span className={linkBtnDisabled}>{labels.prev}</span>
          ) : (
            <Link
              href={listingHref(pathname, sp, preserveKeys, {
                page: String(prev),
              })}
              className={linkBtn}
            >
              {labels.prev}
            </Link>
          )}
          {pages.map((p) => (
            <Link
              key={p}
              href={listingHref(pathname, sp, preserveKeys, {
                page: String(p),
              })}
              className={p === page ? linkBtnActive : linkBtn}
            >
              {p}
            </Link>
          ))}
          {page >= totalPages ? (
            <span className={linkBtnDisabled}>{labels.next}</span>
          ) : (
            <Link
              href={listingHref(pathname, sp, preserveKeys, {
                page: String(next),
              })}
              className={linkBtn}
            >
              {labels.next}
            </Link>
          )}
          {page >= totalPages ? (
            <span className={linkBtnDisabled}>{labels.last}</span>
          ) : (
            <Link
              href={listingHref(pathname, sp, preserveKeys, {
                page: String(totalPages),
              })}
              className={linkBtn}
            >
              {labels.last}
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
