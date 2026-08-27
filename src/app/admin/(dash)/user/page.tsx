import { UserDataForm } from "@/components/UserDataForm";
import { readUserData } from "@/lib/data-file";

export default async function AdminUserPage() {
  const data = await readUserData();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        Demo user / community data
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--cv-muted)]">
        Profil, favori film slug’ları ve puanlar{" "}
        <code className="text-[var(--cv-accent)]">data/user.json</code>{" "}
        dosyasına yazılır. Slug’lar mevcut filmlerle eşleşmelidir.
      </p>
      <div className="mt-8">
        <UserDataForm initial={data} />
      </div>
    </div>
  );
}
