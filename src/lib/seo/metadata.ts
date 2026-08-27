import { getLocale, t, type Locale } from "@/lib/i18n";
import {
  inferOgImageSize,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  ogLocale,
  SITE_NAME,
  truncateMetaDescription,
} from "@/lib/seo/helpers";
import type { Metadata } from "next";

export type SeoOgType =
  | "website"
  | "article"
  | "video.movie"
  | "video.tv_show"
  | "profile";

export type SeoOgVideo = {
  url: string;
  width?: number;
  height?: number;
  type?: string;
};

export type SeoOgActor = {
  profile: string;
  role?: string;
};

export async function buildDetailMetadata(input: {
  title: string;
  description?: string | null;
  pathname: string;
  image?: string | null;
  imageAlt?: string;
  type?: SeoOgType;
  locale?: Locale;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  section?: string;
  keywords?: string[];
  noindex?: boolean;
  absoluteTitle?: boolean;
  videos?: SeoOgVideo[];
  directors?: string[];
  writers?: string[];
  actors?: SeoOgActor[];
  duration?: number;
  releaseDate?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female";
}): Promise<Metadata> {
  const locale = input.locale ?? (await getLocale());
  const dict = t(locale);
  const siteName = dict.seo.siteName || SITE_NAME;
  const description = input.description?.length
    ? truncateMetaDescription(input.description)
    : undefined;

  const imageUrl = input.image?.trim() || "";
  const ogImages = imageUrl
    ? [
        {
          url: imageUrl,
          alt: input.imageAlt || input.title,
          ...inferOgImageSize(imageUrl),
        },
      ]
    : [
        {
          url: "/opengraph-image",
          alt: dict.seo.ogImageAlt,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      ];

  const robots = input.noindex
    ? ({
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      } as const)
    : ({
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      } as const);

  const loc = ogLocale(locale);
  const alternate = loc === "tr_TR" ? "en_US" : "tr_TR";
  const ogType = input.type ?? "website";

  const openGraph: Metadata["openGraph"] = {
    type: ogType,
    siteName,
    locale: loc,
    alternateLocale: [alternate],
    title: input.title,
    url: input.pathname,
    images: ogImages,
    ...(description ? { description } : {}),
    ...(input.videos?.length ? { videos: input.videos } : {}),
    ...(ogType === "article"
      ? {
          publishedTime: input.publishedTime,
          modifiedTime: input.modifiedTime,
          authors: input.authors,
          tags: input.tags,
          section: input.section,
        }
      : {}),
    ...(ogType === "video.movie" || ogType === "video.tv_show"
      ? {
          directors: input.directors,
          writers: input.writers,
          actors: input.actors,
          duration: input.duration,
          releaseDate: input.releaseDate,
          tags: input.tags,
        }
      : {}),
    ...(ogType === "profile"
      ? {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
        }
      : {}),
  };

  const keywords = uniqueKeywords([
    ...(input.keywords ?? []),
    ...(input.tags ?? []),
  ]);

  return {
    title: input.absoluteTitle
      ? { absolute: input.title }
      : input.title,
    ...(description ? { description } : {}),
    ...(keywords.length ? { keywords } : {}),
    ...(input.authors?.length
      ? { authors: input.authors.map((name) => ({ name })) }
      : {}),
    alternates: { canonical: input.pathname },
    category: "entertainment",
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: input.title,
      ...(description ? { description } : {}),
      ...(ogImages
        ? {
            images: [
              {
                url: ogImages[0].url,
                alt: ogImages[0].alt,
                width: ogImages[0].width,
                height: ogImages[0].height,
              },
            ],
          }
        : {}),
    },
    robots,
  };
}

function uniqueKeywords(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const k = raw.replace(/\s+/g, " ").trim();
    if (!k) continue;
    const key = k.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
  }
  return out.slice(0, 16);
}
