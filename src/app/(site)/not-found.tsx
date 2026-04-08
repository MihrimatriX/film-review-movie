import { NotFoundPage } from "@/components/NotFoundPage";
import { getLocale } from "@/lib/i18n";

/** İçerik layout’tan `SiteChrome` alır; segment metadata yok (MetadataOutlet hidrasyonu). */
export default async function SiteNotFound() {
  const locale = await getLocale();
  return <NotFoundPage locale={locale} showLogo={false} />;
}
