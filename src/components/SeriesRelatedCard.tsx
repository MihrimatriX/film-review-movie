"use client";

import { useHoverLift } from "@/components/motion/useHoverLift";
import type { Series } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export function SeriesRelatedCard({ series }: { series: Series }) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  useHoverLift(rootRef, liftRef);

  return (
    <Link
      ref={rootRef}
      href={`/series/${series.slug}`}
      className="cv-card-hover group relative block h-40 w-28 shrink-0 overflow-hidden rounded-lg border border-[var(--cv-border)] outline-none transition hover:border-[var(--cv-accent)]/50"
    >
      <div
        ref={liftRef}
        className="relative h-full w-full will-change-transform"
      >
        <Image
          src={series.poster}
          alt={series.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="112px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 opacity-0 transition duration-300 group-hover:opacity-100">
          <p className="line-clamp-3 text-[10px] font-bold leading-tight text-white">
            {series.title}
          </p>
          <p className="mt-1 text-[9px] text-[var(--cv-accent)]">
            ★ {series.rating}
            <span className="text-white/70"> · {series.yearLabel}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
