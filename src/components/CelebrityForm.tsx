"use client";

import type { Celebrity } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mode: "create" | "edit";
  initial?: Celebrity;
};

export function CelebrityForm({ mode, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      slug: String(fd.get("slug") || ""),
      role: String(fd.get("role") || ""),
      country: String(fd.get("country") || ""),
      bio: String(fd.get("bio") || ""),
      image: String(fd.get("image") || ""),
      imageGrid2: String(fd.get("imageGrid2") || ""),
      imageList: String(fd.get("imageList") || ""),
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/celebrities"
          : `/api/admin/celebrities/${initial?.id}`;
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
      router.push("/admin/celebrities");
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
        <label className="text-xs uppercase text-[var(--cv-muted)]">Name</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
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
            Role
          </label>
          <input
            name="role"
            defaultValue={initial?.role}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Country
          </label>
          <input
            name="country"
            defaultValue={initial?.country}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">Bio</label>
        <textarea
          name="bio"
          rows={5}
          defaultValue={initial?.bio}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Image (detail)
        </label>
        <input
          name="image"
          defaultValue={initial?.image}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Image grid 2
        </label>
        <input
          name="imageGrid2"
          defaultValue={initial?.imageGrid2}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Image list
        </label>
        <input
          name="imageList"
          defaultValue={initial?.imageList}
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
