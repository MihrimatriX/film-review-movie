"use client";

import type { UserData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserDataForm({ initial }: { initial: UserData }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const favoritesDefault = initial.favoriteSlugs.join("\n");
  const ratingsDefault = JSON.stringify(initial.ratings, null, 2);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);

    const favLines = String(fd.get("favoriteSlugs") || "")
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    let ratings: UserData["ratings"];
    try {
      ratings = JSON.parse(String(fd.get("ratingsJson") || "[]"));
      if (!Array.isArray(ratings)) throw new Error();
    } catch {
      setError("Ratings JSON must be an array.");
      setPending(false);
      return;
    }

    const payload: UserData = {
      profile: {
        username: String(fd.get("username") || ""),
        email: String(fd.get("email") || ""),
        firstName: String(fd.get("firstName") || ""),
        lastName: String(fd.get("lastName") || ""),
        country: String(fd.get("country") || ""),
        state: String(fd.get("state") || ""),
        avatar: String(fd.get("avatar") || ""),
      },
      favoriteSlugs: favLines,
      ratings,
    };

    try {
      const res = await fetch("/api/admin/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Request failed");
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)] placeholder:text-[var(--cv-faint)] focus:border-[var(--cv-accent)] focus:outline-none";
  const monoClass = `${inputClass} font-mono text-xs leading-relaxed`;

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      {error && (
        <p className="rounded border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase text-[var(--cv-accent)]">
          Profile (community demo)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase text-[var(--cv-muted)]">
              Username
            </label>
            <input
              name="username"
              required
              defaultValue={initial.profile.username}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-[var(--cv-muted)]">
              Email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={initial.profile.email}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-[var(--cv-muted)]">
              First name
            </label>
            <input
              name="firstName"
              defaultValue={initial.profile.firstName}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-[var(--cv-muted)]">
              Last name
            </label>
            <input
              name="lastName"
              defaultValue={initial.profile.lastName}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-[var(--cv-muted)]">
              Country
            </label>
            <input
              name="country"
              defaultValue={initial.profile.country}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-[var(--cv-muted)]">
              State
            </label>
            <input
              name="state"
              defaultValue={initial.profile.state}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--cv-muted)]">
            Avatar path
          </label>
          <input
            name="avatar"
            defaultValue={initial.profile.avatar}
            className={inputClass}
          />
        </div>
      </fieldset>

      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Favorite movie slugs (one per line or comma-separated)
        </label>
        <textarea
          name="favoriteSlugs"
          rows={6}
          defaultValue={favoritesDefault}
          className={monoClass}
          spellCheck={false}
        />
      </div>

      <div>
        <label className="text-xs uppercase text-[var(--cv-muted)]">
          Ratings (JSON array — movieSlug, userRating, optional review fields)
        </label>
        <textarea
          name="ratingsJson"
          rows={14}
          defaultValue={ratingsDefault}
          className={monoClass}
          spellCheck={false}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[var(--cv-red)] px-6 py-2 text-sm font-bold uppercase text-[var(--cv-on-red)] disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save user data"}
      </button>
    </form>
  );
}
