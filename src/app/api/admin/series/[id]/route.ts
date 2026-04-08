import { readSeriesList, writeSeriesList } from "@/lib/data-file";
import type { Series, SeriesCast, SeriesSeason } from "@/lib/types";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const list = await readSeriesList();
  const item = list.find((s) => s.id === id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  let body: Partial<Series>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const list = await readSeriesList();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const prev = list[idx];
  const updated: Series = {
    ...prev,
    ...body,
    id: prev.id,
    slug: body.slug?.trim() || prev.slug,
    title: body.title?.trim() || prev.title,
    yearLabel: body.yearLabel?.trim() ?? prev.yearLabel,
    rating: typeof body.rating === "number" ? body.rating : prev.rating,
    reviewCount:
      typeof body.reviewCount === "number"
        ? body.reviewCount
        : prev.reviewCount,
    poster: body.poster?.trim() || prev.poster,
    synopsis: body.synopsis?.trim() ?? prev.synopsis,
    runtime: body.runtime?.trim() ?? prev.runtime,
    mpaa: body.mpaa?.trim() ?? prev.mpaa,
    genres: Array.isArray(body.genres) ? body.genres : prev.genres,
    director: body.director?.trim() ?? prev.director,
    writers: body.writers?.trim() ?? prev.writers,
    starsLine: body.starsLine?.trim() ?? prev.starsLine,
    releaseDate: body.releaseDate?.trim() ?? prev.releaseDate,
    plotKeywords: Array.isArray(body.plotKeywords)
      ? body.plotKeywords
      : prev.plotKeywords,
    seasons: Array.isArray(body.seasons)
      ? (body.seasons as SeriesSeason[])
      : prev.seasons,
    cast: Array.isArray(body.cast) ? (body.cast as SeriesCast[]) : prev.cast,
    mediaThumbs: Array.isArray(body.mediaThumbs)
      ? (body.mediaThumbs as string[])
      : prev.mediaThumbs,
    videoThumb: body.videoThumb?.trim() ?? prev.videoThumb,
  };

  list[idx] = updated;
  await writeSeriesList(list);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const list = await readSeriesList();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeSeriesList(next);
  return NextResponse.json({ ok: true });
}
