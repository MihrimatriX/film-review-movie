"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[AdminError]", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--cv-deep)] px-4 py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--cv-muted)]">
        Admin
      </p>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold text-[var(--cv-accent)]">
        Panel error
      </h1>
      <p className="max-w-md text-sm text-[var(--cv-muted)]">
        This admin screen failed to render. You can retry or return to the
        dashboard or login.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded bg-[var(--cv-red)] px-5 py-2.5 text-sm font-bold uppercase text-[var(--cv-on-red)]"
        >
          Retry
        </button>
        <Link
          href="/admin"
          className="rounded border border-[var(--cv-border)] px-5 py-2.5 text-sm font-bold uppercase text-[var(--cv-heading)]"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/login"
          className="rounded border border-[var(--cv-border)] px-5 py-2.5 text-sm font-bold uppercase text-[var(--cv-heading)]"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
