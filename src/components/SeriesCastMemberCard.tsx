"use client";

import { useHoverLift } from "@/components/motion/useHoverLift";
import type { SeriesCast } from "@/lib/types";
import Image from "next/image";
import { useRef } from "react";

export function SeriesCastMemberCard({
  member,
  labels,
}: {
  member: SeriesCast;
  labels: { role: string };
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  useHoverLift(rootRef, liftRef);

  return (
    <div
      ref={rootRef}
      className="cv-card-hover group relative overflow-hidden rounded-xl border border-[var(--cv-border)] bg-[var(--cv-card)]"
    >
      <div
        ref={liftRef}
        className="relative flex items-center gap-4 p-4 will-change-transform"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--cv-deep)] ring-2 ring-[var(--cv-border)] transition group-hover:ring-[var(--cv-accent)]/50">
          <Image
            src={member.image}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-110"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-[family-name:var(--font-dosis)] font-bold text-[var(--cv-accent)]">
            {member.name}
          </p>
          <p className="line-clamp-2 text-sm text-[var(--cv-muted)]">
            {member.role}
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
          <p className="text-xs uppercase tracking-wide text-white/60">
            {labels.role}
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-white">
            {member.role}
          </p>
        </div>
      </div>
    </div>
  );
}
