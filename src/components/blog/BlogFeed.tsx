"use client";

import { StaggerOnView } from "@/components/motion/StaggerOnView";
import type { BlogPost } from "@/lib/types";
import {
  estimateReadingMinutes,
  formatBlogDate,
  formatPostsSummary,
  formatReadingTime,
} from "@/lib/blog-utils";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type BlogFeedLabels = {
  searchPlaceholder: string;
  postsSummary: string;
  noMatches: string;
  viewGrid: string;
  viewList: string;
  readMore: string;
  author: string;
  tags: string;
};

type Props = {
  posts: BlogPost[];
  locale: Locale;
  labels: BlogFeedLabels;
  variant: "grid" | "list";
  gridHref: string;
  listHref: string;
};

function matchesQuery(post: BlogPost, q: string): boolean {
  if (!q.trim()) return true;
  const n = q.trim().toLowerCase();
  const hay = [post.title, post.excerpt, post.author, ...(post.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

export function BlogFeed({
  posts,
  locale,
  labels,
  variant,
  gridHref,
  listHref,
}: Props) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => posts.filter((p) => matchesQuery(p, q)),
    [posts, q],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--cv-muted)]">
          <span className="font-semibold text-[var(--cv-accent)]">
            {formatPostsSummary(
              labels.postsSummary,
              filtered.length,
              posts.length,
            )}
          </span>
        </p>
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:max-w-md sm:flex-row sm:items-center sm:justify-end">
          <label className="sr-only" htmlFor="blog-search">
            {labels.searchPlaceholder}
          </label>
          <input
            id="blog-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.searchPlaceholder}
            autoComplete="off"
            className="w-full min-w-0 rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)] placeholder:text-[var(--cv-faint)] focus:border-[var(--cv-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--cv-accent)]/40"
          />
          <div className="flex shrink-0 rounded-md border border-[var(--cv-border-strong)]">
            <Link
              href={gridHref}
              className={`px-3 py-2 text-sm font-semibold ${
                variant === "grid"
                  ? "bg-[var(--cv-red)] text-[var(--cv-on-red)]"
                  : "text-[var(--cv-muted)] hover:bg-[var(--cv-deep)] hover:text-[var(--cv-heading)]"
              }`}
              aria-current={variant === "grid" ? "page" : undefined}
            >
              {labels.viewGrid}
            </Link>
            <Link
              href={listHref}
              className={`px-3 py-2 text-sm font-semibold ${
                variant === "list"
                  ? "bg-[var(--cv-red)] text-[var(--cv-on-red)]"
                  : "text-[var(--cv-muted)] hover:bg-[var(--cv-deep)] hover:text-[var(--cv-heading)]"
              }`}
              aria-current={variant === "list" ? "page" : undefined}
            >
              {labels.viewList}
            </Link>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[var(--cv-border-strong)] bg-[var(--cv-mid)] px-4 py-8 text-center text-sm text-[var(--cv-muted)]">
          {labels.noMatches}
        </p>
      ) : variant === "grid" ? (
        <StaggerOnView
          key={filtered.map((p) => p.slug).join("|")}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          itemSelector=".cv-blog-card"
        >
          {filtered.map((p, i) => (
            <article
              key={p.id}
              className="cv-blog-card cv-stagger-item group relative overflow-hidden rounded-xl bg-[var(--cv-card)] shadow-[inset_0_0_0_1px_var(--cv-border)] transition-shadow duration-500 hover:shadow-[0_22px_48px_-18px_rgba(0,0,0,0.55),inset_0_0_0_1px_color-mix(in_srgb,var(--cv-accent)_28%,var(--cv-border))]"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[3px] bg-gradient-to-r from-[var(--cv-red)] via-[var(--cv-accent)] to-transparent opacity-90"
                aria-hidden
              />
              <Link href={`/blog/${p.slug}`} className="block outline-none">
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--cv-deep)]">
                  <Image
                    src={p.cover}
                    alt=""
                    fill
                    className="object-cover transition duration-500 ease-out group-hover:scale-[1.045]"
                    sizes="(max-width:768px) 100vw, 33vw"
                    priority={i < 6}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--cv-deep)] via-[var(--cv-deep)]/20 to-transparent opacity-90"
                    aria-hidden
                  />
                  <div className="absolute left-3 right-3 top-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/95 ring-1 ring-white/10 backdrop-blur-sm">
                      {formatBlogDate(p.date, locale)}
                    </span>
                    <span className="rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--cv-star)] ring-1 ring-white/10 backdrop-blur-sm">
                      {formatReadingTime(estimateReadingMinutes(p), locale)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-[var(--cv-border)] bg-gradient-to-b from-[var(--cv-card)] to-[color-mix(in_srgb,var(--cv-card)_88%,var(--cv-deep))] p-4 transition-colors duration-500 group-hover:border-[color-mix(in_srgb,var(--cv-accent)_35%,var(--cv-border))]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--cv-muted)]">
                    <span className="text-[var(--cv-accent)]">{labels.author}</span>
                    <span className="mx-1.5 text-[var(--cv-faint)]">·</span>
                    <span className="text-[var(--cv-body)]">{p.author}</span>
                  </p>
                  <h2 className="mt-2.5 font-[family-name:var(--font-dosis)] text-lg font-bold leading-snug text-[var(--cv-heading)] transition-colors duration-300 group-hover:text-[color-mix(in_srgb,var(--cv-heading)_82%,var(--cv-accent))]">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--cv-muted)]">
                    {p.excerpt}
                  </p>
                  <div className="mt-4 flex flex-col gap-3 border-t border-[var(--cv-border)] pt-3 sm:flex-row sm:items-end sm:justify-between">
                    {p.tags?.length ? (
                      <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                        <span className="sr-only">{labels.tags}</span>
                        {p.tags.slice(0, 4).map((tag, ti) => (
                          <span
                            key={tag}
                            className={`inline-block max-w-full truncate rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--cv-body)] ${
                              ti % 3 === 0
                                ? "border-[color-mix(in_srgb,var(--cv-accent)_40%,var(--cv-border))] bg-[color-mix(in_srgb,var(--cv-accent)_10%,var(--cv-deep))]"
                                : ti % 3 === 1
                                  ? "border-sky-500/35 bg-sky-500/10 text-[var(--cv-heading)]"
                                  : "border-violet-500/35 bg-violet-500/10 text-[var(--cv-heading)]"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="flex-1" />
                    )}
                    <span className="shrink-0 font-[family-name:var(--font-dosis)] text-xs font-bold uppercase tracking-wide text-[var(--cv-red)] transition group-hover:underline">
                      {labels.readMore}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </StaggerOnView>
      ) : (
        <StaggerOnView
          key={filtered.map((p) => p.slug).join("|")}
          className="space-y-0"
          itemSelector=".cv-blog-row"
        >
          {filtered.map((p) => (
            <article
              key={p.id}
              className="cv-blog-row cv-stagger-item group flex flex-col gap-6 border-b border-[var(--cv-border)] py-10 last:border-0 md:flex-row md:gap-8"
            >
              <Link
                href={`/blog/${p.slug}`}
                className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-[var(--cv-deep)] shadow-[inset_0_0_0_1px_var(--cv-border-strong)] ring-1 ring-black/5 transition duration-500 md:w-80 md:max-w-[20rem]"
              >
                <Image
                  src={p.cover}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="320px"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--cv-deep)]/95 to-transparent p-3 pt-12">
                  <span className="inline-block rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--cv-star)] backdrop-blur-sm">
                    {formatReadingTime(estimateReadingMinutes(p), locale)}
                  </span>
                </div>
              </Link>
              <div className="min-w-0 flex-1 md:pt-0.5">
                <div
                  className="mb-3 hidden h-[3px] w-14 rounded-full bg-gradient-to-r from-[var(--cv-red)] to-[var(--cv-accent)] md:block"
                  aria-hidden
                />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--cv-muted)]">
                  <span className="text-[var(--cv-body)]">
                    {formatBlogDate(p.date, locale)}
                  </span>
                  <span className="mx-2 text-[var(--cv-faint)]">·</span>
                  <span className="text-[var(--cv-accent)]">{labels.author}</span>
                  <span className="mx-1 text-[var(--cv-faint)]">:</span>
                  <span className="text-[var(--cv-heading)]">{p.author}</span>
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-dosis)] text-2xl font-bold leading-tight text-[var(--cv-heading)] md:text-[1.65rem]">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="transition hover:text-[var(--cv-accent)]"
                  >
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--cv-muted)] md:text-base">
                  {p.excerpt}
                </p>
                {p.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="sr-only">{labels.tags}</span>
                    {p.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          ti % 3 === 0
                            ? "border-[color-mix(in_srgb,var(--cv-accent)_40%,var(--cv-border))] bg-[color-mix(in_srgb,var(--cv-accent)_8%,var(--cv-card))] text-[var(--cv-body)]"
                            : ti % 3 === 1
                              ? "border-sky-500/35 bg-sky-500/10 text-[var(--cv-heading)]"
                              : "border-violet-500/35 bg-violet-500/10 text-[var(--cv-heading)]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-5 inline-flex items-center gap-1 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-red)] transition hover:gap-2 hover:underline"
                >
                  {labels.readMore}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </StaggerOnView>
      )}
    </div>
  );
}
