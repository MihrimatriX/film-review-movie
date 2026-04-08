import { readPosts, writePosts } from "@/lib/data-file";
import type { BlogPost } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await readPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  let body: Partial<BlogPost>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const posts = await readPosts();
  const slug =
    body.slug?.trim() ||
    body.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
    `post-${Date.now()}`;

  const post: BlogPost = {
    id: crypto.randomUUID(),
    slug,
    title: body.title?.trim() || "Untitled",
    excerpt: body.excerpt?.trim() || "",
    cover: body.cover?.trim() || "/images/placeholders/cover.svg",
    date: body.date?.trim() || new Date().toISOString().slice(0, 10),
    author: body.author?.trim() || "Admin",
    body: body.body?.trim() || "",
    tags: Array.isArray(body.tags)
      ? body.tags.map((x) => String(x).trim()).filter(Boolean)
      : undefined,
  };

  posts.push(post);
  await writePosts(posts);
  return NextResponse.json(post, { status: 201 });
}
