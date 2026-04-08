"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

export function useHoverLift(
  rootRef: RefObject<HTMLElement | null>,
  liftRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useGSAP(
    () => {
      const root = rootRef.current;
      const lift = liftRef.current;
      if (!root || !lift) return;
      const enter = () => {
        gsap.to(lift, {
          y: -6,
          scale: 1.03,
          duration: 0.38,
          ease: "back.out(1.45)",
        });
      };
      const leave = () => {
        gsap.to(lift, {
          y: 0,
          scale: 1,
          duration: 0.42,
          ease: "power3.out",
        });
      };
      root.addEventListener("mouseenter", enter);
      root.addEventListener("mouseleave", leave);
      return () => {
        root.removeEventListener("mouseenter", enter);
        root.removeEventListener("mouseleave", leave);
      };
    },
    { dependencies: deps },
  );
}
