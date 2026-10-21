function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`cv-skeleton-shimmer rounded-md ${className ?? ""}`}
      aria-hidden
    />
  );
}

export function SitePageSkeleton() {
  return (
    <div className="min-h-[45vh]">
      <span className="sr-only">Loading…</span>
      <section className="border-b border-[var(--cv-border)] bg-[var(--cv-mid)] py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <Shimmer className="h-9 w-[min(100%,20rem)] md:h-11" />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Shimmer className="h-4 w-16 rounded" />
            <span className="text-[var(--cv-faint)]">›</span>
            <Shimmer className="h-4 w-28 rounded" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-6 flex flex-col gap-3 rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Shimmer className="h-5 w-52 max-w-full" />
          <div className="flex flex-wrap items-center gap-3">
            <Shimmer className="h-8 w-24 rounded" />
            <Shimmer className="h-8 w-32 rounded" />
            <div className="flex rounded border border-[var(--cv-border-strong)]">
              <Shimmer className="h-9 w-10 rounded-none rounded-l border-r border-[var(--cv-border-strong)]" />
              <Shimmer className="h-9 w-10 rounded-none rounded-r" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap gap-2 border-b border-[var(--cv-border)] pb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Shimmer key={i} className="h-10 w-28" />
              ))}
            </div>
            <div className="flex gap-3 overflow-hidden pb-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Shimmer
                  key={i}
                  className="aspect-[185/284] w-[140px] shrink-0 md:w-[160px]"
                />
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-md bg-[var(--cv-card)] shadow-[inset_0_0_0_1px_var(--cv-border)]"
                >
                  <Shimmer className="aspect-[185/284] w-full rounded-none rounded-t-md" />
                  <div className="space-y-2 p-3">
                    <Shimmer className="h-3.5 w-full" />
                    <Shimmer className="h-3 w-14" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-full shrink-0 space-y-4 lg:w-80">
            <Shimmer className="h-7 w-40" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-md border border-[var(--cv-border)] bg-[var(--cv-card)] p-2"
              >
                <Shimmer className="h-16 w-20 shrink-0 rounded" />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1">
                  <Shimmer className="h-2.5 w-20 rounded" />
                  <Shimmer className="h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
