"use client";

import { WatchlistButton } from "@/components/library/WatchlistButton";
import { PosterCardDogEar } from "@/components/PosterCardDogEar";
import { useUi } from "@/components/ui/UiProvider";
import type { LibraryItem } from "@/lib/user-library";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type PosterCardBackLine = { label: string; value: string };

type Props = {
  href: string;
  item: LibraryItem;
  yearLabel: string;
  priority?: boolean;
  readMoreLabel?: string;
  variant?: "film" | "series";
  /** Arka yüzde gösterilecek satırlar (yönetmen, süre…). */
  backLines?: PosterCardBackLine[];
  synopsis?: string;
  /** Başlık altı ek bilgi (ör. “· 120 yorum”). */
  footerExtra?: React.ReactNode;
};

/** Bu puanın üstü “holografik nadir kart” olur. */
const RARE_THRESHOLD = 8;

/**
 * 3D poster kartı:
 * - imleci takip eden eğim (tilt) + ışık yansıması + derinlikte yüzen rozetler
 * - yüksek puanlılarda holografik folyo
 * - ↻ ile 180° çevrilip arka yüzde detaylar (dokunmatikte de çalışır)
 */
export function PosterCard3D({
  href,
  item,
  yearLabel,
  priority,
  readMoreLabel,
  variant = "film",
  backLines = [],
  synopsis,
  footerExtra,
}: Props) {
  const { ui } = useUi();
  const rootRef = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const [flipped, setFlipped] = useState(false);
  const rare = item.rating >= RARE_THRESHOLD;

  const setVars = useCallback((vars: Record<string, string>) => {
    const el = rootRef.current;
    if (!el) return;
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !canTilt()) return;
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const dir = flipped ? -1 : 1;
      setVars({
        "--rx": ((0.5 - py) * 18).toFixed(2),
        "--ry": ((px - 0.5) * 22 * dir).toFixed(2),
        "--mx": `${(px * 100).toFixed(1)}%`,
        "--my": `${(py * 100).toFixed(1)}%`,
        "--hyp": Math.min(Math.hypot(px - 0.5, py - 0.5) / 0.5, 1).toFixed(3),
      });
      el.dataset.active = "true";
    });
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    setVars({
      "--rx": "0",
      "--ry": "0",
      "--mx": "50%",
      "--my": "50%",
      "--hyp": "0",
    });
    if (rootRef.current) rootRef.current.dataset.active = "false";
  };

  const flip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlipped((f) => !f);
    setVars({ "--rx": "0", "--ry": "0" });
  };

  return (
    <article
      ref={rootRef}
      className={`card3d group ${variant === "series" ? "card3d--series" : ""}`}
      data-flipped={flipped}
      data-rare={rare}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <div className="card3d-shadow" aria-hidden />
      <div className="card3d-body">
        {/* ——— ÖN YÜZ ——— */}
        <div className="card3d-face card3d-front" inert={flipped}>
          <Link
            href={href}
            className="card3d-front-link movie-card-shell group"
          >
            <div className="card3d-poster">
              <Image
                src={item.poster}
                alt={item.title}
                fill
                className="card3d-poster-img object-cover"
                sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 220px"
                priority={priority}
              />
              <div className="card3d-vignette" aria-hidden />
              {rare ? <div className="card3d-holo" aria-hidden /> : null}
              <div className="card3d-glare" aria-hidden />
              {readMoreLabel ? (
                <PosterCardDogEar label={readMoreLabel} variant={variant} />
              ) : null}
            </div>
            <div className="card3d-caption">
              <h3 className="line-clamp-2 font-[family-name:var(--font-dosis)] text-sm font-bold leading-tight text-[var(--cv-heading)] transition-colors duration-300 group-hover:text-[color-mix(in_srgb,var(--cv-heading)_80%,var(--cv-accent))]">
                {item.title}
              </h3>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-[var(--cv-muted)]">
                <span className="text-[var(--cv-star)]" aria-hidden>
                  ★
                </span>
                <span className="font-semibold text-[var(--cv-heading)]">
                  {item.rating}
                </span>
                <span>/10</span>
                {footerExtra}
              </p>
            </div>
          </Link>

          {/* Derinlikte yüzen katmanlar (poster alanıyla hizalı) */}
          <div className="card3d-poster-overlay">
            <div className="card3d-float card3d-badges" aria-hidden>
              <span className="card3d-chip">{yearLabel}</span>
              {rare ? (
                <span className="card3d-chip card3d-chip--rare">
                  ✦ {ui.rare}
                </span>
              ) : null}
            </div>
            <div className="card3d-float card3d-actions">
              <WatchlistButton item={item} />
              <button
                type="button"
                onClick={flip}
                aria-pressed={flipped}
                aria-label={ui.flip}
                title={ui.flip}
                className="card3d-flip-btn"
              >
                <FlipIcon />
              </button>
            </div>
          </div>
        </div>

        {/* ——— ARKA YÜZ ——— */}
        <div
          className="card3d-face card3d-back"
          inert={!flipped}
          aria-hidden={!flipped}
        >
          <div className="card3d-back-bg" aria-hidden>
            <Image
              src={item.poster}
              alt=""
              fill
              className="object-cover"
              sizes="220px"
            />
          </div>
          <div className="card3d-back-content">
            <div className="flex items-start justify-between gap-2">
              <p className="font-[family-name:var(--font-dosis)] text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--cv-accent)]">
                {yearLabel}
              </p>
              <span className="rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-[var(--cv-star)] ring-1 ring-white/10">
                ★ <span className="text-white">{item.rating}</span>
              </span>
            </div>
            <h3 className="mt-1 line-clamp-2 font-[family-name:var(--font-dosis)] text-base font-bold leading-tight text-white">
              {item.title}
            </h3>
            {item.genres?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.genres.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/90"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : null}
            <dl className="mt-3 space-y-1 text-[11px] leading-snug text-white/90">
              {backLines.map((l) => (
                <div key={l.label} className="flex gap-1">
                  <dt className="shrink-0 text-white/50">{l.label}:</dt>
                  <dd className="line-clamp-2">{l.value}</dd>
                </div>
              ))}
            </dl>
            {synopsis ? (
              <p className="mt-2 line-clamp-5 text-[11px] leading-relaxed text-white/75">
                {synopsis}
              </p>
            ) : null}
            <div className="mt-auto flex items-center gap-2 pt-3">
              <Link
                href={href}
                className="flex-1 rounded-md bg-[var(--cv-accent)] px-2 py-2 text-center font-[family-name:var(--font-dosis)] text-[11px] font-bold uppercase tracking-wide text-[var(--cv-on-amber)] transition hover:brightness-110"
              >
                {ui.details}
              </Link>
              <button
                type="button"
                onClick={flip}
                aria-label={ui.flipBack}
                title={ui.flipBack}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                <FlipIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function FlipIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
