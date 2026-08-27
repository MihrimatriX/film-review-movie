import { readCelebrities, writeCelebrities } from "@/lib/data-file";
import type { Celebrity } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const list = await readCelebrities();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  let body: Partial<Celebrity>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const list = await readCelebrities();
  const slug =
    body.slug?.trim() ||
    body.name
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
    `celebrity-${Date.now()}`;

  const item: Celebrity = {
    id: crypto.randomUUID(),
    slug,
    name: body.name?.trim() || "Unknown",
    role: body.role?.trim() || "Actor",
    country: body.country?.trim(),
    bio: body.bio?.trim() || "",
    image: body.image?.trim() || "/images/placeholders/portrait.svg",
    imageGrid2: body.imageGrid2?.trim(),
    imageList: body.imageList?.trim(),
  };

  list.push(item);
  await writeCelebrities(list);
  return NextResponse.json(item, { status: 201 });
}
