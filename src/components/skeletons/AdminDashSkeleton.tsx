function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`cv-skeleton-shimmer rounded-md ${className ?? ""}`}
      aria-hidden
    />
  );
}

export function AdminDashSkeleton() {
  return (
    <div className="max-w-4xl space-y-8">
      <span className="sr-only">Loading…</span>
      <div>
        <Shimmer className="h-8 w-48" />
        <Shimmer className="mt-2 h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] p-4"
          >
            <Shimmer className="h-5 w-24" />
            <Shimmer className="mt-3 h-8 w-16" />
            <Shimmer className="mt-2 h-3 w-full" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
        <Shimmer className="h-5 w-32" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
