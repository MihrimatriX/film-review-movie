import { Suspense } from "react";
import type { ListingSortOption } from "@/components/ListingSortSelect";
import { ListingSortSelect } from "@/components/ListingSortSelect";

function SortFallback() {
  return (
    <div className="h-9 min-w-[10.5rem] animate-pulse rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)]" />
  );
}

export function ListingSortSelectBoundary({
  options,
  currentValue,
}: {
  options: ListingSortOption[];
  currentValue: string;
}) {
  return (
    <Suspense fallback={<SortFallback />}>
      <ListingSortSelect options={options} currentValue={currentValue} />
    </Suspense>
  );
}
