"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-[5.5rem] rounded-full border border-[var(--cv-border)] bg-[var(--cv-input)]"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-9 w-[5.5rem] shrink-0 items-center rounded-full border border-[var(--cv-border-strong)] bg-[var(--cv-input)] p-1 shadow-inner transition-colors hover:border-[var(--cv-accent)]"
    >
      <span
        className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--cv-red)] text-sm text-[var(--cv-on-red)] shadow-md transition-all duration-200 ${
          isDark ? "left-1" : "right-1"
        }`}
      >
        {isDark ? "☾" : "☀"}
      </span>
    </button>
  );
}
