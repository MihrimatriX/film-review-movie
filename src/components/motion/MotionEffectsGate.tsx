"use client";

import dynamic from "next/dynamic";

const MotionEffects = dynamic(
  () =>
    import("@/components/motion/MotionEffects").then((m) => ({
      default: m.MotionEffects,
    })),
  { ssr: false },
);

export function MotionEffectsGate() {
  return <MotionEffects />;
}
