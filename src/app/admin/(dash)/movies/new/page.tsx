import { MovieForm } from "@/components/MovieForm";

export default function NewMoviePage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        New movie
      </h1>
      <div className="mt-8">
        <MovieForm mode="create" />
      </div>
    </div>
  );
}
