"use client";

import { CelebrityPortraitImage } from "@/components/CelebrityPortraitImage";
import { useHoverLift } from "@/components/motion/useHoverLift";
import { pickCelebrityImageSrc } from "@/lib/celebrity-image";
import type { Celebrity } from "@/lib/types";
import Link from "next/link";
import { useRef } from "react";

type Labels = {
  country: string;
  synopsis: string;
  openDetail: string;
  synopsisFallback: string;
};

export function CelebrityGridCard({
  celebrity,
  variant,
  labels,
}: {
  celebrity: Celebrity;
  variant: "compact" | "featured";
  labels: Labels;
}) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  useHoverLift(rootRef, liftRef);

  const img = pickCelebrityImageSrc(
    celebrity,
    variant === "featured" ? "gridFeatured" : "gridCompact",
  );
  const aspect = variant === "featured" ? "aspect-[4/5]" : "aspect-[250/300]";
  const sizes =
    variant === "featured" ? "(max-width:1024px) 100vw, 33vw" : "250px";
  const titleClass =
    variant === "featured"
      ? "font-[family-name:var(--font-dosis)] text-xl font-bold text-[var(--cv-heading)] transition group-hover:text-[var(--cv-accent)]"
      : "font-[family-name:var(--font-dosis)] text-sm font-bold text-[var(--cv-heading)] transition group-hover:text-[var(--cv-accent)]";
  const pad = variant === "featured" ? "p-4" : "p-3";
  const roleClass =
    variant === "featured"
      ? "text-sm text-[var(--cv-muted)]"
      : "text-xs text-[var(--cv-muted)]";

  return (
    <Link
      ref={rootRef}
      href={`/celebrities/${celebrity.slug}`}
      className="cv-card-hover group block overflow-hidden rounded-md border border-[var(--cv-border)] bg-[var(--cv-card)] text-center outline-none transition hover:border-[var(--cv-accent)]/40"
    >
      <div ref={liftRef} className="will-change-transform">
        <div
          className={`relative mx-auto w-full overflow-hidden ${variant === "compact" ? "max-w-[250px]" : ""}`}
        >
          <div className={`relative ${aspect} w-full`}>
            <CelebrityPortraitImage
              initialSrc={img}
              alt={celebrity.name}
              fill
              sizes={sizes}
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-1.5 p-3 text-left opacity-0 transition duration-300 group-hover:opacity-100">
              {celebrity.country ? (
                <p className="text-[11px] text-white/80">
                  <span className="text-white/50">{labels.country}: </span>
                  {celebrity.country}
                </p>
              ) : null}
              <p className="text-[11px] text-white/90">
                <span className="text-white/50">{labels.synopsis}: </span>
                <span className="line-clamp-4">
                  {celebrity.bio?.trim()
                    ? celebrity.bio
                    : celebrity.role || labels.synopsisFallback}
                </span>
              </p>
              <p className="font-[family-name:var(--font-dosis)] text-xs font-bold uppercase text-[var(--cv-accent)]">
                {labels.openDetail}
              </p>
            </div>
          </div>
        </div>
        <div className={pad}>
          <p className={titleClass}>{celebrity.name}</p>
          <p className={roleClass}>
            {celebrity.role}
            {celebrity.country && variant === "featured"
              ? `, ${celebrity.country.toLowerCase()}`
              : ""}
          </p>
        </div>
      </div>
    </Link>
  );
}
