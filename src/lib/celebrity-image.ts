import type { Celebrity } from "@/lib/types";

export const CELEBRITY_IMAGE_PLACEHOLDER = "/images/celebrity-placeholder.svg";

export type CelebrityImageVariant =
  | "gridFeatured"
  | "gridCompact"
  | "detail"
  | "list"
  | "search";

const ORDER: Record<CelebrityImageVariant, (keyof Celebrity)[]> = {
  gridFeatured: ["imageGrid2", "image", "imageList"],
  gridCompact: ["image", "imageList", "imageGrid2"],
  detail: ["imageGrid2", "image", "imageList"],
  list: ["imageList", "image", "imageGrid2"],
  search: ["imageList", "image", "imageGrid2"],
};

export function pickCelebrityImageSrc(
  c: Celebrity,
  variant: CelebrityImageVariant,
): string {
  for (const key of ORDER[variant]) {
    const u = c[key];
    if (typeof u === "string" && u.trim().length > 0) return u.trim();
  }
  return CELEBRITY_IMAGE_PLACEHOLDER;
}
