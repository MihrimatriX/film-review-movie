import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export const SITE_NAME = "Film Review";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const MAX_DESC = 165;

export function truncateMetaDescription(text: string, max = MAX_DESC): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t.length) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

export function ogLocale(locale: Locale): "tr_TR" | "en_US" {
  return locale === "tr" ? "tr_TR" : "en_US";
}

export function htmlLang(locale: Locale): string {
  return locale === "tr" ? "tr-TR" : "en-US";
}

export function splitCommaList(value?: string | null): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/,|·|;/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseRuntimeToSeconds(runtime?: string | null): number | undefined {
  if (!runtime?.trim()) return undefined;
  const hours = runtime.match(/(\d+)\s*h/i);
  const mins = runtime.match(/(\d+)\s*m/i);
  if (hours || mins) {
    const total =
      (hours ? Number(hours[1]) * 3600 : 0) + (mins ? Number(mins[1]) * 60 : 0);
    return total > 0 ? total : undefined;
  }
  const n = runtime.match(/(\d+)/);
  if (!n) return undefined;
  const minutes = Number(n[1]);
  return minutes > 0 ? minutes * 60 : undefined;
}

export function iso8601DurationFromSeconds(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h && m) return `PT${h}H${m}M`;
  if (h) return `PT${h}H`;
  return `PT${Math.max(1, m)}M`;
}

export function toIsoDate(
  value?: string | null,
  year?: number | string | null,
): string | undefined {
  if (value?.trim()) {
    const v = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
    const parsed = Date.parse(v);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString().slice(0, 10);
    }
  }
  const y = typeof year === "string" ? Number(year.slice(0, 4)) : year;
  if (y && Number.isFinite(y) && y > 1880) return String(y);
  return undefined;
}

export function inferOgImageSize(url: string): { width: number; height: number } {
  if (/\/(w1280|original)\//.test(url) || /backdrop/.test(url)) {
    return { width: 1280, height: 720 };
  }
  if (/\/h632\//.test(url)) {
    return { width: 421, height: 632 };
  }
  if (/\/(w500|w780|w342)\//.test(url)) {
    return { width: 500, height: 750 };
  }
  return { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
}

export function splitPersonName(name: string): {
  firstName: string;
  lastName?: string;
} {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] || name };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function notFoundMetadata(locale: Locale): Metadata {
  return {
    title: locale === "en" ? "Not found" : "Sayfa bulunamadı",
    robots: { index: false, follow: false },
  };
}
