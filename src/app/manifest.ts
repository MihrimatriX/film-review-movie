import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Film Review",
    short_name: "FilmReview",
    description:
      "Film and TV database with reviews, cast, and TMDB-powered discovery.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c12",
    theme_color: "#0c0c12",
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
