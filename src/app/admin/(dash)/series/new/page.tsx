import { SeriesForm } from "@/components/SeriesForm";

export default function NewSeriesPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        New series
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-[var(--cv-muted)]">
        Sezonlar, oyuncular ve küçük görseller JSON alanlarıyla düzenlenir;
        geçersiz JSON kaydetmeyi engeller.
      </p>
      <div className="mt-8">
        <SeriesForm mode="create" />
      </div>
    </div>
  );
}
