import { BlogFeed } from "@/components/blog/BlogFeed";
import { PageHero } from "@/components/PageHero";
import { readPosts } from "@/lib/data-file";
import { getLocale, t } from "@/lib/i18n";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  return buildDetailMetadata({
    title: s.blog.gridTitle,
    description: s.seo.blogIndexDescription,
    pathname: "/blog",
  });
}

export default async function BlogPage() {
  const posts = await readPosts();
  const locale = await getLocale();
  const s = t(locale);

  return (
    <>
      <PageHero
        title={s.blog.gridTitle}
        crumbs={[{ label: s.crumbs.home, href: "/" }, { label: s.nav.blog }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--cv-muted)]">
          {locale === "tr"
            ? "Yazıları ızgara veya liste olarak görüntüleyin; üstteki arama ile başlık, özet veya etikete göre süzebilirsiniz."
            : "Browse posts in grid or list layout. Use the search bar to filter by title, excerpt, or tags."}
        </p>
        <BlogFeed
          posts={posts}
          locale={locale}
          variant="grid"
          gridHref="/blog"
          listHref="/blog/list"
          labels={{
            searchPlaceholder: s.blog.searchPlaceholder,
            postsSummary: s.blog.postsSummary,
            noMatches: s.blog.noMatches,
            viewGrid: s.blog.viewGrid,
            viewList: s.blog.viewList,
            readMore: s.blog.readMore,
            author: s.blog.author,
            tags: s.blog.tags,
          }}
        />
      </div>
    </>
  );
}
