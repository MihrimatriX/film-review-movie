function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`cv-skeleton-shimmer rounded-md ${className ?? ""}`}
      aria-hidden
    />
  );
}

export default function AdminLoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <span className="sr-only">Loading…</span>
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] p-8">
        <Shimmer className="mx-auto h-8 w-32" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-10 w-full" />
          </div>
          <Shimmer className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
