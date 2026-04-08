import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // React Compiler, Next’in dahili MetadataWrapper / Head ağacıyla (özellikle dev’de)
  // hidrasyon uyumsuzluğuna yol açabiliyor; gerekirse yeniden açılabilir.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
