import { getMoviesMerged } from "@/lib/catalog";
import { pickSurprise } from "@/lib/catalog-client";
import { getLocale } from "@/lib/i18n-server";
import { NextResponse } from "next/server";

/** “Bana sürpriz yap” ruleti için karıştırılmış film örneklemi. */
export async function GET() {
  const locale = await getLocale();
  const picks = pickSurprise(await getMoviesMerged(locale));
  return NextResponse.json(
    { picks },
    { headers: { "Cache-Control": "no-store" } },
  );
}
