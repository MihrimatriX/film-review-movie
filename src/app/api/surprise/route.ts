import { getMoviesMerged } from "@/lib/catalog";
import { getLocale } from "@/lib/i18n";
import type { SurprisePick } from "@/lib/types";
import { NextResponse } from "next/server";

/** “Bana sürpriz yap” ruleti için karıştırılmış film örneklemi. */
export async function GET() {
  const locale = await getLocale();
  const movies = (await getMoviesMerged(locale)).filter((m) => m.poster);

  // Fisher–Yates
  const pool = [...movies];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const picks: SurprisePick[] = pool.slice(0, 14).map((m) => ({
    slug: m.slug,
    title: m.title,
    poster: m.poster,
    year: m.year,
    rating: m.rating,
    genres: m.genres.slice(0, 3),
    synopsis: m.synopsis,
  }));

  return NextResponse.json(
    { picks },
    { headers: { "Cache-Control": "no-store" } },
  );
}
