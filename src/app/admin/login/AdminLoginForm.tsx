"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Geçersiz şifre");
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
      <div className="mb-8" aria-hidden>
        <BrandLogo variant="auth" />
      </div>
      <div className="w-full max-w-sm rounded-lg border border-[var(--cv-border)] bg-[var(--cv-mid)] p-6">
        <h1 className="font-[family-name:var(--font-dosis)] text-xl font-bold uppercase text-[var(--cv-heading)]">
          Admin girişi
        </h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <label className="text-xs uppercase text-[var(--cv-muted)]">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)] focus:border-[var(--cv-accent)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-[var(--cv-red)] py-2 text-sm font-bold uppercase text-[var(--cv-on-red)] disabled:opacity-50"
          >
            {pending ? "…" : "Giriş"}
          </button>
        </form>
      </div>
    </div>
  );
}
