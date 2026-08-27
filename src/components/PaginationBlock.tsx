import { getLocale, t } from "@/lib/i18n";

export async function PaginationBlock({
  page = 1,
  totalPages = 1,
}: {
  page?: number;
  totalPages?: number;
}) {
  const locale = await getLocale();
  const p = t(locale).pagination;
  const pageLabel = p.pageStatus
    .replace(/\{current\}/g, String(page))
    .replace(/\{total\}/g, String(totalPages));

  return (
    <div className="mt-8 flex flex-col gap-4 border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-[var(--cv-muted)]">
        <label>{p.perPage}:</label>
        <select className="rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-2 py-1 text-sm text-[var(--cv-heading)]">
          <option>10</option>
          <option>20</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-[var(--cv-muted)]">{pageLabel}:</span>
        {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map(
          (n) => (
            <span
              key={n}
              className={`flex h-8 w-8 items-center justify-center rounded ${
                n === page
                  ? "bg-[var(--cv-red)] text-[var(--cv-on-red)]"
                  : "border border-[var(--cv-border-strong)] text-[var(--cv-muted)]"
              }`}
            >
              {n}
            </span>
          ),
        )}
        <span className="text-[var(--cv-muted)]">→</span>
      </div>
    </div>
  );
}
