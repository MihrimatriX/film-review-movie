"use client";

import { WatchlistButton } from "@/components/library/WatchlistButton";
import { useUi } from "@/components/ui/UiProvider";
import type { SurprisePick } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Phase = "idle" | "loading" | "spinning" | "done" | "error";

export function DiceIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

/**
 * Başlıktaki zar düğmesi + modal: 3D kart yavaşlayarak döner, her kenardan geçişte
 * poster değişir ve rastgele bir filmde durur.
 */
export function SurpriseMe() {
  const { ui } = useUi();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/dice grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--cv-border-strong)] text-[var(--cv-accent)] transition hover:border-[var(--cv-accent)] hover:bg-[color-mix(in_srgb,var(--cv-accent)_12%,transparent)]"
        aria-label={ui.surprise}
        title={ui.surprise}
        aria-haspopup="dialog"
      >
        <DiceIcon className="h-5 w-5 transition-transform duration-500 group-hover/dice:rotate-[200deg]" />
      </button>
      {open
        ? createPortal(
            <SurpriseDialog onClose={() => setOpen(false)} />,
            document.body,
          )
        : null}
    </>
  );
}

function SurpriseDialog({ onClose }: { onClose: () => void }) {
  const { ui } = useUi();
  const [phase, setPhase] = useState<Phase>("idle");
  const [picks, setPicks] = useState<SurprisePick[]>([]);
  const [front, setFront] = useState(0);
  const [back, setBack] = useState(1);
  const [final, setFinal] = useState<SurprisePick | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const angleRef = useRef(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const spin = useCallback(async () => {
    cancelAnimationFrame(raf.current);
    setFinal(null);
    setPhase("loading");
    let list: SurprisePick[];
    try {
      const res = await fetch("/api/surprise", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      list = ((await res.json()) as { picks: SurprisePick[] }).picks;
      if (!list.length) throw new Error("empty");
    } catch {
      setPhase("error");
      return;
    }
    setPicks(list);

    const card = cardRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!card || reduced || list.length < 2) {
      const pick = list[0];
      angleRef.current = 0;
      if (card) {
        card.style.transition = "none";
        card.style.transform = "rotateY(0deg)";
      }
      setFront(0);
      setFinal(pick);
      setPhase("done");
      return;
    }

    setPhase("spinning");
    // Zaman tabanlı yavaşlama: kare hızından bağımsız ~2.6 sn; toplam açı 180°’nin
    // katı olduğu için kart her zaman tam yüz yüze durur. Kart her 180°’de bir
    // kenardan geçer; o an görünmeyen yüze sıradaki poster konur.
    const from = angleRef.current;
    const total = 180 * (8 + Math.floor(Math.random() * 4));
    const duration = 2600;
    const start = performance.now();
    let face = Math.floor((from + 90) / 180);
    let idx = 0;
    let frontIdx = 0;
    let backIdx = 0;
    if (face % 2 === 0) setFront(0);
    else setBack(0);
    card.style.transition = "none";

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      const angle = from + total * eased;
      const f = Math.floor((angle + 90) / 180);
      if (f !== face) {
        face = f;
        idx = (idx + 1) % list.length;
        // Yeni görünür olan yüz: çift → ön, tek → arka
        if (face % 2 === 0) {
          frontIdx = idx;
          setFront(idx);
        } else {
          backIdx = idx;
          setBack(idx);
        }
      }
      card.style.transform = `rotateY(${angle}deg)`;

      if (t < 1) {
        raf.current = requestAnimationFrame(step);
        return;
      }
      angleRef.current = from + total;
      setFinal(list[face % 2 === 0 ? frontIdx : backIdx]);
      setPhase("done");
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    // Modal açılır açılmaz ilk çevirmeyi başlat.
    void spin();
    return () => cancelAnimationFrame(raf.current);
  }, [spin]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const frontPick = picks[front];
  const backPick = picks[back];
  const busy = phase === "loading" || phase === "spinning";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="surprise-title"
    >
      <button
        type="button"
        className="surprise-backdrop absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label={ui.close}
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="surprise-panel relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--cv-border-strong)] bg-[var(--cv-mid)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        {final ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
          >
            <Image
              key={final.slug}
              src={final.poster}
              alt=""
              fill
              className="surprise-ambient object-cover blur-3xl saturate-150"
              sizes="300px"
            />
          </div>
        ) : null}
        <div className="relative grid gap-6 p-6 md:grid-cols-[240px_1fr] md:p-8">
          <div
            className="flex justify-center"
            style={{ perspective: "1200px" }}
          >
            <div
              ref={cardRef}
              className="relative aspect-[2/3] w-[200px] md:w-[240px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <SpinFace pick={frontPick} />
              <SpinFace pick={backPick} back />
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-4">
              <p
                id="surprise-title"
                className="font-[family-name:var(--font-dosis)] text-xs font-bold uppercase tracking-[0.25em] text-[var(--cv-accent)]"
              >
                🎲 {ui.surpriseTitle}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--cv-border-strong)] text-[var(--cv-muted)] transition hover:rotate-90 hover:border-[var(--cv-red)] hover:text-[var(--cv-heading)]"
                aria-label={ui.close}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 min-h-[12rem] flex-1" aria-live="polite">
              {phase === "error" ? (
                <p className="text-[var(--cv-muted)]">{ui.surpriseError}</p>
              ) : final ? (
                <div className="surprise-reveal">
                  <h2 className="font-[family-name:var(--font-dosis)] text-3xl font-bold leading-tight text-[var(--cv-heading)] md:text-4xl">
                    {final.title}
                  </h2>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--cv-muted)]">
                    <span className="text-lg text-[var(--cv-star)]">★</span>
                    <span className="text-lg font-bold text-[var(--cv-heading)]">
                      {final.rating}
                    </span>
                    <span>/10 · {final.year}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {final.genres.map((g) => (
                      <span
                        key={g}
                        className="rounded-full border border-[var(--cv-border-strong)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--cv-accent)]"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-[var(--cv-body)]">
                    {final.synopsis}
                  </p>
                </div>
              ) : (
                <div className="space-y-3" aria-hidden>
                  <p className="font-[family-name:var(--font-dosis)] text-2xl font-bold text-[var(--cv-heading)]">
                    {ui.surpriseSpinning}
                  </p>
                  <div className="cv-skeleton-shimmer h-3 w-3/4 rounded" />
                  <div className="cv-skeleton-shimmer h-3 w-2/3 rounded" />
                  <div className="cv-skeleton-shimmer h-3 w-1/2 rounded" />
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {final ? (
                <>
                  <Link
                    href={`/movies/${final.slug}`}
                    onClick={onClose}
                    className="rounded-md bg-[var(--cv-red)] px-6 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-on-red)] transition hover:brightness-110"
                  >
                    {ui.surpriseGo}
                  </Link>
                  <WatchlistButton
                    item={{
                      kind: "movie",
                      slug: final.slug,
                      title: final.title,
                      poster: final.poster,
                      year: String(final.year),
                      rating: final.rating,
                      genres: final.genres,
                    }}
                  />
                </>
              ) : null}
              <button
                type="button"
                onClick={() => void spin()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md border border-[var(--cv-accent)] px-5 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-accent)] transition hover:bg-[color-mix(in_srgb,var(--cv-accent)_12%,transparent)] disabled:opacity-50"
              >
                <DiceIcon className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
                {busy ? ui.surpriseSpinning : ui.surpriseSpin}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpinFace({ pick, back }: { pick?: SurprisePick; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-xl bg-[var(--cv-card)] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
      }}
    >
      {pick ? (
        <Image
          src={pick.poster}
          alt={pick.title}
          fill
          className="object-cover"
          sizes="240px"
        />
      ) : (
        <div className="cv-skeleton-shimmer absolute inset-0" />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.25)_48%,transparent_62%)]"
        aria-hidden
      />
    </div>
  );
}
