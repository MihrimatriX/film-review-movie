"use client";

import type { Series } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mode: "create" | "edit";
  initial?: Series;
};

export function SeriesForm({ mode, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const seasonsDefault = initial?.seasons
    ? JSON.stringify(initial.seasons, null, 2)
    : "[]";
  const castDefault = initial?.cast
    ? JSON.stringify(initial.cast, null, 2)
    : "[]";
  const thumbsDefault = initial?.mediaThumbs
    ? JSON.stringify(initial.mediaThumbs, null, 2)
    : "[]";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);

    let seasons: Series["seasons"];
    let cast: Series["cast"];
    let mediaThumbs: string[];
    try {
      seasons = JSON.parse(String(fd.get("seasonsJson") || "[]"));
      if (!Array.isArray(seasons))
        throw new Error("Seasons must be a JSON array");
    } catch {
      setError("Seasons JSON is invalid.");
      setPending(false);
      return;
    }
    try {
      cast = JSON.parse(String(fd.get("castJson") || "[]"));
      if (!Array.isArray(cast)) throw new Error();
    } catch {
      setError("Cast JSON is invalid.");
      setPending(false);
      return;
    }
    try {
      mediaThumbs = JSON.parse(String(fd.get("mediaThumbsJson") || "[]"));
      if (!Array.isArray(mediaThumbs)) throw new Error();
      mediaThumbs = mediaThumbs.map(String);
    } catch {
      setError("Media thumbs JSON must be an array of strings.");
      setPending(false);
      return;
    }

    const genresStr = String(fd.get("genres") || "");
    const genres = genresStr
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
    const kwStr = String(fd.get("plotKeywords") || "");
    const plotKeywords = kwStr
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      title: String(fd.get("title") || ""),
      slug: String(fd.get("slug") || ""),
      yearLabel: String(fd.get("yearLabel") || ""),
      rating: Number(fd.get("rating")) || 0,
      reviewCount: Number(fd.get("reviewCount")) || 0,
      poster: String(fd.get("poster") || ""),
      synopsis: String(fd.get("synopsis") || ""),
      runtime: String(fd.get("runtime") || ""),
      mpaa: String(fd.get("mpaa") || ""),
      genres,
      director: String(fd.get("director") || ""),
      writers: String(fd.get("writers") || ""),
      starsLine: String(fd.get("starsLine") || ""),
      releaseDate: String(fd.get("releaseDate") || ""),
      plotKeywords,
      seasons,
      cast,
      mediaThumbs,
      videoThumb: String(fd.get("videoThumb") || ""),
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/series"
          : `/api/admin/series/${initial?.id}`;
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
      router.push("/admin/series");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)] placeholder:text-[var(--cv-faint)] focus:border-[var(--cv-accent)] focus:outline-none";
  const monoClass = `${inputClass} font-mono text-xs leading-relaxed`;

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4">
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
        <label className="text-xs uppercase text-[var(--cv-muted)]">Slug</label>
        <input
          name="slug"
          defaultValue={initial?.slug}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Year label
          </label>
          <input
            name="yearLabel"
            defaultValue={initial?.yearLabel}
            className={inputClass}
            placeholder="2007 - current"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Release date text
          </label>
          <input
            name="releaseDate"
            defaultValue={initial?.releaseDate}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
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
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Review count
          </label>
          <input
            name="reviewCount"
            type="number"
            defaultValue={initial?.reviewCount}
            className={inputClass}
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
          />
        </div>
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Poster path
        </label>
        <input
          name="poster"
          defaultValue={initial?.poster}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Synopsis
        </label>
        <textarea
          name="synopsis"
          rows={4}
          defaultValue={initial?.synopsis}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            MPAA / TV
          </label>
          <input
            name="mpaa"
            defaultValue={initial?.mpaa}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Genres (comma)
          </label>
          <input
            name="genres"
            defaultValue={initial?.genres.join(", ")}
            className={inputClass}
          />
        </div>
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
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Writers
        </label>
        <input
          name="writers"
          defaultValue={initial?.writers}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Stars line
        </label>
        <input
          name="starsLine"
          defaultValue={initial?.starsLine}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Plot keywords (comma)
        </label>
        <input
          name="plotKeywords"
          defaultValue={initial?.plotKeywords.join(", ")}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Video thumb path
        </label>
        <input
          name="videoThumb"
          defaultValue={initial?.videoThumb}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Seasons (JSON array)
        </label>
        <textarea
          name="seasonsJson"
          rows={8}
          defaultValue={seasonsDefault}
          className={monoClass}
          spellCheck={false}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Cast (JSON array)
        </label>
        <textarea
          name="castJson"
          rows={10}
          defaultValue={castDefault}
          className={monoClass}
          spellCheck={false}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Media thumbs (JSON string array)
        </label>
        <textarea
          name="mediaThumbsJson"
          rows={4}
          defaultValue={thumbsDefault}
          className={monoClass}
          spellCheck={false}
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
