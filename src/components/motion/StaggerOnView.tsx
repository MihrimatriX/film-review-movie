"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function StaggerOnView({
  children,
  className,
  itemSelector = ".cv-stagger-item",
}: {
  children: ReactNode;
  className?: string;
  itemSelector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const items = el.querySelectorAll(itemSelector);
      if (!items.length) return;

      gsap.from(items, {
        opacity: 0,
        y: 28,
        rotation: (i) => (i % 2 === 0 ? -1.4 : 1.4),
        transformOrigin: "50% 100%",
        duration: 0.55,
        stagger: 0.05,
        ease: "back.out(1.15)",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
