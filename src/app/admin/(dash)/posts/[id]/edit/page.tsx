import { BlogPostForm } from "@/components/BlogPostForm";
import { readPosts } from "@/lib/data-file";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const posts = await readPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        Edit blog post
      </h1>
      <div className="mt-8">
        <BlogPostForm mode="edit" initial={post} />
      </div>
    </div>
  );
}
