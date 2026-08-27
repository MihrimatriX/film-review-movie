"use client";

import { useEffect, useState } from "react";

type Locale = "tr" | "en";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (!p) continue;
    const eq = p.indexOf("=");
    if (eq === -1) continue;
    const k = decodeURIComponent(p.slice(0, eq));
    if (k !== name) continue;
    return decodeURIComponent(p.slice(eq + 1));
  }
  return null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value,
  )}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function LanguageToggle() {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>("tr");

  useEffect(() => {
    queueMicrotask(() => {
      const c = getCookie("lang");
      setLocale(c === "en" ? "en" : "tr");
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-[4.5rem] rounded-full border border-[var(--cv-border)] bg-[var(--cv-input)]"
        aria-hidden
      />
    );
  }

  const isEn = locale === "en";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label={isEn ? "Switch to Turkish" : "Switch to English"}
      onClick={() => {
        const next: Locale = isEn ? "tr" : "en";
        setCookie("lang", next);
        setLocale(next);
        window.location.reload();
      }}
      className="relative inline-flex h-9 w-[4.5rem] shrink-0 items-center rounded-full border border-[var(--cv-border-strong)] bg-[var(--cv-input)] p-1 shadow-inner transition-colors hover:border-[var(--cv-accent)]"
    >
      <span
        className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--cv-card)] text-[10px] font-bold uppercase text-[var(--cv-heading)] shadow-md transition-all duration-200 ${
          isEn ? "right-1" : "left-1"
        }`}
      >
        {isEn ? "EN" : "TR"}
      </span>
    </button>
  );
}
