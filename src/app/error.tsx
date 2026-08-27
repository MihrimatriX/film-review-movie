"use client";

import { IssuePageShell } from "@/components/IssuePageShell";
import type { Locale } from "@/lib/i18n";
import { useEffect, useMemo } from "react";

const DICT = {
  tr: {
    title: "Bir şeyler ters gitti",
    pageTitle: "Hata",
    message:
      "Bu sayfa yüklenirken beklenmeyen bir sorun oluştu. Tekrar deneyebilir veya ana sayfaya dönebilirsiniz.",
    retry: "Yeniden dene",
    home: "Ana sayfa",
    browse: "Keşfet",
    movies: "Filmler",
    series: "Diziler",
    celebrities: "Ünlüler",
    blog: "Blog",
  },
  en: {
    title: "Something went wrong",
    pageTitle: "Error",
    message:
      "We hit an unexpected error loading this page. You can try again or return home.",
    retry: "Try again",
    home: "Home",
    browse: "Browse",
    movies: "Movies",
    series: "TV series",
    celebrities: "People",
    blog: "Blog",
  },
} as const;

function localeFromDocument(): Locale {
  if (typeof document === "undefined") return "tr";
  return document.documentElement.lang === "en" ? "en" : "tr";
}

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useMemo(() => localeFromDocument(), []);
  const s = DICT[locale];

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[AppError]", error);
    }
  }, [error]);

  const devDetail =
    process.env.NODE_ENV === "development" && error.message?.trim()
      ? error.message
      : null;

  return (
    <IssuePageShell
      code="500"
      eyebrow={s.pageTitle}
      title={s.title}
      message={s.message}
      hint={
        devDetail
          ? `${locale === "en" ? "Development detail" : "Geliştirme ayrıntısı"}: ${devDetail}`
          : undefined
      }
      primaryLabel={s.retry}
      onPrimaryClick={reset}
      secondaryLabel={s.home}
      secondaryHref="/"
      navLabel={s.browse}
      navItems={[
        { href: "/movies", label: s.movies },
        { href: "/series", label: s.series },
        { href: "/celebrities", label: s.celebrities },
        { href: "/blog", label: s.blog },
      ]}
    />
  );
}
