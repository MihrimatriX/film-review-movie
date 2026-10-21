"use client";

import {
  PosterCard3D,
  type PosterCardBackLine,
} from "@/components/cards/PosterCard3D";
import type { Movie } from "@/lib/types";

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

/** Film posteri — 3D eğim, holografik folyo (yüksek puan) ve çevrilebilir arka yüz. */
export function MovieCard({
  movie,
  priority,
  readMoreLabel = "Read more",
  labels,
}: Props) {
  const backLines: PosterCardBackLine[] = [];
  if (labels && movie.director)
    backLines.push({ label: labels.director, value: movie.director });
  if (labels && movie.runtime)
    backLines.push({ label: labels.runtime, value: movie.runtime });

  return (
    <PosterCard3D
      href={`/movies/${movie.slug}`}
      item={{
        kind: "movie",
        slug: movie.slug,
        title: movie.title,
        poster: movie.poster,
        year: String(movie.year),
        rating: movie.rating,
        genres: movie.genres,
      }}
      yearLabel={String(movie.year)}
      priority={priority}
      readMoreLabel={readMoreLabel}
      variant="film"
      backLines={backLines}
      synopsis={movie.synopsis}
    />
  );
}
