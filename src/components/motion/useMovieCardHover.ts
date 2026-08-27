"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

/**
 * Lift + subtle 3D tilt + poster zoom on hover. Respects `prefers-reduced-motion`.
 */
export function useMovieCardHover(
  rootRef: RefObject<HTMLElement | null>,
  liftRef: RefObject<HTMLElement | null>,
  posterInnerRef: RefObject<HTMLElement | null>,
) {
  useGSAP(
    () => {
      const root = rootRef.current;
      const lift = liftRef.current;
      const poster = posterInnerRef.current;
      if (!root || !lift || !poster) return;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(lift, { transformOrigin: "50% 50%" });

      if (reduced) {
        const enter = () => {
          gsap.to(lift, {
            y: -4,
            scale: 1.02,
            duration: 0.32,
            ease: "power2.out",
          });
        };
        const leave = () => {
          gsap.to(lift, {
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          });
        };
        root.addEventListener("mouseenter", enter);
        root.addEventListener("mouseleave", leave);
        return () => {
          root.removeEventListener("mouseenter", enter);
          root.removeEventListener("mouseleave", leave);
          gsap.killTweensOf(lift);
        };
      }

      const rotXTo = gsap.quickTo(lift, "rotationX", {
        duration: 0.55,
        ease: "power3.out",
      });
      const rotYTo = gsap.quickTo(lift, "rotationY", {
        duration: 0.55,
        ease: "power3.out",
      });

      const onMove = (e: MouseEvent) => {
        const r = root.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotYTo(px * 13);
        rotXTo(-py * 11);
      };

      const enter = () => {
        gsap.to(lift, {
          y: -9,
          scale: 1.035,
          duration: 0.42,
          ease: "back.out(1.35)",
        });
        gsap.to(poster, {
          scale: 1.09,
          duration: 0.55,
          ease: "power2.out",
        });
      };

      const leave = () => {
        rotXTo(0);
        rotYTo(0);
        gsap.to(lift, {
          y: 0,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          duration: 0.52,
          ease: "power3.out",
        });
        gsap.to(poster, {
          scale: 1,
          duration: 0.48,
          ease: "power3.out",
        });
      };

      root.addEventListener("mouseenter", enter);
      root.addEventListener("mouseleave", leave);
      root.addEventListener("mousemove", onMove);

      return () => {
        root.removeEventListener("mouseenter", enter);
        root.removeEventListener("mouseleave", leave);
        root.removeEventListener("mousemove", onMove);
        gsap.killTweensOf([lift, poster]);
      };
    },
    { dependencies: [] },
  );
}
