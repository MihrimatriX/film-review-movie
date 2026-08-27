import { IssuePageShell } from "@/components/IssuePageShell";
import { NotFoundDocumentTitle } from "@/components/NotFoundDocumentTitle";
import { t, type Locale } from "@/lib/i18n";

/**
 * Senkron sunucu bileşeni — `not-found` sayfalarında üst seviyede `await getLocale()`
 * ile çağrılmalı. İçeride async alt ağaç, MetadataOutlet ile hidrasyon uyumsuzluğuna yol açabiliyor.
 */
export function NotFoundPage({
  locale,
  showLogo = true,
}: {
  locale: Locale;
  showLogo?: boolean;
}) {
  const n = t(locale).notFound;

  return (
    <>
      <NotFoundDocumentTitle title={`${n.pageTitle} | Film Review`} />
      <IssuePageShell
      code="404"
      eyebrow={n.eyebrow}
      title={n.title}
      message={n.message}
      hint={n.hint}
      showLogo={showLogo}
      primaryLabel={n.home}
      primaryHref="/"
      navLabel={n.browse}
      navItems={[
        { href: "/movies", label: n.movies },
        { href: "/series", label: n.series },
        { href: "/celebrities", label: n.celebrities },
        { href: "/blog", label: n.blog },
      ]}
      />
    </>
  );
}
