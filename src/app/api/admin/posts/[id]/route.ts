import { readPosts, writePosts } from "@/lib/data-file";
import type { BlogPost } from "@/lib/types";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const posts = await readPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  let body: Partial<BlogPost>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const posts = await readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const prev = posts[idx];
  const updated: BlogPost = {
    ...prev,
    ...body,
    id: prev.id,
    slug: body.slug?.trim() || prev.slug,
    title: body.title?.trim() || prev.title,
    excerpt: body.excerpt?.trim() ?? prev.excerpt,
    cover: body.cover?.trim() || prev.cover,
    date: body.date?.trim() || prev.date,
    author: body.author?.trim() || prev.author,
    body: body.body?.trim() ?? prev.body,
  };

  posts[idx] = updated;
  await writePosts(posts);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const posts = await readPosts();
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writePosts(next);
  return NextResponse.json({ ok: true });
}
