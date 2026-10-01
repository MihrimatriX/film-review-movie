"use client";

import { useUi } from "@/components/ui/UiProvider";
import { useEffect, useRef, useState } from "react";

/** Üstte okuma ilerleme çubuğu + belirli bir kaydırmadan sonra “başa dön” düğmesi. */
export function ScrollChrome() {
  const { ui } = useUi();
  const barRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setShowTop(window.scrollY > 700);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
        aria-hidden
      >
        <div
          ref={barRef}
          className="h-full origin-left bg-gradient-to-r from-[var(--cv-red)] via-[var(--cv-accent)] to-[var(--cv-accent)] shadow-[0_0_12px_var(--cv-accent)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          })
        }
        aria-label={ui.backToTop}
        title={ui.backToTop}
        tabIndex={showTop ? 0 : -1}
        className={`fixed bottom-6 right-5 z-[70] grid h-11 w-11 place-items-center rounded-full border border-[var(--cv-border-strong)] bg-[color-mix(in_srgb,var(--cv-mid)_88%,transparent)] text-[var(--cv-accent)] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cv-accent)] ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
