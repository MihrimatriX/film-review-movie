import { SiteChrome } from "@/components/SiteChrome";
import { getLocale } from "@/lib/i18n";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return <SiteChrome locale={locale}>{children}</SiteChrome>;
}
