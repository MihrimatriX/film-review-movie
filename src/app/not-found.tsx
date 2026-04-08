import { NotFoundPage } from "@/components/NotFoundPage";
import { SiteChrome } from "@/components/SiteChrome";
import { getLocale } from "@/lib/i18n";

/**
 * Bu segmentte `metadata` / `generateMetadata` kullanmıyoruz: Next.js dev’de
 * `Next.MetadataOutlet` + Suspense ile hidrasyon uyumsuzluğuna yol açabiliyor.
 * Sekme başlığı: `NotFoundDocumentTitle` (istemci).
 */
export default async function NotFound() {
  const locale = await getLocale();
  return (
    <SiteChrome locale={locale}>
      <NotFoundPage locale={locale} showLogo={false} />
    </SiteChrome>
  );
}
