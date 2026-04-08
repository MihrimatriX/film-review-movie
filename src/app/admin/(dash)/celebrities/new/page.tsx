import { CelebrityForm } from "@/components/CelebrityForm";

export default function NewCelebrityPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        New celebrity
      </h1>
      <div className="mt-8">
        <CelebrityForm mode="create" />
      </div>
    </div>
  );
}
