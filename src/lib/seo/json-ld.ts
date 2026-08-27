import { t, type Locale } from "@/lib/i18n";
import {
  htmlLang,
  iso8601DurationFromSeconds,
  parseRuntimeToSeconds,
  SITE_NAME,
  splitCommaList,
  toIsoDate,
} from "@/lib/seo/helpers";
import { siteOrigin, siteUrl } from "@/lib/site-url";
import type { BlogPost, Celebrity, Movie, Series } from "@/lib/types";

type JsonLdNode = Record<string, unknown>;

export function organizationNode(): JsonLdNode {
  const origin = siteOrigin();
  return {
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: SITE_NAME,
    url: origin,
    logo: {
      "@type": "ImageObject",
      url: siteUrl("/icon.svg"),
    },
    email: "hello.portfolio.demo@local",
  };
}

export function websiteNode(locale: Locale): JsonLdNode {
  const origin = siteOrigin();
  const s = t(locale);
  return {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: s.seo.siteName,
    url: origin,
    description: s.seo.defaultDescription,
    inLanguage: ["tr-TR", "en-US"],
    publisher: { "@id": `${origin}/#organization` },
  };
}

export function breadcrumbNode(
  items: { name: string; pathname?: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.pathname ? { item: siteUrl(item.pathname) } : {}),
    })),
  };
}

export function webPageNode(input: {
  pathname: string;
  title: string;
  description?: string | null;
  locale: Locale;
  image?: string | null;
}): JsonLdNode {
  const url = siteUrl(input.pathname);
  const origin = siteOrigin();
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.title,
    ...(input.description ? { description: input.description } : {}),
    inLanguage: htmlLang(input.locale),
    isPartOf: { "@id": `${origin}/#website` },
    ...(input.image ? { primaryImageOfPage: { "@type": "ImageObject", url: input.image } } : {}),
  };
}

export function movieNode(
  movie: Movie,
  extras?: {
    pathname: string;
    backdropUrl?: string | null;
    voteCount?: number;
    trailerKey?: string | null;
    trailerName?: string | null;
    imdbUrl?: string | null;
    keywords?: string[];
    originalTitle?: string | null;
  },
): JsonLdNode {
  const url = extras?.pathname ? siteUrl(extras.pathname) : undefined;
  const durationSec = parseRuntimeToSeconds(movie.runtime);
  const published = toIsoDate(movie.releaseLabel, movie.year);
  const images = [extras?.backdropUrl, movie.poster].filter(Boolean) as string[];
  const actors = splitCommaList(movie.stars).map((name) => ({
    "@type": "Person",
    name,
  }));
  const node: JsonLdNode = {
    "@type": "Movie",
    name: movie.title,
    ...(url ? { url } : {}),
    ...(movie.synopsis ? { description: movie.synopsis } : {}),
    ...(images.length ? { image: images } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(movie.genres.length ? { genre: movie.genres } : {}),
    ...(movie.director
      ? { director: { "@type": "Person", name: movie.director } }
      : {}),
    ...(actors.length ? { actor: actors } : {}),
    ...(durationSec
      ? { duration: iso8601DurationFromSeconds(durationSec) }
      : {}),
    ...(movie.mpaa ? { contentRating: movie.mpaa } : {}),
    ...(extras?.originalTitle ? { alternateName: extras.originalTitle } : {}),
    ...(extras?.keywords?.length ? { keywords: extras.keywords.join(", ") } : {}),
    ...(extras?.imdbUrl ? { sameAs: [extras.imdbUrl] } : {}),
  };

  if (extras?.voteCount && extras.voteCount > 0 && movie.rating > 0) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: movie.rating,
      bestRating: 10,
      worstRating: 0,
      ratingCount: extras.voteCount,
    };
  }

  if (extras?.trailerKey) {
    node.trailer = {
      "@type": "VideoObject",
      name: extras.trailerName || `${movie.title} trailer`,
      embedUrl: `https://www.youtube.com/embed/${extras.trailerKey}`,
      thumbnailUrl: `https://img.youtube.com/vi/${extras.trailerKey}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${extras.trailerKey}`,
    };
  }

  return node;
}

export function seriesNode(
  series: Series,
  extras?: {
    pathname: string;
    backdropUrl?: string | null;
    voteCount?: number;
    trailerKey?: string | null;
    trailerName?: string | null;
    imdbUrl?: string | null;
    numberOfSeasons?: number;
    numberOfEpisodes?: number;
    creators?: string[];
    keywords?: string[];
  },
): JsonLdNode {
  const url = extras?.pathname ? siteUrl(extras.pathname) : undefined;
  const durationSec = parseRuntimeToSeconds(series.runtime);
  const year = Number(String(series.yearLabel).slice(0, 4));
  const published = toIsoDate(series.releaseDate, year);
  const images = [extras?.backdropUrl, series.poster].filter(Boolean) as string[];
  const actors = (series.cast?.length
    ? series.cast.map((c) => c.name)
    : splitCommaList(series.starsLine)
  ).map((name) => ({ "@type": "Person", name }));

  const node: JsonLdNode = {
    "@type": "TVSeries",
    name: series.title,
    ...(url ? { url } : {}),
    ...(series.synopsis ? { description: series.synopsis } : {}),
    ...(images.length ? { image: images } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(series.genres.length ? { genre: series.genres } : {}),
    ...(series.director
      ? { director: { "@type": "Person", name: series.director } }
      : {}),
    ...(extras?.creators?.length
      ? {
          creator: extras.creators.map((name) => ({
            "@type": "Person",
            name,
          })),
        }
      : {}),
    ...(actors.length ? { actor: actors } : {}),
    ...(durationSec
      ? { duration: iso8601DurationFromSeconds(durationSec) }
      : {}),
    ...(series.mpaa ? { contentRating: series.mpaa } : {}),
    ...(extras?.numberOfSeasons
      ? { numberOfSeasons: extras.numberOfSeasons }
      : series.seasons?.length
        ? { numberOfSeasons: series.seasons.length }
        : {}),
    ...(extras?.numberOfEpisodes
      ? { numberOfEpisodes: extras.numberOfEpisodes }
      : {}),
    ...(extras?.keywords?.length ? { keywords: extras.keywords.join(", ") } : {}),
    ...(extras?.imdbUrl ? { sameAs: [extras.imdbUrl] } : {}),
  };

  const votes = extras?.voteCount ?? series.reviewCount;
  if (votes > 0 && series.rating > 0) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: series.rating,
      bestRating: 10,
      worstRating: 0,
      ratingCount: votes,
    };
  }

  if (extras?.trailerKey) {
    node.trailer = {
      "@type": "VideoObject",
      name: extras.trailerName || `${series.title} trailer`,
      embedUrl: `https://www.youtube.com/embed/${extras.trailerKey}`,
      thumbnailUrl: `https://img.youtube.com/vi/${extras.trailerKey}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${extras.trailerKey}`,
    };
  }

  return node;
}

export function personNode(
  person: Celebrity,
  pathname: string,
): JsonLdNode {
  const images = [person.imageGrid2, person.image].filter(Boolean) as string[];
  return {
    "@type": "Person",
    name: person.name,
    url: siteUrl(pathname),
    ...(person.bio ? { description: person.bio } : {}),
    ...(images.length ? { image: images } : {}),
    ...(person.role ? { jobTitle: person.role } : {}),
    ...(person.placeOfBirth || person.country
      ? { birthPlace: { "@type": "Place", name: person.placeOfBirth || person.country } }
      : {}),
    ...(person.birthday ? { birthDate: person.birthday } : {}),
    ...(person.deathday ? { deathDate: person.deathday } : {}),
  };
}

export function articleNode(
  post: BlogPost,
  pathname: string,
  readingMinutes?: number,
): JsonLdNode {
  const origin = siteOrigin();
  const url = siteUrl(pathname);
  const published =
    post.date && !Number.isNaN(Date.parse(post.date))
      ? new Date(post.date).toISOString()
      : undefined;
  const wordCount = post.body
    ? post.body.split(/\s+/).filter(Boolean).length
    : undefined;

  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
    ...(published ? { datePublished: published } : {}),
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${origin}/#organization` },
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(readingMinutes
      ? { timeRequired: `PT${Math.max(1, readingMinutes)}M` }
      : {}),
    inLanguage: ["tr-TR", "en-US"],
  };
}

export function siteGraph(locale: Locale): JsonLdNode[] {
  return [organizationNode(), websiteNode(locale)];
}
