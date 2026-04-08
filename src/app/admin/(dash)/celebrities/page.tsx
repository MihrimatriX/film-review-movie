import { DeleteAdminResourceButton } from "@/components/DeleteAdminResourceButton";
import { readCelebrities } from "@/lib/data-file";
import Link from "next/link";

export default async function AdminCelebritiesPage() {
  const list = await readCelebrities();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
          Celebrities
        </h1>
        <Link
          href="/admin/celebrities/new"
          className="inline-flex items-center justify-center rounded bg-[var(--cv-red)] px-4 py-2 text-sm font-bold uppercase text-[var(--cv-on-red)]"
        >
          New celebrity
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded border border-[var(--cv-border)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--cv-border)] bg-[var(--cv-card)] text-xs uppercase text-[var(--cv-muted)]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Country</th>
              <th className="p-3">Slug</th>
              <th className="p-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[var(--cv-border)]/60 hover:bg-[var(--cv-input)]/80"
              >
                <td className="p-3 font-medium text-[var(--cv-heading)]">
                  {c.name}
                </td>
                <td className="p-3 text-[var(--cv-muted)]">{c.role}</td>
                <td className="p-3 text-[var(--cv-muted)]">
                  {c.country ?? "—"}
                </td>
                <td className="p-3 text-[var(--cv-faint)]">{c.slug}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/celebrities/${c.id}/edit`}
                      className="text-xs text-[var(--cv-accent)] hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteAdminResourceButton
                      apiUrl={`/api/admin/celebrities/${c.id}`}
                      label={c.name}
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
