import type { Movie } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export function MovieListRow({ movie }: { movie: Movie }) {
  return (
    <article className="flex flex-col gap-4 border-b border-[var(--cv-border)] py-8 sm:flex-row">
      <Link
        href={`/movies/${movie.slug}`}
        className="relative mx-auto h-56 w-40 shrink-0 overflow-hidden rounded-md sm:mx-0"
      >
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="160px"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <h6 className="font-[family-name:var(--font-dosis)] text-xl font-bold text-[var(--cv-heading)]">
          <Link
            href={`/movies/${movie.slug}`}
            className="hover:text-[var(--cv-accent)]"
          >
            {movie.title}{" "}
            <span className="text-[var(--cv-muted)]">({movie.year})</span>
          </Link>
        </h6>
        <p className="mt-2 text-[var(--cv-accent)]">
          ★ <span className="text-[var(--cv-heading)]">{movie.rating}</span>
          <span className="text-[var(--cv-muted)]"> /10</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--cv-muted)] line-clamp-4 md:line-clamp-3">
          {movie.synopsis}
        </p>
        <p className="mt-3 text-xs text-[var(--cv-faint)]">
          Run Time: {movie.runtime ?? "—"}
          {movie.mpaa ? ` · MMPA: ${movie.mpaa}` : ""}
          {movie.releaseLabel ? ` · Release: ${movie.releaseLabel}` : ""}
        </p>
        {movie.director && (
          <p className="mt-1 text-sm text-[var(--cv-muted)]">
            Director:{" "}
            <span className="text-[var(--cv-accent)]">{movie.director}</span>
          </p>
        )}
        {movie.stars && (
          <p className="mt-1 text-sm text-[var(--cv-muted)]">
            Stars:{" "}
            <span className="text-[var(--cv-heading)]">{movie.stars}</span>
          </p>
        )}
      </div>
    </article>
  );
}
