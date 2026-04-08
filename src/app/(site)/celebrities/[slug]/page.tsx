import { CelebrityPortraitImage } from "@/components/CelebrityPortraitImage";
import { PageHero } from "@/components/PageHero";
import { pickCelebrityImageSrc } from "@/lib/celebrity-image";
import { getCelebrityBySlugMerged } from "@/lib/catalog";
import { getLocale, t } from "@/lib/i18n";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const c = await getCelebrityBySlugMerged(locale, slug);
  if (!c)
    return { title: "Not found", robots: { index: false, follow: false } };
  const desc =
    c.bio?.slice(0, 400) ||
    [c.role, c.country].filter(Boolean).join(" · ") ||
    c.name;
  return buildDetailMetadata({
    title: c.name,
    description: desc,
    pathname: `/celebrities/${slug}`,
    image: c.imageGrid2 ?? c.image ?? null,
  });
}

export default async function CelebritySinglePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = t(locale);
  const c = await getCelebrityBySlugMerged(locale, slug);
  if (!c) notFound();

  const crumbHome = locale === "en" ? "Home" : dict.crumbs.home;
  const crumbCelebs = dict.celebritiesPage.crumb;
  const backLabel = locale === "en" ? "← All celebrities" : "← Tüm ünlüler";

  return (
    <>
      <PageHero
        title={c.name}
        crumbs={[
          { label: crumbHome, href: "/" },
          { label: crumbCelebs, href: "/celebrities" },
          { label: c.name },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-xs shrink-0 overflow-hidden rounded-lg border border-[var(--cv-border)] lg:mx-0">
            <CelebrityPortraitImage
              initialSrc={pickCelebrityImageSrc(c, "detail")}
              alt={c.name}
              fill
              sizes="(max-width:1024px) 100vw, 400px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm uppercase text-[var(--cv-accent)]">
              {c.role?.trim() ? c.role : "—"}
              {c.country ? ` · ${c.country}` : ""}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-dosis)] text-4xl font-bold text-[var(--cv-heading)]">
              {c.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded border border-[var(--cv-border-strong)] px-3 py-1 text-sm text-[var(--cv-muted)]">
                ♥ Add to favorites
              </span>
              <span className="rounded border border-[var(--cv-border-strong)] px-3 py-1 text-sm text-[var(--cv-muted)]">
                ↗ Share
              </span>
            </div>
            <p className="mt-8 leading-relaxed text-[var(--cv-body)]">
              {c.bio?.trim() ? c.bio : dict.celebritiesPage.bioPlaceholder}
            </p>
            <Link
              href="/celebrities"
              className="mt-8 inline-block text-[var(--cv-accent)] hover:underline"
            >
              {backLabel}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
