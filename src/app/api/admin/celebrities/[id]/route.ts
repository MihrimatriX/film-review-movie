import { readCelebrities, writeCelebrities } from "@/lib/data-file";
import type { Celebrity } from "@/lib/types";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const list = await readCelebrities();
  const item = list.find((c) => c.id === id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  let body: Partial<Celebrity>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const list = await readCelebrities();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const prev = list[idx];
  const updated: Celebrity = {
    ...prev,
    ...body,
    id: prev.id,
    slug: body.slug?.trim() || prev.slug,
    name: body.name?.trim() || prev.name,
    role: body.role?.trim() || prev.role,
    country: body.country?.trim() ?? prev.country,
    bio: body.bio?.trim() ?? prev.bio,
    image: body.image?.trim() || prev.image,
    imageGrid2: body.imageGrid2?.trim() ?? prev.imageGrid2,
    imageList: body.imageList?.trim() ?? prev.imageList,
  };

  list[idx] = updated;
  await writeCelebrities(list);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const list = await readCelebrities();
  const next = list.filter((c) => c.id !== id);
  if (next.length === list.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeCelebrities(next);
  return NextResponse.json({ ok: true });
}
