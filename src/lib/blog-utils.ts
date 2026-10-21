import type { BlogPost } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** ~200 wpm for online reading */
export function estimateReadingMinutes(post: BlogPost): number {
  const text = [post.excerpt, post.body ?? ""].join(" ");
  const words = wordCount(text);
  return Math.max(1, Math.round(words / 200));
}

export function formatBlogDate(iso: string, locale: Locale): string {
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatReadingTime(minutes: number, locale: Locale): string {
  return locale === "tr" ? `${minutes} dk okuma` : `${minutes} min read`;
}

export function sortPostsByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getAdjacentPosts(
  sortedDesc: BlogPost[],
  slug: string,
): { older: BlogPost | null; newer: BlogPost | null } {
  const i = sortedDesc.findIndex((p) => p.slug === slug);
  if (i === -1) return { older: null, newer: null };
  return {
    older: sortedDesc[i + 1] ?? null,
    newer: sortedDesc[i - 1] ?? null,
  };
}

export function relatedPosts(
  sortedDesc: BlogPost[],
  slug: string,
  limit = 3,
): BlogPost[] {
  return sortedDesc.filter((p) => p.slug !== slug).slice(0, limit);
}

export function formatPostsSummary(
  template: string,
  visible: number,
  total: number,
): string {
  return template
    .replace("{visible}", String(visible))
    .replace("{total}", String(total));
}
