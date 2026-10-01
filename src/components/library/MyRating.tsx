"use client";

import { toast } from "@/components/ui/Toaster";
import { useUi } from "@/components/ui/UiProvider";
import {
  libraryKey,
  setMyRating,
  useLibrary,
  type LibraryItem,
} from "@/lib/user-library";
import { useState } from "react";

/** 10 yıldızlı kişisel puan; tarayıcıda saklanır. */
export function MyRating({ item }: { item: LibraryItem }) {
  const { ui } = useUi();
  const library = useLibrary();
  const current = library.ratings[libraryKey(item.kind, item.slug)]?.value ?? 0;
  const [hover, setHover] = useState(0);
  const shown = hover || current;

  return (
    <div className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-dosis)] text-xs font-bold uppercase tracking-wider text-[var(--cv-muted)]">
          {ui.myRating}
        </p>
        {current ? (
          <button
            type="button"
            onClick={() => setMyRating(item, null)}
            className="text-xs text-[var(--cv-faint)] underline-offset-2 hover:text-[var(--cv-red)] hover:underline"
          >
            {ui.clearRating}
          </button>
        ) : null}
      </div>
      <div
        className="mt-2 flex flex-wrap items-center gap-0.5"
        role="radiogroup"
        aria-label={ui.myRating}
        onMouseLeave={() => setHover(0)}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const on = n <= shown;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={current === n}
              aria-label={`${n}/10`}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(0)}
              onClick={() => {
                setMyRating(item, n);
                toast(`${ui.rated} — ${n}/10`);
              }}
              className={`text-2xl leading-none transition-transform duration-200 hover:scale-125 focus-visible:scale-125 focus-visible:outline-none ${
                on
                  ? "text-[var(--cv-star)] drop-shadow-[0_0_8px_color-mix(in_srgb,var(--cv-star)_60%,transparent)]"
                  : "text-[var(--cv-border-strong)]"
              }`}
              style={{ transitionDelay: on ? `${n * 12}ms` : "0ms" }}
            >
              ★
            </button>
          );
        })}
        <span className="ml-3 min-w-[3.5rem] font-[family-name:var(--font-dosis)] text-xl font-bold tabular-nums text-[var(--cv-heading)]">
          {shown ? `${shown}/10` : "–"}
        </span>
      </div>
      <p className="mt-1 text-xs text-[var(--cv-faint)]">
        {current ? ui.watchlistHint : ui.rateHint}
      </p>
    </div>
  );
}
