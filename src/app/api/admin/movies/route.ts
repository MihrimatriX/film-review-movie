import { readMovies, writeMovies } from "@/lib/data-file";
import type { Movie } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const movies = await readMovies();
  return NextResponse.json(movies);
}

export async function POST(request: Request) {
  let body: Partial<Movie>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const movies = await readMovies();
  const slug =
    body.slug?.trim() ||
    body.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
    `movie-${Date.now()}`;

  const movie: Movie = {
    id: crypto.randomUUID(),
    slug,
    title: body.title?.trim() || "Untitled",
    year: typeof body.year === "number" ? body.year : new Date().getFullYear(),
    rating: typeof body.rating === "number" ? body.rating : 0,
    genres: Array.isArray(body.genres) ? body.genres : [],
    poster: body.poster?.trim() || "/images/placeholders/poster.svg",
    synopsis: body.synopsis?.trim() || "",
    runtime: body.runtime?.trim(),
    director: body.director?.trim(),
    mpaa: body.mpaa?.trim(),
    releaseLabel: body.releaseLabel?.trim(),
    stars: body.stars?.trim(),
  };

  movies.push(movie);
  await writeMovies(movies);
  return NextResponse.json(movie, { status: 201 });
}
