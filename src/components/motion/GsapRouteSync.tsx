"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GsapRouteSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    queueMicrotask(() => ScrollTrigger.refresh());
  }, [pathname]);

  return null;
}
