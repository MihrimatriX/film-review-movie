/**
 * Metin + vektör işaret — Block Buster PNG yerine tema renkleriyle ölçeklenir.
 */
export function BrandLogo({
  variant = "header",
  className = "",
}: {
  variant?: "header" | "footer" | "compact" | "auth";
  className?: string;
}) {
  const iconClass =
    variant === "header"
      ? "h-10 w-10 shrink-0 md:h-12 md:w-12"
      : variant === "footer"
        ? "h-11 w-11 shrink-0"
        : variant === "auth"
          ? "h-14 w-14 shrink-0"
          : "h-9 w-9 shrink-0";

  const filmClass =
    variant === "header"
      ? "text-[0.65rem] md:text-xs"
      : variant === "footer"
        ? "text-xs"
        : variant === "auth"
          ? "text-sm"
          : "text-[0.65rem]";

  const reviewClass =
    variant === "header"
      ? "text-base md:text-lg"
      : variant === "footer"
        ? "text-lg"
        : variant === "auth"
          ? "text-xl"
          : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      data-brand-logo
    >
      <svg
        className={iconClass}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="48" height="48" rx="12" fill="var(--cv-red)" />
        <path
          d="M17 14v20l18-10-18-10Z"
          fill="var(--cv-deep)"
          stroke="color-mix(in srgb, var(--cv-accent) 55%, var(--cv-deep))"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle
          cx="11"
          cy="14"
          r="2"
          fill="color-mix(in srgb, var(--cv-deep) 35%, transparent)"
        />
        <circle
          cx="11"
          cy="24"
          r="2"
          fill="color-mix(in srgb, var(--cv-deep) 35%, transparent)"
        />
        <circle
          cx="11"
          cy="34"
          r="2"
          fill="color-mix(in srgb, var(--cv-deep) 35%, transparent)"
        />
        <circle
          cx="37"
          cy="14"
          r="2"
          fill="color-mix(in srgb, var(--cv-deep) 35%, transparent)"
        />
        <circle
          cx="37"
          cy="24"
          r="2"
          fill="color-mix(in srgb, var(--cv-deep) 35%, transparent)"
        />
        <circle
          cx="37"
          cy="34"
          r="2"
          fill="color-mix(in srgb, var(--cv-deep) 35%, transparent)"
        />
      </svg>
      <span className="min-w-0 leading-tight">
        <span
          className={`block font-[family-name:var(--font-dosis)] font-extrabold uppercase tracking-[0.18em] text-[var(--cv-accent)] ${filmClass}`}
        >
          Film
        </span>
        <span
          className={`block font-[family-name:var(--font-dosis)] font-bold uppercase tracking-wide text-[var(--cv-heading)] ${reviewClass}`}
        >
          Review
        </span>
      </span>
    </span>
  );
}
