import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Film Review",
    short_name: "FilmReview",
    description:
      "Film and TV database with reviews, cast, and TMDB-powered discovery.",
    start_url: "/",
    display: "standalone",
    background_color: "#020d18",
    theme_color: "#020d18",
    lang: "tr",
    dir: "ltr",
    categories: ["entertainment", "movies"],
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        type: "image/svg+xml",
        sizes: "180x180",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        type: "image/svg+xml",
        sizes: "180x180",
        purpose: "maskable",
      },
    ],
  };
}
