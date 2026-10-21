import {
  readCelebrities,
  readMovies,
  readPosts,
  readSeriesList,
} from "@/lib/data-file";
import { adminLogout } from "@/lib/admin-actions";
import Link from "next/link";

export default async function AdminHomePage() {
  const [movies, posts, celebs, series] = await Promise.all([
    readMovies(),
    readPosts(),
    readCelebrities(),
    readSeriesList(),
  ]);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-[var(--cv-muted)]">
        Varsayılan şifre: ortam değişkeni{" "}
        <code className="text-[var(--cv-accent)]">ADMIN_PASSWORD</code> yoksa{" "}
        <code className="text-[var(--cv-accent)]">admin123</code>.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
          <p className="text-3xl font-bold text-[var(--cv-accent)]">
            {movies.length}
          </p>
          <p className="text-sm text-[var(--cv-muted)]">Movies</p>
          <Link
            href="/admin/movies"
            className="mt-2 inline-block text-xs text-[var(--cv-red)] hover:underline"
          >
            Manage →
          </Link>
        </div>
        <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
          <p className="text-3xl font-bold text-[var(--cv-accent)]">
            {posts.length}
          </p>
          <p className="text-sm text-[var(--cv-muted)]">Blog posts</p>
          <Link
            href="/admin/posts"
            className="mt-2 inline-block text-xs text-[var(--cv-red)] hover:underline"
          >
            Manage →
          </Link>
        </div>
        <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
          <p className="text-3xl font-bold text-[var(--cv-accent)]">
            {celebs.length}
          </p>
          <p className="text-sm text-[var(--cv-muted)]">Celebrities</p>
          <Link
            href="/admin/celebrities"
            className="mt-2 inline-block text-xs text-[var(--cv-red)] hover:underline"
          >
            Manage →
          </Link>
        </div>
        <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
          <p className="text-3xl font-bold text-[var(--cv-accent)]">
            {series.length}
          </p>
          <p className="text-sm text-[var(--cv-muted)]">TV series</p>
          <Link
            href="/admin/series"
            className="mt-2 inline-block text-xs text-[var(--cv-red)] hover:underline"
          >
            Manage →
          </Link>
        </div>
        <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
          <p className="text-3xl font-bold text-[var(--cv-accent)]">1</p>
          <p className="text-sm text-[var(--cv-muted)]">Demo user (JSON)</p>
          <Link
            href="/admin/user"
            className="mt-2 inline-block text-xs text-[var(--cv-red)] hover:underline"
          >
            Edit profile / favorites →
          </Link>
        </div>
      </div>
      <form className="mt-10" action={adminLogout}>
        <button
          type="submit"
          className="rounded border border-[var(--cv-border-strong)] px-4 py-2 text-sm text-[var(--cv-muted)] hover:border-[var(--cv-red)] hover:text-[var(--cv-heading)]"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
