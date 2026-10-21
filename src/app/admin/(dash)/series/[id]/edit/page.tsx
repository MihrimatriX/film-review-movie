import { SeriesForm } from "@/components/SeriesForm";
import { readSeriesList } from "@/lib/data-file";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditSeriesPage({ params }: Props) {
  const { id } = await params;
  const list = await readSeriesList();
  const item = list.find((s) => s.id === id);
  if (!item) notFound();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        Edit series
      </h1>
      <div className="mt-8">
        <SeriesForm mode="edit" initial={item} />
      </div>
    </div>
  );
}
