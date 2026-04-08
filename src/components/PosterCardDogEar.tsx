/**
 * Decorative “page corner” peel on poster hover; card link handles navigation.
 */
export function PosterCardDogEar({
  label,
  variant = "film",
}: {
  label: string;
  variant?: "film" | "series";
}) {
  return (
    <div className="movie-card-dog-ear" aria-hidden>
      <div className="movie-card-dog-ear-under" />
      <div
        className={
          variant === "series"
            ? "movie-card-dog-ear-flap movie-card-dog-ear-flap--series"
            : "movie-card-dog-ear-flap"
        }
      >
        <span className="movie-card-dog-ear-label">{label}</span>
      </div>
    </div>
  );
}
