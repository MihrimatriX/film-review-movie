import { getMetadataBase, siteOrigin } from "@/lib/site-url";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = siteOrigin();
  const host = getMetadataBase().host;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host,
  };
}
