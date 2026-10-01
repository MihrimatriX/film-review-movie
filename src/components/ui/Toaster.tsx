"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; message: string; tone: "accent" | "red" };

const EVENT = "film-review:toast";
let seq = 0;

/** Herhangi bir istemci bileşeninden kısa bildirim gösterir. */
export function toast(message: string, tone: Toast["tone"] = "accent") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<Toast>(EVENT, { detail: { id: ++seq, message, tone } }),
  );
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const t = (e as CustomEvent<Toast>).detail;
      setItems((prev) => [...prev.slice(-2), t]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, 2600);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className="cv-toast pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--cv-border-strong)] bg-[color-mix(in_srgb,var(--cv-mid)_92%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--cv-heading)] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] backdrop-blur-md"
        >
          <span
            className={`h-2 w-2 rounded-full ${t.tone === "red" ? "bg-[var(--cv-red)]" : "bg-[var(--cv-accent)]"}`}
            aria-hidden
          />
          {t.message}
        </div>
      ))}
    </div>
  );
}
