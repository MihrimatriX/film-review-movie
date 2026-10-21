import { CelebrityForm } from "@/components/CelebrityForm";
import { readCelebrities } from "@/lib/data-file";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditCelebrityPage({ params }: Props) {
  const { id } = await params;
  const list = await readCelebrities();
  const item = list.find((c) => c.id === id);
  if (!item) notFound();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        Edit celebrity
      </h1>
      <div className="mt-8">
        <CelebrityForm mode="edit" initial={item} />
      </div>
    </div>
  );
}
