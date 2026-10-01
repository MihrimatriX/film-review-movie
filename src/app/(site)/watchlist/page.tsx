import { WatchlistView } from "@/components/library/WatchlistView";
import { PageHero } from "@/components/PageHero";
import { getLocale, t } from "@/lib/i18n";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.ui.watchlist,
    description: s.ui.watchlistHint,
    pathname: "/watchlist",
    noindex: true,
  });
}

export default async function WatchlistPage() {
  const locale = await getLocale();
  const s = t(locale);
  return (
    <>
      <PageHero
        title={s.ui.watchlist}
        crumbs={[
          { label: s.crumbs.home, href: "/" },
          { label: s.ui.watchlist },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <WatchlistView />
      </div>
    </>
  );
}
