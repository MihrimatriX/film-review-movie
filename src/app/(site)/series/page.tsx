import { getSeriesMerged } from "@/lib/catalog";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { WithSearchParams } from "@/components/WithSearchParams";
import { readSearchParams } from "@/lib/listing-sort";
import { SeriesIndexView } from "./view";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.nav.series,
    description: s.seo.seriesIndexDescription,
    pathname: "/series",
    keywords: [...s.seo.keywords, s.nav.series],
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function SeriesIndexPage({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = await readSearchParams(searchParams);
  const locale = await getLocale();
  const all = await getSeriesMerged(locale);

  return (
    <WithSearchParams>
      <SeriesIndexView
        locale={locale}
        sp={sp}
        all={all}
      />
    </WithSearchParams>
  );
}
