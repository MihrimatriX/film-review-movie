import { DeleteAdminResourceButton } from "@/components/DeleteAdminResourceButton";
import { readPosts } from "@/lib/data-file";
import Link from "next/link";

export default async function AdminPostsPage() {
  const posts = await readPosts();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
          Blog posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded bg-[var(--cv-red)] px-4 py-2 text-sm font-bold uppercase text-[var(--cv-on-red)]"
        >
          New post
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded border border-[var(--cv-border)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--cv-border)] bg-[var(--cv-card)] text-xs uppercase text-[var(--cv-muted)]">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Date</th>
              <th className="p-3">Author</th>
              <th className="p-3">Slug</th>
              <th className="p-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[var(--cv-border)]/60 hover:bg-[var(--cv-input)]/80"
              >
                <td className="p-3 font-medium text-[var(--cv-heading)]">
                  {p.title}
                </td>
                <td className="p-3 text-[var(--cv-muted)]">{p.date}</td>
                <td className="p-3 text-[var(--cv-muted)]">{p.author}</td>
                <td className="p-3 text-[var(--cv-faint)]">{p.slug}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="text-xs text-[var(--cv-accent)] hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteAdminResourceButton
                      apiUrl={`/api/admin/posts/${p.id}`}
                      label={p.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
