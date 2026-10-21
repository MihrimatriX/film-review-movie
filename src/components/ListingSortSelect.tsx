"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

export type ListingSortOption = { value: string; label: string };

export function ListingSortSelect({
  paramName = "sort",
  options,
  currentValue,
  className = "",
}: {
  paramName?: string;
  options: ListingSortOption[];
  currentValue: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const selectClass = useMemo(
    () =>
      [
        "min-w-[10.5rem] rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-2 py-1.5 text-sm text-[var(--cv-heading)]",
        pending ? "opacity-70" : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [pending, className],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = new URLSearchParams(searchParams?.toString() ?? "");
      const v = e.target.value;
      if (v) next.set(paramName, v);
      else next.delete(paramName);
      const qs = next.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [pathname, router, searchParams, paramName],
  );

  return (
    <select
      className={selectClass}
      value={currentValue}
      onChange={onChange}
      aria-busy={pending}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
