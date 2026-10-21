"use client";

import type { Movie } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mode: "create" | "edit";
  initial?: Movie;
};

export function MovieForm({ mode, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const genresStr = String(fd.get("genres") || "");
    const genres = genresStr
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    const payload = {
      title: String(fd.get("title") || ""),
      slug: String(fd.get("slug") || ""),
      year: Number(fd.get("year")) || new Date().getFullYear(),
      rating: Number(fd.get("rating")) || 0,
      genres,
      poster: String(fd.get("poster") || ""),
      synopsis: String(fd.get("synopsis") || ""),
      runtime: String(fd.get("runtime") || ""),
      director: String(fd.get("director") || ""),
      mpaa: String(fd.get("mpaa") || ""),
      releaseLabel: String(fd.get("releaseLabel") || ""),
      stars: String(fd.get("stars") || ""),
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/movies"
          : `/api/admin/movies/${initial?.id}`;
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
      router.push("/admin/movies");
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
          Slug (URL) — boş bırakılırsa başlıktan üretilir
        </label>
        <input
          name="slug"
          defaultValue={initial?.slug}
          className={inputClass}
          placeholder="interstellar"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Year
          </label>
          <input
            name="year"
            type="number"
            defaultValue={initial?.year}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Rating
          </label>
          <input
            name="rating"
            type="number"
            step="0.1"
            defaultValue={initial?.rating}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Genres (virgülle)
        </label>
        <input
          name="genres"
          defaultValue={initial?.genres.join(", ")}
          className={inputClass}
          placeholder="Sci-fi, Drama"
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Poster path
        </label>
        <input
          name="poster"
          defaultValue={initial?.poster}
          className={inputClass}
          placeholder="/images/placeholders/poster.svg"
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Runtime
        </label>
        <input
          name="runtime"
          defaultValue={initial?.runtime}
          className={inputClass}
          placeholder="120 min"
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Director
        </label>
        <input
          name="director"
          defaultValue={initial?.director}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            MPAA
          </label>
          <input
            name="mpaa"
            defaultValue={initial?.mpaa}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Release label
          </label>
          <input
            name="releaseLabel"
            defaultValue={initial?.releaseLabel}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Stars line
        </label>
        <input
          name="stars"
          defaultValue={initial?.stars}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Synopsis
        </label>
        <textarea
          name="synopsis"
          rows={5}
          defaultValue={initial?.synopsis}
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
