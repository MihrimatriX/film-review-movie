"use client";

import type { BlogPost } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mode: "create" | "edit";
  initial?: BlogPost;
};

export function BlogPostForm({ mode, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") || ""),
      slug: String(fd.get("slug") || ""),
      excerpt: String(fd.get("excerpt") || ""),
      cover: String(fd.get("cover") || ""),
      date: String(fd.get("date") || ""),
      author: String(fd.get("author") || ""),
      body: String(fd.get("body") || ""),
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/posts"
          : `/api/admin/posts/${initial?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Request failed");
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)] placeholder:text-[var(--cv-faint)] focus:border-[var(--cv-accent)] focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {error && (
        <p className="rounded border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Title
        </label>
        <input
          name="title"
          required
          defaultValue={initial?.title}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Slug (URL)
        </label>
        <input
          name="slug"
          defaultValue={initial?.slug}
          className={inputClass}
          placeholder="my-post-slug"
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          rows={3}
          defaultValue={initial?.excerpt}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Cover path
          </label>
          <input
            name="cover"
            defaultValue={initial?.cover}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Date
          </label>
          <input
            name="date"
            type="date"
            defaultValue={initial?.date?.slice(0, 10)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Author
        </label>
        <input
          name="author"
          defaultValue={initial?.author}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">Body</label>
        <textarea
          name="body"
          rows={12}
          defaultValue={initial?.body}
          className={inputClass}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[var(--cv-red)] px-6 py-2 text-sm font-bold uppercase text-[var(--cv-on-red)] disabled:opacity-50"
        >
          {pending ? "Saving…" : mode === "create" ? "Create" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-[var(--cv-border-strong)] px-6 py-2 text-sm text-[var(--cv-muted)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
