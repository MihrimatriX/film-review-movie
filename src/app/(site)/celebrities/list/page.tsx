import { getCelebritiesMerged } from "@/lib/catalog";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { WithSearchParams } from "@/components/WithSearchParams";
import { readSearchParams } from "@/lib/listing-sort";
import { CelebritiesListView } from "./view";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.celebritiesPage.listTitle,
    description: s.seo.celebritiesListDescription,
    pathname: "/celebrities/list",
    keywords: [...s.seo.keywords, s.nav.celebrities],
  });
}

type Sp = Record<string, string | string[] | undefined>;

export default async function CelebritiesListPage({
  searchParams,
}: {
  searchParams?: Promise<Sp>;
}) {
  const sp = await readSearchParams(searchParams);
  const locale = await getLocale();
  const all = await getCelebritiesMerged(locale);

  return (
    <WithSearchParams>
      <CelebritiesListView
        locale={locale}
        sp={sp}
        all={all}
      />
    </WithSearchParams>
  );
}
