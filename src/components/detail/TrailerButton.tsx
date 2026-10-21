"use client";

import { useUi } from "@/components/ui/UiProvider";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Fragmanı site içinde, gizlilik dostu YouTube gömmesiyle bir modalda oynatır. */
export function TrailerButton({
  youtubeKey,
  title,
  label,
}: {
  youtubeKey: string;
  title: string;
  label: string;
}) {
  const { ui } = useUi();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="group/tr inline-flex items-center gap-3 rounded-md bg-[var(--cv-red)] py-3 pl-3 pr-6 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)] shadow-[0_12px_30px_-12px_var(--cv-red)] transition hover:brightness-110"
        aria-haspopup="dialog"
      >
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/20">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/25 group-hover/tr:animate-none" />
          <svg
            viewBox="0 0 24 24"
            className="relative ml-0.5 h-3.5 w-3.5"
            fill="currentColor"
            aria-hidden
          >
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        </span>
        {label}
      </button>
      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label={`${label} — ${title}`}
            >
              <button
                type="button"
                tabIndex={-1}
                aria-label={ui.close}
                className="surprise-backdrop absolute inset-0 bg-black/85 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <div className="surprise-panel relative w-full max-w-5xl">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p className="truncate font-[family-name:var(--font-dosis)] text-lg font-bold text-white">
                    {title}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 text-white transition hover:rotate-90 hover:border-[var(--cv-red)]"
                    aria-label={ui.close}
                  >
                    ✕
                  </button>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeKey)}?autoplay=1&rel=0&modestbranding=1`}
                    title={`${label} — ${title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
