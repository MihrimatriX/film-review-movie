import { isTmdbConfigured } from "@/lib/tmdb";
import { NextResponse } from "next/server";

/**
 * Yalnizca gelistirme: Next.js surecinin TMDB anahtarini gorup gormedigini kontrol eder.
 * Anahtar degerini asla dondurmez.
 */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    isTmdbConfigured: isTmdbConfigured(),
    hasTMDB_API_KEY: Boolean(process.env.TMDB_API_KEY?.trim()),
    hasNEXT_PUBLIC_TMDB_API_KEY: Boolean(
      process.env.NEXT_PUBLIC_TMDB_API_KEY?.trim(),
    ),
  });
}
