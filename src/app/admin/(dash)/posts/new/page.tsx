import { BlogPostForm } from "@/components/BlogPostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        New blog post
      </h1>
      <div className="mt-8">
        <BlogPostForm mode="create" />
      </div>
    </div>
  );
}
