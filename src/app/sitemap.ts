import {
  readCelebrities,
  readMovies,
  readPosts,
  readSeriesList,
} from "@/lib/data-file";
import { getMetadataBase } from "@/lib/site-url";
import type { MetadataRoute } from "next";

const STATIC_PATHS: string[] = [
  "/",
  "/movies",
  "/movies/list",
  "/movies/full-width",
  "/series",
  "/celebrities",
  "/celebrities/list",
  "/celebrities/grid-2",
  "/blog",
  "/blog/list",
  "/community/profile",
  "/community/favorites",
  "/community/favorites/list",
  "/community/rated",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getMetadataBase();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const [movies, series, celebrities, posts] = await Promise.all([
    readMovies(),
    readSeriesList(),
    readCelebrities(),
    readPosts(),
  ]);

  const movieUrls: MetadataRoute.Sitemap = movies.map((m) => ({
    url: new URL(`/movies/${m.slug}`, base).toString(),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const seriesUrls: MetadataRoute.Sitemap = series.map((s) => ({
    url: new URL(`/series/${s.slug}`, base).toString(),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const celebUrls: MetadataRoute.Sitemap = celebrities.map((c) => ({
    url: new URL(`/celebrities/${c.slug}`, base).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const blogUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: new URL(`/blog/${p.slug}`, base).toString(),
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...movieUrls,
    ...seriesUrls,
    ...celebUrls,
    ...blogUrls,
  ];
}
