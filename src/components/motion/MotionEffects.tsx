"use client";

import { CustomCursor } from "@/components/motion/CustomCursor";
import { GsapRouteSync } from "@/components/motion/GsapRouteSync";

/** GSAP + cursor: loaded client-only via `next/dynamic` in root layout to trim SSR work and defer main-thread cost. */
export function MotionEffects() {
  return (
    <>
      <GsapRouteSync />
      <CustomCursor />
    </>
  );
}
