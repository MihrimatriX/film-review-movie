"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[GlobalError]", error);
    }
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col items-center justify-center bg-[var(--cv-deep)] px-6 py-16 font-sans text-[var(--cv-body)] antialiased">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--cv-muted)]">
          Critical error
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--cv-accent)]">
          Application failed to load
        </h1>
        <p className="mt-4 max-w-md text-center text-sm text-[var(--cv-muted)]">
          The root layout crashed. Try reloading the page. If the problem
          persists, clear the site cache or contact support.
        </p>
        {process.env.NODE_ENV === "development" && error?.message ? (
          <pre className="mt-6 max-h-40 max-w-lg overflow-auto rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-3 text-left text-xs text-[var(--cv-faint)]">
            {error.message}
          </pre>
        ) : null}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-[var(--cv-red)] px-6 py-3 text-sm font-bold uppercase text-[var(--cv-on-red)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[var(--cv-border-strong)] bg-[var(--cv-card)] px-6 py-3 text-sm font-bold uppercase text-[var(--cv-heading)]"
          >
            Home
          </Link>
        </div>
      </body>
    </html>
  );
}
