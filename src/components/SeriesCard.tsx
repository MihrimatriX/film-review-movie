"use client";

import {
  PosterCard3D,
  type PosterCardBackLine,
} from "@/components/cards/PosterCard3D";
import type { Series } from "@/lib/types";

export type SeriesCardHoverLabels = {
  director: string;
  runtime: string;
  synopsis: string;
  stars?: string;
  cast?: string;
};

type Props = {
  series: Series;
  priority?: boolean;
  readMoreLabel?: string;
  labels?: SeriesCardHoverLabels;
  reviewWord?: string;
};

/** Dizi posteri — film kartıyla aynı 3D davranış, yeşil vurgu. */
export function SeriesCard({
  series,
  priority,
  readMoreLabel = "Read more",
  labels,
  reviewWord,
}: Props) {
  const castPreview = series.cast
    ?.slice(0, 3)
    .map((c) => c.name)
    .join(", ");

  const backLines: PosterCardBackLine[] = [];
  if (labels && series.director)
    backLines.push({ label: labels.director, value: series.director });
  if (labels?.stars && series.starsLine)
    backLines.push({ label: labels.stars, value: series.starsLine });
  else if (labels?.cast && castPreview)
    backLines.push({ label: labels.cast, value: castPreview });
  if (labels && series.runtime)
    backLines.push({ label: labels.runtime, value: series.runtime });

  return (
    <PosterCard3D
      href={`/series/${series.slug}`}
      item={{
        kind: "series",
        slug: series.slug,
        title: series.title,
        poster: series.poster,
        year: series.yearLabel,
        rating: series.rating,
        genres: series.genres,
      }}
      yearLabel={series.yearLabel}
      priority={priority}
      readMoreLabel={readMoreLabel}
      variant="series"
      backLines={backLines}
      synopsis={series.synopsis}
      footerExtra={
        reviewWord != null && series.reviewCount > 0 ? (
          <span className="text-[var(--cv-faint)]">
            · {series.reviewCount} {reviewWord}
          </span>
        ) : null
      }
    />
  );
}
