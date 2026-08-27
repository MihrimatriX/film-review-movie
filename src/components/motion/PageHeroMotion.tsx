"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";

import type { PageHeroCrumb } from "@/components/page-hero-types";

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  );
}

function CrumbSeparator() {
  return (
    <span
      className="mx-0.5 inline-flex shrink-0 text-[var(--cv-accent)]/70"
      aria-hidden
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
      </svg>
    </span>
  );
}

const linkChip =
  "inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-full border border-[var(--cv-border-strong)] bg-[var(--cv-card)] px-3 py-1.5 text-sm font-medium text-[var(--cv-heading)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--cv-heading)_06%,transparent)] transition duration-200 hover:border-[color-mix(in_srgb,var(--cv-accent)_45%,var(--cv-border-strong))] hover:bg-[color-mix(in_srgb,var(--cv-accent)_10%,var(--cv-card))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cv-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cv-mid)]";

const currentChip =
  "inline-flex min-h-9 items-center rounded-full border border-[color-mix(in_srgb,var(--cv-accent)_50%,var(--cv-border-strong))] bg-[color-mix(in_srgb,var(--cv-accent)_14%,var(--cv-card))] px-3 py-1.5 text-sm font-semibold text-[var(--cv-heading)] shadow-[0_0_24px_-12px_color-mix(in_srgb,var(--cv-accent)_70%,transparent)]";

export function PageHeroMotion({
  title,
  crumbs,
}: {
  title: string;
  crumbs: PageHeroCrumb[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const crumbsRef = useRef<HTMLOListElement>(null);
  const trailKey = crumbs.map((c) => `${c.label}:${c.href ?? ""}`).join("|");

  useGSAP(
    () => {
      const titleEl = titleRef.current;
      const list = crumbsRef.current;
      if (!titleEl || !list) return;

      gsap.from(titleEl, {
        opacity: 0,
        y: 28,
        scale: 0.94,
        duration: 0.78,
        ease: "back.out(1.28)",
        delay: 0.05,
      });

      const items = list.querySelectorAll(".cv-crumb-item");
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 14,
          scale: 0.92,
          duration: 0.5,
          stagger: {
            each: 0.09,
            from: "start",
          },
          ease: "back.out(1.22)",
          delay: 0.22,
        });
      }
    },
    { scope: rootRef, dependencies: [trailKey, title] },
  );

  return (
    <div ref={rootRef} className="relative mx-auto max-w-6xl px-4 md:px-6">
      <h1
        ref={titleRef}
        className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase tracking-wide text-[var(--cv-heading)] md:text-3xl"
      >
        {title}
      </h1>
      <nav className="mt-3 md:mt-3.5" aria-label="Breadcrumb">
        <ol
          ref={crumbsRef}
          className="flex flex-wrap items-center gap-y-2 text-sm"
        >
          {crumbs.map((cr, i) => {
            const isFirst = i === 0;
            const showHome = isFirst && cr.href === "/";
            const isCurrent = !cr.href;

            return (
              <li
                key={`${cr.label}-${i}`}
                className="cv-crumb-item flex items-center"
              >
                {i > 0 ? <CrumbSeparator /> : null}
                {cr.href ? (
                  <Link href={cr.href} className={linkChip}>
                    {showHome ? (
                      <>
                        <HomeIcon className="opacity-90" />
                        <span className="max-w-[200px] truncate sm:max-w-none">
                          {cr.label}
                        </span>
                      </>
                    ) : (
                      <span className="max-w-[220px] truncate sm:max-w-none">
                        {cr.label}
                      </span>
                    )}
                  </Link>
                ) : (
                  <span
                    className={currentChip}
                    aria-current="page"
                    title={cr.label}
                  >
                    <span className="max-w-[min(100vw-8rem,28rem)] truncate">
                      {cr.label}
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
