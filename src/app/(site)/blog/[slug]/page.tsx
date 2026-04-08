import { BlogArticleActions } from "@/components/blog/BlogArticleActions";
import { PageHero } from "@/components/PageHero";
import { readPosts } from "@/lib/data-file";
import {
  estimateReadingMinutes,
  formatBlogDate,
  formatReadingTime,
  getAdjacentPosts,
  relatedPosts,
  sortPostsByDateDesc,
} from "@/lib/blog-utils";
import { getLocale, t } from "@/lib/i18n";
import { buildDetailMetadata } from "@/lib/seo/metadata";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = await readPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post)
    return { title: "Not found", robots: { index: false, follow: false } };
  const published =
    post.date && !Number.isNaN(Date.parse(post.date))
      ? new Date(post.date).toISOString()
      : undefined;
  return buildDetailMetadata({
    title: post.title,
    description: post.excerpt,
    pathname: `/blog/${slug}`,
    image: post.cover || null,
    type: "article",
    publishedTime: published,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const posts = await readPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const locale = await getLocale();
  const s = t(locale);
  const sorted = sortPostsByDateDesc(posts);
  const { older, newer } = getAdjacentPosts(sorted, slug);
  const related = relatedPosts(sorted, slug, 3);
  const minutes = estimateReadingMinutes(post);

  return (
    <>
      <PageHero
        title={post.title}
        crumbs={[
          { label: s.crumbs.home, href: "/" },
          { label: s.nav.blog, href: "/blog" },
          { label: post.title },
        ]}
      />
      <article className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <Link
          href="/blog"
          className="inline-flex text-sm font-medium text-[var(--cv-accent)] hover:underline"
        >
          ← {s.blog.backToBlog}
        </Link>

        <div className="mt-6 flex flex-col gap-4 border-b border-[var(--cv-border)] pb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="text-sm text-[var(--cv-muted)]">
            <time dateTime={post.date}>
              {formatBlogDate(post.date, locale)}
            </time>
            <span className="mx-2 text-[var(--cv-border-strong)]">·</span>
            <span>
              {s.blog.author}:{" "}
              <span className="font-medium text-[var(--cv-accent)]">
                {post.author}
              </span>
            </span>
            <span className="mx-2 text-[var(--cv-border-strong)]">·</span>
            <span>
              {s.blog.readingTimeLabel}: {formatReadingTime(minutes, locale)}
            </span>
          </div>
          <BlogArticleActions
            title={post.title}
            labels={{
              copyLink: s.blog.copyLink,
              copied: s.blog.copied,
              share: s.blog.share,
            }}
          />
        </div>

        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl border border-[var(--cv-border)] shadow-lg">
          <Image
            src={post.cover}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width:768px) 100vw, 768px"
          />
        </div>

        <p className="mt-8 text-lg font-medium leading-relaxed text-[var(--cv-heading)] md:text-xl">
          {post.excerpt}
        </p>

        {post.body ? (
          <div className="mt-10 space-y-5 text-base leading-[1.75] text-[var(--cv-body)] md:text-[1.05rem]">
            {post.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : null}

        {post.tags?.length ? (
          <div className="mt-10 border-t border-[var(--cv-border)] pt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--cv-muted)]">
              {s.blog.tags}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-block rounded-full border border-[var(--cv-border-strong)] bg-[var(--cv-card)] px-3 py-1 text-sm text-[var(--cv-heading)]">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <nav
          className="mt-12 grid gap-4 border-t border-[var(--cv-border)] pt-8 sm:grid-cols-2"
          aria-label={locale === "tr" ? "Yazı gezintisi" : "Post navigation"}
        >
          <div>
            {older ? (
              <Link
                href={`/blog/${older.slug}`}
                className="group block rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 transition hover:border-[var(--cv-accent)]/40"
              >
                <p className="text-xs font-bold uppercase text-[var(--cv-faint)]">
                  {s.blog.olderPost}
                </p>
                <p className="mt-1 font-[family-name:var(--font-dosis)] font-semibold text-[var(--cv-heading)] group-hover:text-[var(--cv-accent)]">
                  {older.title}
                </p>
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-[var(--cv-border)] p-4 text-sm text-[var(--cv-faint)]">
                {locale === "tr" ? "Önceki yazı yok." : "No older post."}
              </div>
            )}
          </div>
          <div className="sm:text-right">
            {newer ? (
              <Link
                href={`/blog/${newer.slug}`}
                className="group block rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] p-4 transition hover:border-[var(--cv-accent)]/40 sm:ml-auto sm:max-w-full"
              >
                <p className="text-xs font-bold uppercase text-[var(--cv-faint)]">
                  {s.blog.newerPost}
                </p>
                <p className="mt-1 font-[family-name:var(--font-dosis)] font-semibold text-[var(--cv-heading)] group-hover:text-[var(--cv-accent)]">
                  {newer.title}
                </p>
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-[var(--cv-border)] p-4 text-sm text-[var(--cv-faint)] sm:ml-auto">
                {locale === "tr" ? "Daha yeni yazı yok." : "No newer post."}
              </div>
            )}
          </div>
        </nav>

        {related.length > 0 ? (
          <section className="mt-14 border-t border-[var(--cv-border)] pt-10">
            <h2 className="font-[family-name:var(--font-dosis)] text-xl font-bold uppercase tracking-wide text-[var(--cv-heading)]">
              {s.blog.relatedPosts}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group block overflow-hidden rounded-lg border border-[var(--cv-border)] bg-[var(--cv-card)] transition hover:border-[var(--cv-accent)]/35"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={r.cover}
                        alt=""
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width:640px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-[var(--cv-muted)]">
                        {formatBlogDate(r.date, locale)}
                      </p>
                      <p className="mt-1 line-clamp-2 font-[family-name:var(--font-dosis)] text-sm font-bold text-[var(--cv-heading)] group-hover:text-[var(--cv-accent)]">
                        {r.title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
