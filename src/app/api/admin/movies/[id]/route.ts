import { readMovies, writeMovies } from "@/lib/data-file";
import type { Movie } from "@/lib/types";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const movies = await readMovies();
  const movie = movies.find((m) => m.id === id);
  if (!movie) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(movie);
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  let body: Partial<Movie>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const movies = await readMovies();
  const idx = movies.findIndex((m) => m.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const prev = movies[idx];
  const updated: Movie = {
    ...prev,
    ...body,
    id: prev.id,
    slug: body.slug?.trim() || prev.slug,
    title: body.title?.trim() || prev.title,
    year: typeof body.year === "number" ? body.year : prev.year,
    rating: typeof body.rating === "number" ? body.rating : prev.rating,
    genres: Array.isArray(body.genres) ? body.genres : prev.genres,
    poster: body.poster?.trim() || prev.poster,
    synopsis: body.synopsis?.trim() ?? prev.synopsis,
    runtime: body.runtime?.trim() ?? prev.runtime,
    director: body.director?.trim() ?? prev.director,
    mpaa: body.mpaa?.trim() ?? prev.mpaa,
    releaseLabel: body.releaseLabel?.trim() ?? prev.releaseLabel,
    stars: body.stars?.trim() ?? prev.stars,
  };

  movies[idx] = updated;
  await writeMovies(movies);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const movies = await readMovies();
  const next = movies.filter((m) => m.id !== id);
  if (next.length === movies.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeMovies(next);
  return NextResponse.json({ ok: true });
}
