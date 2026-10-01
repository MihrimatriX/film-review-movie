"use client";

import Image from "next/image";
import { useRef } from "react";

/** Detay sayfası posteri: imleçle eğilen, ışık yansımalı büyük 3D poster. */
export function TiltPoster({
  src,
  alt,
  rating,
}: {
  src: string;
  alt: string;
  rating: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", ((0.5 - py) * 14).toFixed(2));
      el.style.setProperty("--ry", ((px - 0.5) * 16).toFixed(2));
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty(
        "--hyp",
        Math.min(Math.hypot(px - 0.5, py - 0.5) * 2, 1).toFixed(3),
      );
      el.dataset.active = "true";
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0");
    el.style.setProperty("--ry", "0");
    el.dataset.active = "false";
  };

  return (
    <div
      ref={ref}
      className="card3d tilt-poster mx-auto w-full max-w-sm shrink-0 lg:mx-0"
      data-rare={rating >= 8}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="card3d-shadow" aria-hidden />
      <div className="card3d-body">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-[var(--cv-border)] shadow-2xl">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width:1024px) 100vw, 400px"
          />
          {rating >= 8 ? <div className="card3d-holo" aria-hidden /> : null}
          <div className="card3d-glare" aria-hidden />
        </div>
      </div>
    </div>
  );
}
