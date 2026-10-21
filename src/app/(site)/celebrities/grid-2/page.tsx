import { getCelebritiesMerged } from "@/lib/catalog";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { WithSearchParams } from "@/components/WithSearchParams";
import { readSearchParams } from "@/lib/listing-sort";
import { CelebritiesGrid02View } from "./view";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.celebritiesPage.gridTitleAlt,
    description: s.seo.celebritiesGrid2Description,
    pathname: "/celebrities/grid-2",
    keywords: [...s.seo.keywords, s.nav.celebrities],
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function CelebritiesGrid02Page({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = await readSearchParams(searchParams);
  const locale = await getLocale();
  const all = await getCelebritiesMerged(locale);

  return (
    <WithSearchParams>
      <CelebritiesGrid02View
        locale={locale}
        sp={sp}
        all={all}
      />
    </WithSearchParams>
  );
}
