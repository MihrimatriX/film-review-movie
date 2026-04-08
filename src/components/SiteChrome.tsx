import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SuppressContextMenu } from "@/components/SuppressContextMenu";
import { TmdbSetupBanner } from "@/components/TmdbSetupBanner";
import { t, type Locale } from "@/lib/i18n";

/**
 * Ortak üst/alt çerçeve — `(site)` layout ve kök `not-found` aynı görünümü paylaşsın
 * (bilinmeyen URL’ler `(site)/layout.tsx`’e düşmez).
 *
 * Senkron tutulur: iç içe async RSC + `not-found` segmentinde MetadataOutlet hidrasyon uyumsuzluğunu azaltır.
 */
export function SiteChrome({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const s = t(locale);

  return (
    <>
      <SuppressContextMenu />
      <SiteHeader
        locale={locale}
        nav={{
          home: s.nav.home,
          movies: s.nav.movies,
          series: s.nav.series,
          celebrities: s.nav.celebrities,
          blog: s.nav.blog,
          community: s.nav.community,
        }}
        admin={s.nav.admin}
        searchPlaceholder={s.common.searchPlaceholder}
        searchScope={{
          all: s.header.searchScopeAll,
          movies: s.header.searchScopeMovies,
          tv: s.header.searchScopeTv,
          year: s.header.searchScopeYear,
          actor: s.header.searchScopeActor,
          director: s.header.searchScopeDirector,
          people: s.header.searchScopePeople,
        }}
        searchLabels={{
          searchNoResults: s.header.searchNoResults,
          searchLoading: s.header.searchLoading,
          searchSeeAllMovies: s.header.searchSeeAllMovies,
          searchSeeAllSeries: s.header.searchSeeAllSeries,
          searchSeeAllPeople: s.header.searchSeeAllPeople,
          searchSubmit: s.header.searchSubmit,
          searchPanelAll: s.header.searchPanelAll,
          searchPanelMovies: s.header.searchPanelMovies,
          searchPanelTv: s.header.searchPanelTv,
          searchPanelYear: s.header.searchPanelYear,
          searchPanelActor: s.header.searchPanelActor,
          searchPanelDirector: s.header.searchPanelDirector,
          searchPanelPeople: s.header.searchPanelPeople,
          searchHintAll: s.header.searchHintAll,
          searchHintMovies: s.header.searchHintMovies,
          searchHintTv: s.header.searchHintTv,
          searchHintYear: s.header.searchHintYear,
          searchHintActor: s.header.searchHintActor,
          searchHintDirector: s.header.searchHintDirector,
          searchHintPeople: s.header.searchHintPeople,
          searchYearMovies: s.header.searchYearMovies,
          searchYearSeries: s.header.searchYearSeries,
          searchCastMovies: s.header.searchCastMovies,
          searchCastSeries: s.header.searchCastSeries,
          searchDirMovies: s.header.searchDirMovies,
          searchDirSeries: s.header.searchDirSeries,
        }}
        menuAria={s.header.menu}
      />
      <TmdbSetupBanner locale={locale} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <SiteFooter locale={locale} />
    </>
  );
}
