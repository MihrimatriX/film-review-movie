import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";

/**
 * Sunucu modunda `lang` çerezini okur (root layout'u kullanan tüm rotalar dinamik render edilir).
 * Statik export'ta (GitHub Pages) çerez yoktur; dil derleme anında sabitlenir, her dil ayrı derlenir.
 */
export async function getLocale(): Promise<Locale> {
  const fixed = process.env.NEXT_PUBLIC_STATIC_LOCALE;
  if (fixed) return fixed === "en" ? "en" : "tr";
  const jar = await cookies();
  const raw = jar.get("lang")?.value;
  return raw === "en" ? "en" : "tr";
}
