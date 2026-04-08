import { readSeriesList, writeSeriesList } from "@/lib/data-file";
import type { Series, SeriesCast, SeriesSeason } from "@/lib/types";
import { NextResponse } from "next/server";

function asSeriesPayload(body: Partial<Series>): Omit<Series, "id"> {
  return {
    slug: body.slug?.trim() || "series",
    title: body.title?.trim() || "Untitled",
    yearLabel: body.yearLabel?.trim() || "",
    rating: typeof body.rating === "number" ? body.rating : 0,
    reviewCount: typeof body.reviewCount === "number" ? body.reviewCount : 0,
    poster: body.poster?.trim() || "/images/placeholders/poster.svg",
    synopsis: body.synopsis?.trim() || "",
    runtime: body.runtime?.trim() || "",
    mpaa: body.mpaa?.trim() || "",
    genres: Array.isArray(body.genres) ? body.genres : [],
    director: body.director?.trim() || "",
    writers: body.writers?.trim() || "",
    starsLine: body.starsLine?.trim() || "",
    releaseDate: body.releaseDate?.trim() || "",
    plotKeywords: Array.isArray(body.plotKeywords) ? body.plotKeywords : [],
    seasons: Array.isArray(body.seasons)
      ? (body.seasons as SeriesSeason[])
      : [],
    cast: Array.isArray(body.cast) ? (body.cast as SeriesCast[]) : [],
    mediaThumbs: Array.isArray(body.mediaThumbs)
      ? (body.mediaThumbs as string[])
      : [],
    videoThumb: body.videoThumb?.trim() || "",
  };
}

export async function GET() {
  const list = await readSeriesList();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  let body: Partial<Series>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const list = await readSeriesList();
  const base = asSeriesPayload(body);
  const slug =
    base.slug !== "series"
      ? base.slug
      : base.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || `series-${Date.now()}`;

  const item: Series = {
    id: crypto.randomUUID(),
    ...base,
    slug,
  };

  list.push(item);
  await writeSeriesList(list);
  return NextResponse.json(item, { status: 201 });
}
