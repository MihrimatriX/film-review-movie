import type { Metadata } from "next";

const MAX_DESC = 165;

export function truncateMetaDescription(text: string, max = MAX_DESC): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t.length) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

export function buildDetailMetadata(input: {
  title: string;
  description?: string | null;
  pathname: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}): Metadata {
  const description = input.description?.length
    ? truncateMetaDescription(input.description)
    : undefined;

  const ogImages =
    input.image && input.image.length > 0
      ? [{ url: input.image, alt: input.title }]
      : undefined;

  const robots = input.noindex
    ? ({ index: false, follow: false } as const)
    : ({ index: true, follow: true } as const);

  return {
    title: input.title,
    ...(description ? { description } : {}),
    alternates: { canonical: input.pathname },
    openGraph: {
      title: input.title,
      ...(description ? { description } : {}),
      url: input.pathname,
      type: input.type ?? "website",
      ...(ogImages ? { images: ogImages } : {}),
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title: input.title,
      ...(description ? { description } : {}),
      ...(ogImages ? { images: [ogImages[0].url] } : {}),
    },
    robots,
  };
}
