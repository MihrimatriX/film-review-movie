import Link from "next/link";
import { getLocale, t } from "@/lib/i18n";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminNotFound() {
  const locale = await getLocale();
  const n = t(locale).notFound;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--cv-muted)]">
        Admin · 404
      </p>
      <h1 className="font-[family-name:var(--font-dosis)] text-3xl font-bold text-[var(--cv-accent)]">
        {n.title}
      </h1>
      <p className="max-w-md text-sm text-[var(--cv-muted)]">{n.message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/admin"
          className="rounded bg-[var(--cv-red)] px-5 py-2.5 text-sm font-bold uppercase text-[var(--cv-on-red)]"
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
