import { PageHeroMotion } from "@/components/motion/PageHeroMotion";

import type { PageHeroCrumb } from "./page-hero-types";

export type { PageHeroCrumb as Crumb };

export function PageHero({
  title,
  crumbs,
}: {
  title: string;
  crumbs: PageHeroCrumb[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--cv-border)] bg-[var(--cv-mid)] py-5 md:py-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--cv-accent)_55%,transparent)] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-[20%] top-[-60%] h-[140%] w-[70%] rounded-full bg-[color-mix(in_srgb,var(--cv-accent)_14%,transparent)] blur-[64px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[10%] bottom-[-80%] h-[120%] w-[55%] rounded-full bg-[color-mix(in_srgb,var(--cv-red)_10%,transparent)] blur-[56px]"
        aria-hidden
      />
      <PageHeroMotion title={title} crumbs={crumbs} />
    </section>
  );
}
