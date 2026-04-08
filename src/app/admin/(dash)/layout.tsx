import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/movies", label: "Movies" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/celebrities", label: "Celebrities" },
  { href: "/admin/series", label: "Series" },
  { href: "/admin/user", label: "User demo" },
];

export default function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen text-[var(--cv-heading)]">
      <aside className="hidden w-52 shrink-0 border-r border-[var(--cv-border)] bg-[var(--cv-mid)] p-4 md:block">
        <p className="font-[family-name:var(--font-dosis)] text-lg font-bold uppercase text-[var(--cv-accent)]">
          Admin
        </p>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded px-3 py-2 text-sm text-[var(--cv-muted)] hover:bg-[var(--cv-card)] hover:text-[var(--cv-heading)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-4 rounded px-3 py-2 text-sm text-[var(--cv-faint)] hover:text-[var(--cv-accent)]"
          >
            ← Site
          </Link>
        </nav>
        <div className="mt-6 border-t border-[var(--cv-border)] pt-4">
          <p className="mb-2 text-[10px] uppercase text-[var(--cv-faint)]">
            Tema
          </p>
          <ThemeToggle />
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[var(--cv-border)] bg-[var(--cv-mid)] px-4 py-3 md:hidden">
          <div className="flex flex-wrap items-center gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded bg-[var(--cv-card)] px-3 py-1 text-xs text-[var(--cv-heading)]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded px-3 py-1 text-xs text-[var(--cv-muted)]"
            >
              Site
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
