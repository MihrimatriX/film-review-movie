import { MovieForm } from "@/components/MovieForm";
import { readMovies } from "@/lib/data-file";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditMoviePage({ params }: Props) {
  const { id } = await params;
  const movies = await readMovies();
  const movie = movies.find((m) => m.id === id);
  if (!movie) notFound();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-dosis)] text-2xl font-bold uppercase text-[var(--cv-heading)]">
        Edit movie
      </h1>
      <div className="mt-8">
        <MovieForm mode="edit" initial={movie} />
      </div>
    </div>
  );
}
