"use client";

import { useSearchParams } from "next/navigation";
import { cloneElement, Suspense, type ReactElement } from "react";

type Sp = Record<string, string | string[] | undefined>;

function Inject({ children }: { children: ReactElement<{ sp?: Sp }> }) {
  const params = useSearchParams();
  const sp: Sp = {};
  for (const key of new Set(params.keys())) {
    const all = params.getAll(key);
    sp[key] = all.length > 1 ? all : all[0];
  }
  return cloneElement(children, { sp });
}

/**
 * Listeleme görünümüne URL sorgu parametrelerini (`sp`) tarayıcıda verir.
 * Statik export'ta (GitHub Pages) sunucu `searchParams` okuyamaz; HTML varsayılan
 * listeyle (fallback) gelir, istemci açılınca filtre/sıralama/sayfa uygulanır.
 */
export function WithSearchParams({
  children,
}: {
  children: ReactElement<{ sp?: Sp }>;
}) {
  return (
    <Suspense fallback={children}>
      <Inject>{children}</Inject>
    </Suspense>
  );
}
