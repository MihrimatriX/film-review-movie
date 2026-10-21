import type { NextConfig } from "next";

/**
 * `STATIC_EXPORT=1` → GitHub Pages için tamamen statik çıktı (`out/`).
 * `BASE_PATH` bu derlemenin alt yolu (örn. `/film-review-movie` ya da İngilizce kopya için
 * `/film-review-movie/en`); `STATIC_ROOT` her iki dilin ortak kökü.
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = isStatic ? process.env.BASE_PATH || "" : "";

const nextConfig: NextConfig = {
  ...(isStatic
    ? { output: "export", basePath, trailingSlash: true }
    : { output: "standalone" }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: isStatic ? "1" : "",
    NEXT_PUBLIC_STATIC_LOCALE: isStatic ? process.env.STATIC_LOCALE || "tr" : "",
    NEXT_PUBLIC_STATIC_ROOT: isStatic
      ? (process.env.STATIC_ROOT ?? basePath)
      : "",
  },
  // React Compiler, Next’in dahili MetadataWrapper / Head ağacıyla (özellikle dev’de)
  // hidrasyon uyumsuzluğuna yol açabiliyor; gerekirse yeniden açılabilir.
  images: {
    unoptimized: isStatic,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
