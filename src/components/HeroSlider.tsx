"use client";

import type { HeroSlide } from "@/lib/home-hero";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const TAG_PALETTE = [
  "bg-sky-600/90",
  "bg-amber-600/90",
  "bg-emerald-600/90",
  "bg-orange-600/90",
  "bg-violet-600/90",
];

export function HeroSlider({
  slides,
  followUs,
  socialHint,
  trending,
  sliderEmpty,
}: {
  slides: HeroSlide[];
  followUs: string;
  socialHint: string;
  trending: string;
  sliderEmpty: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (headlineRef.current) {
        gsap.from(headlineRef.current.children, {
          opacity: 0,
          y: 18,
          duration: 0.52,
          stagger: 0.09,
          ease: "back.out(1.2)",
        });
      }
      const cards = trackRef.current?.querySelectorAll(".hero-slide-card");
      if (cards?.length) {
        gsap.from(cards, {
          opacity: 0,
          x: 52,
          rotation: 1.8,
          transformOrigin: "50% 50%",
          duration: 0.64,
          stagger: 0.095,
          ease: "back.out(1.12)",
          delay: 0.12,
        });
      }
    },
    { scope: sectionRef, dependencies: [slides.length] },
  );

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const cards = track.querySelectorAll(".hero-slide-card");
      const cleanups: Array<() => void> = [];
      cards.forEach((card) => {
        const inner = card.querySelector(".hero-slide-elevate");
        if (!inner) return;
        const enter = () => {
          gsap.to(inner, {
            y: -8,
            scale: 1.04,
            duration: 0.42,
            ease: "back.out(1.55)",
          });
        };
        const leave = () => {
          gsap.to(inner, {
            y: 0,
            scale: 1,
            duration: 0.48,
            ease: "power3.out",
          });
        };
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope: sectionRef, dependencies: [slides.length] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-[var(--cv-border)] bg-[var(--cv-mid)] py-8"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div
          ref={headlineRef}
          className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-[var(--cv-muted)]">
            <span className="text-[var(--cv-accent)]">{followUs}</span>{" "}
            {socialHint}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cv-muted)]">
            {trending}
          </p>
        </div>
        <div ref={trackRef} className="flex gap-4 overflow-x-auto pb-4">
          {slides.length === 0 && (
            <p className="py-6 text-sm text-[var(--cv-muted)]">{sliderEmpty}</p>
          )}
          {slides.map((s, i) => (
            <div
              key={s.key}
              className="hero-slide-card relative w-[200px] shrink-0 md:w-[240px]"
            >
              <div className="hero-slide-elevate relative aspect-[285/437] overflow-hidden rounded-md will-change-transform">
                <Image
                  src={s.src}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="240px"
                  priority={i < 5}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--cv-hero-scrim-from)] to-transparent p-3 pt-16">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white ${TAG_PALETTE[i % TAG_PALETTE.length]}`}
                  >
                    {s.tag}
                  </span>
                  <h2 className="mt-2 font-[family-name:var(--font-dosis)] text-lg font-bold text-[var(--cv-heading)]">
                    <Link
                      href={s.href}
                      className="hover:text-[var(--cv-accent)]"
                    >
                      {s.title}
                    </Link>
                  </h2>
                  <p className="text-xs text-[var(--cv-accent)]">
                    ★{" "}
                    <span className="text-[var(--cv-heading)]">{s.rating}</span>
                    <span className="text-[var(--cv-muted)]"> /10</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
