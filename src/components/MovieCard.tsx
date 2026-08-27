"use client";

import { PosterCardDogEar } from "@/components/PosterCardDogEar";
import { useMovieCardHover } from "@/components/motion/useMovieCardHover";
import type { Movie } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export type MovieCardHoverLabels = {
  director: string;
  runtime: string;
  synopsis: string;
};

type Props = {
  movie: Movie;
  priority?: boolean;
  readMoreLabel?: string;
  labels?: MovieCardHoverLabels;
};

export function MovieCard({
  movie,
  priority,
  readMoreLabel = "Read more",
  labels,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  const posterInnerRef = useRef<HTMLDivElement>(null);
  useMovieCardHover(rootRef, liftRef, posterInnerRef);

  const genreLine = movie.genres.slice(0, 3).join(" · ");

  return (
    <article
      ref={rootRef}
      className="cv-card-hover movie-card-shell group relative overflow-hidden rounded-xl bg-[var(--cv-card)] shadow-[inset_0_0_0_1px_var(--cv-border)] transition-shadow duration-500 hover:shadow-[0_22px_48px_-18px_rgba(0,0,0,0.55),inset_0_0_0_1px_color-mix(in_srgb,var(--cv-accent)_28%,var(--cv-border))]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[3px] bg-gradient-to-r from-[var(--cv-red)] via-[var(--cv-accent)] to-transparent opacity-90"
        aria-hidden
      />
      <div
        ref={liftRef}
        className="will-change-transform transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Link href={`/movies/${movie.slug}`} className="block outline-none">
          <div className="relative aspect-[185/284] overflow-hidden bg-[var(--cv-deep)]">
            <div
              ref={posterInnerRef}
              className="absolute inset-0 origin-center will-change-transform"
            >
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 200px"
                priority={priority}
              />
            </div>

            <div className="movie-card-gleam z-[5]" aria-hidden />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-[8] flex justify-between gap-2 p-2.5">
              <span className="rounded-md bg-black/55 px-2 py-0.5 font-[family-name:var(--font-dosis)] text-[10px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-sm ring-1 ring-white/10">
                {movie.year}
              </span>
              <span className="flex items-center gap-0.5 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-bold tabular-nums text-[var(--cv-star)] backdrop-blur-sm ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105">
                ★<span className="text-white">{movie.rating}</span>
              </span>
            </div>

            <PosterCardDogEar label={readMoreLabel} variant="film" />

            {labels ? (
              <div className="pointer-events-none absolute inset-0 z-[9] translate-y-3 bg-gradient-to-t from-black/[0.94] via-black/50 to-transparent opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-3 text-left text-[11px] leading-snug text-white/95 transition delay-75 duration-500 group-hover:delay-100">
                  <p className="font-[family-name:var(--font-dosis)] font-bold text-[var(--cv-accent)]">
                    {movie.year}
                    {genreLine ? ` · ${genreLine}` : ""}
                  </p>
                  {movie.director ? (
                    <p className="translate-y-1 opacity-0 transition delay-100 duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="text-white/50">{labels.director}: </span>
                      {movie.director}
                    </p>
                  ) : null}
                  {movie.runtime ? (
                    <p className="translate-y-1 opacity-0 transition delay-150 duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="text-white/50">{labels.runtime}: </span>
                      {movie.runtime}
                    </p>
                  ) : null}
                  <p className="translate-y-1 opacity-0 transition delay-200 duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-white/50">{labels.synopsis}: </span>
                    <span className="line-clamp-3 text-white/90">
                      {movie.synopsis}
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative border-t border-[var(--cv-border)] bg-gradient-to-b from-[var(--cv-card)] to-[color-mix(in_srgb,var(--cv-card)_88%,var(--cv-deep))] px-3 py-3 transition-colors duration-500 group-hover:border-[color-mix(in_srgb,var(--cv-accent)_35%,var(--cv-border))]">
            <h3 className="line-clamp-2 font-[family-name:var(--font-dosis)] text-sm font-bold leading-tight text-[var(--cv-heading)] transition-colors duration-300 group-hover:text-[color-mix(in_srgb,var(--cv-heading)_92%,var(--cv-accent))]">
              {movie.title}
            </h3>
            <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--cv-muted)] transition duration-500 group-hover:text-[var(--cv-body)]">
              <span
                className="text-[var(--cv-star)] transition-transform duration-500 group-hover:rotate-12"
                aria-hidden
              >
                ★
              </span>
              <span className="font-semibold text-[var(--cv-heading)]">
                {movie.rating}
              </span>
              <span>/10</span>
            </p>
          </div>
        </Link>
      </div>
    </article>
  );
}
