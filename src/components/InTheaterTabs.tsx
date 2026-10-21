"use client";

import { DragScroll } from "@/components/DragScroll";
import { MovieCard } from "@/components/MovieCard";
import { useUi } from "@/components/ui/UiProvider";
import type { InTheaterTabSets } from "@/lib/in-theater";
import type { Movie } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

/** Her sekme secildiginde ayirt edici renk (Populer / Yakinda / Top / En cok yorum). */
const TAB_ACTIVE_CLASS = [
  "border-sky-500 bg-sky-500/12 text-sky-800 shadow-[inset_0_-3px_0_0_rgb(14_165_233)] dark:border-sky-400 dark:bg-sky-500/14 dark:text-sky-100",
  "border-amber-500 bg-amber-500/12 text-amber-950 shadow-[inset_0_-3px_0_0_rgb(245_158_11)] dark:border-amber-400 dark:bg-amber-500/14 dark:text-amber-50",
  "border-emerald-500 bg-emerald-500/12 text-emerald-950 shadow-[inset_0_-3px_0_0_rgb(16_185_129)] dark:border-emerald-400 dark:bg-emerald-500/14 dark:text-emerald-50",
  "border-violet-500 bg-violet-500/12 text-violet-950 shadow-[inset_0_-3px_0_0_rgb(139_92_246)] dark:border-violet-400 dark:bg-violet-500/14 dark:text-violet-50",
] as const;

export function InTheaterTabs({
  tabs,
  locale,
}: {
  tabs: InTheaterTabSets;
  locale: "tr" | "en";
}) {
  const { ui } = useUi();
  const [tab, setTab] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const TABS =
    locale === "en"
      ? ["#Popular", "#Coming soon", "#Top rated", "#Most reviewed"]
      : ["#Popüler", "#Yakında", "#En yüksek puan", "#En çok yorum"];

  const rows: Movie[][] = [
    tabs.popular,
    tabs.upcoming,
    tabs.topRated,
    tabs.trending,
  ];
  const row = rows[tab]?.length ? rows[tab] : rows[0];

  useGSAP(
    () => {
      const el = rowRef.current;
      if (!el) return;
      const cards = el.querySelectorAll(".in-theater-card");
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { opacity: 0, x: 24, y: 12 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.48,
          stagger: 0.048,
          ease: "back.out(1.12)",
        },
      );
    },
    { dependencies: [tab], scope: rowRef },
  );

  const selectTab = (i: number) => {
    setTab(i);
    const btn = tabBtnRefs.current[i];
    if (btn) {
      gsap
        .timeline()
        .to(btn, { scale: 1.08, duration: 0.12, ease: "power2.out" })
        .to(btn, {
          scale: 1,
          duration: 0.42,
          ease: "elastic.out(1, 0.55)",
        });
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 border-b border-[var(--cv-border)]">
        {TABS.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              tabBtnRefs.current[i] = el;
            }}
            type="button"
            onClick={() => selectTab(i)}
            className={`rounded-t border-b-2 px-3 py-2 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase transition ${
              tab === i
                ? (TAB_ACTIVE_CLASS[i] ?? TAB_ACTIVE_CLASS[0])
                : "border-transparent text-[var(--cv-muted)] hover:border-[var(--cv-accent)]/30 hover:bg-[var(--cv-card)] hover:text-[var(--cv-heading)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <DragScroll
        ref={rowRef}
        className="flex gap-4 overflow-x-auto px-1 pb-4 pt-3"
      >
        {row.map((m, i) => (
          <div
            key={`${m.id}-${tab}`}
            className="in-theater-card w-[170px] shrink-0 md:w-[190px]"
          >
            <MovieCard
              movie={m}
              priority={i < 4}
              readMoreLabel={locale === "en" ? "Read more →" : "Detay →"}
              labels={{
                director: ui.director,
                runtime: ui.runtime,
                synopsis: ui.synopsis,
              }}
            />
          </div>
        ))}
      </DragScroll>
    </div>
  );
}
