import {
  readCelebrities,
  readMovies,
  readPosts,
  readSeriesList,
} from "@/lib/data-file";
import { getMetadataBase } from "@/lib/site-url";
import {
  isTmdbConfigured,
  tmdbPopularMovies,
  tmdbPopularTv,
  tmdbSlug,
} from "@/lib/tmdb";
import type { MetadataRoute } from "next";

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] =
  [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/movies", changeFrequency: "daily", priority: 0.9 },
    { path: "/movies/list", changeFrequency: "weekly", priority: 0.6 },
    { path: "/movies/full-width", changeFrequency: "weekly", priority: 0.55 },
    { path: "/series", changeFrequency: "daily", priority: 0.85 },
    { path: "/celebrities", changeFrequency: "weekly", priority: 0.75 },
    { path: "/celebrities/list", changeFrequency: "weekly", priority: 0.5 },
    { path: "/celebrities/grid-2", changeFrequency: "weekly", priority: 0.5 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/blog/list", changeFrequency: "weekly", priority: 0.5 },
  ];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getMetadataBase();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: new URL(entry.path, base).toString(),
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const [movies, series, celebrities, posts] = await Promise.all([
    readMovies(),
    readSeriesList(),
    readCelebrities(),
    readPosts(),
  ]);

  const seen = new Set<string>();
  const pushUnique = (
    list: MetadataRoute.Sitemap,
    entry: MetadataRoute.Sitemap[number],
  ) => {
    if (seen.has(entry.url)) return;
    seen.add(entry.url);
    list.push(entry);
  };

  const movieUrls: MetadataRoute.Sitemap = [];
  for (const m of movies) {
    pushUnique(movieUrls, {
      url: new URL(`/movies/${m.slug}`, base).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      ...(m.poster ? { images: [m.poster] } : {}),
    });
  }

  const seriesUrls: MetadataRoute.Sitemap = [];
  for (const s of series) {
    pushUnique(seriesUrls, {
      url: new URL(`/series/${s.slug}`, base).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
      ...(s.poster ? { images: [s.poster] } : {}),
    });
  }

  const celebUrls: MetadataRoute.Sitemap = [];
  for (const c of celebrities) {
    const img = c.imageGrid2 || c.image;
    pushUnique(celebUrls, {
      url: new URL(`/celebrities/${c.slug}`, base).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
      ...(img ? { images: [img] } : {}),
    });
  }

  const blogUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: new URL(`/blog/${p.slug}`, base).toString(),
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
    ...(p.cover ? { images: [p.cover] } : {}),
  }));

  if (isTmdbConfigured()) {
    const [popularMovies, popularTv] = await Promise.all([
      tmdbPopularMovies("tr"),
      tmdbPopularTv("tr", 1),
    ]);
    for (const m of popularMovies?.results ?? []) {
      if (!m.id || !m.title) continue;
      pushUnique(movieUrls, {
        url: new URL(
          `/movies/${tmdbSlug("movie", m.id, m.title)}`,
          base,
        ).toString(),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    for (const s of popularTv?.results ?? []) {
      if (!s.id || !s.name) continue;
      pushUnique(seriesUrls, {
        url: new URL(`/series/${tmdbSlug("tv", s.id, s.name)}`, base).toString(),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.65,
      });
    }
  }

  return [
    ...staticEntries,
    ...movieUrls,
    ...seriesUrls,
    ...celebUrls,
    ...blogUrls,
  ];
}
