"use client";

import { useSyncExternalStore } from "react";

/**
 * Ziyaretçinin kişisel kütüphanesi (izleme listesi + kendi puanları).
 * Sunucuya yazılmaz; `localStorage`’da tutulur ve sekmeler arası senkronlanır.
 */

export type LibraryKind = "movie" | "series";

export type LibraryItem = {
  kind: LibraryKind;
  slug: string;
  title: string;
  poster: string;
  /** Film yılı veya dizi yıl etiketi (“2016–2022”). */
  year: string;
  /** Platform/TMDB puanı (kullanıcı puanı değil). */
  rating: number;
  genres?: string[];
};

export type WatchlistEntry = LibraryItem & { addedAt: number };
export type RatingEntry = LibraryItem & { value: number; ratedAt: number };

export type LibraryState = {
  watchlist: WatchlistEntry[];
  ratings: Record<string, RatingEntry>;
};

const STORAGE_KEY = "film-review:library:v1";
const EMPTY: LibraryState = { watchlist: [], ratings: {} };

let state: LibraryState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

export function libraryKey(kind: LibraryKind, slug: string) {
  return `${kind}:${slug}`;
}

function sanitize(raw: unknown): LibraryState {
  if (!raw || typeof raw !== "object") return EMPTY;
  const r = raw as Partial<LibraryState>;
  const watchlist = Array.isArray(r.watchlist)
    ? r.watchlist.filter(
        (w): w is WatchlistEntry =>
          !!w && typeof w.slug === "string" && typeof w.title === "string",
      )
    : [];
  const ratings: Record<string, RatingEntry> = {};
  if (r.ratings && typeof r.ratings === "object") {
    for (const [k, v] of Object.entries(r.ratings)) {
      if (v && typeof v.value === "number" && typeof v.slug === "string") {
        ratings[k] = v;
      }
    }
  }
  return { watchlist, ratings };
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = sanitize(JSON.parse(raw));
  } catch {
    state = EMPTY;
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      state = e.newValue ? sanitize(JSON.parse(e.newValue)) : EMPTY;
    } catch {
      state = EMPTY;
    }
    listeners.forEach((l) => l());
  });
}

function commit(next: LibraryState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* gizli mod / kota: bellekte kalır */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useLibrary(): LibraryState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function isInWatchlist(
  s: LibraryState,
  kind: LibraryKind,
  slug: string,
) {
  return s.watchlist.some((w) => w.kind === kind && w.slug === slug);
}

/** Listede yoksa ekler, varsa çıkarır; yeni durumu (`true` = eklendi) döner. */
export function toggleWatchlist(item: LibraryItem): boolean {
  load();
  const exists = isInWatchlist(state, item.kind, item.slug);
  commit({
    ...state,
    watchlist: exists
      ? state.watchlist.filter(
          (w) => !(w.kind === item.kind && w.slug === item.slug),
        )
      : [{ ...item, addedAt: Date.now() }, ...state.watchlist],
  });
  return !exists;
}

export function setMyRating(item: LibraryItem, value: number | null) {
  load();
  const key = libraryKey(item.kind, item.slug);
  const ratings = { ...state.ratings };
  if (value == null) delete ratings[key];
  else ratings[key] = { ...item, value, ratedAt: Date.now() };
  commit({ ...state, ratings });
}

export function clearWatchlist() {
  load();
  commit({ ...state, watchlist: [] });
}

export function clearRatings() {
  load();
  commit({ ...state, ratings: {} });
}
