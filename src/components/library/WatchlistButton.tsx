"use client";

import { toast } from "@/components/ui/Toaster";
import { useUi } from "@/components/ui/UiProvider";
import {
  isInWatchlist,
  toggleWatchlist,
  useLibrary,
  type LibraryItem,
} from "@/lib/user-library";
import { useState } from "react";

export function HeartIcon({
  filled,
  className = "",
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 20.5s-7.5-4.6-9.6-9.3C.9 7.9 3 4.5 6.5 4.5c2 0 3.6 1.1 4.5 2.6.9-1.5 2.5-2.6 4.5-2.6 3.5 0 5.6 3.4 4.1 6.7-2.1 4.7-9.6 9.3-9.6 9.3Z" />
    </svg>
  );
}

/**
 * İzleme listesi anahtarı. `icon`: kart üstü yuvarlak düğme, `full`: detay sayfası.
 */
export function WatchlistButton({
  item,
  variant = "icon",
  className = "",
}: {
  item: LibraryItem;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { ui } = useUi();
  const library = useLibrary();
  const active = isInWatchlist(library, item.kind, item.slug);
  const [burst, setBurst] = useState(0);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWatchlist(item);
    if (added) setBurst((b) => b + 1);
    toast(
      added ? ui.watchlistAdded : ui.watchlistRemoved,
      added ? "accent" : "red",
    );
  };

  const label = active ? ui.watchlistRemove : ui.watchlistAdd;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`group/wl inline-flex items-center gap-2 rounded-md border px-5 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase transition ${
          active
            ? "border-[var(--cv-red)] bg-[color-mix(in_srgb,var(--cv-red)_18%,transparent)] text-[var(--cv-heading)]"
            : "border-[var(--cv-border-strong)] text-[var(--cv-heading)] hover:border-[var(--cv-red)]"
        } ${className}`}
      >
        <HeartIcon
          key={burst}
          filled={active}
          className={`h-5 w-5 text-[var(--cv-red)] transition-transform duration-300 group-hover/wl:scale-110 ${burst ? "cv-heart-pop" : ""}`}
        />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`relative grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cv-accent)] ${
        active
          ? "border-[var(--cv-red)] bg-[var(--cv-red)] text-white shadow-[0_0_18px_-2px_var(--cv-red)]"
          : "border-white/25 bg-black/45 text-white hover:border-white/60"
      } ${className}`}
    >
      <HeartIcon
        key={burst}
        filled={active}
        className={`h-4 w-4 ${burst ? "cv-heart-pop" : ""}`}
      />
      {burst ? (
        <span key={`r${burst}`} className="cv-heart-ring" aria-hidden />
      ) : null}
    </button>
  );
}
