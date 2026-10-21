"use client";

import { HeartIcon } from "@/components/library/WatchlistButton";
import { useUi } from "@/components/ui/UiProvider";
import { useLibrary } from "@/lib/user-library";
import Link from "next/link";

/** Başlıkta izleme listesi kısayolu; liste sayısını rozet olarak gösterir. */
export function HeaderLibraryLink({ active }: { active: boolean }) {
  const { ui } = useUi();
  const { watchlist } = useLibrary();
  const count = watchlist.length;

  return (
    <Link
      href="/watchlist"
      aria-current={active ? "page" : undefined}
      aria-label={count ? `${ui.watchlist} (${count})` : ui.watchlist}
      title={ui.watchlist}
      className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${
        active
          ? "border-[var(--cv-red)] bg-[color-mix(in_srgb,var(--cv-red)_16%,transparent)] text-[var(--cv-red)]"
          : "border-[var(--cv-border-strong)] text-[var(--cv-red)] hover:border-[var(--cv-red)]"
      }`}
    >
      <HeartIcon filled={count > 0} className="h-[18px] w-[18px]" />
      {count > 0 ? (
        <span
          key={count}
          className="cv-heart-pop absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--cv-red)] px-1 text-[10px] font-bold tabular-nums text-white ring-2 ring-[var(--cv-deep)]"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
