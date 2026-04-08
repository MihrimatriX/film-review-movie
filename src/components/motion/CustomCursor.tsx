"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

const INTERACTIVE_SEL = [
  "a[href]",
  "button:not([disabled])",
  '[role="button"]',
  'input[type="submit"]',
  'input[type="button"]',
  "select",
  "label[for]",
  ".hero-slide-card",
  ".in-theater-card",
  ".cv-card-hover",
  "[data-cursor-hover]",
].join(",");

const TEXT_SEL = [
  "textarea",
  'input[type="text"]',
  'input[type="email"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="url"]',
  'input[type="tel"]',
  'input[type="number"]',
  "input:not([type])",
].join(", ");

function spawnContextMenuRipple(clientX: number, clientY: number) {
  const mkRing = (opts: {
    size: number;
    borderWidth: number;
    delay: number;
    duration: number;
    endScale: number;
    rotation: number;
  }) => {
    const el = document.createElement("div");
    el.setAttribute("data-cv-context-ripple", "");
    el.style.cssText = [
      "position:fixed",
      "left:0",
      "top:0",
      "pointer-events:none",
      `width:${opts.size}px`,
      `height:${opts.size}px`,
      "margin:0",
      "padding:0",
      "border-radius:9999px",
      `border:${opts.borderWidth}px solid var(--cv-accent)`,
      "box-shadow:0 0 22px color-mix(in srgb, var(--cv-accent) 42%, transparent)",
      "z-index:10049",
      "will-change:transform,opacity",
    ].join(";");
    document.body.appendChild(el);
    gsap.set(el, {
      x: clientX,
      y: clientY,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "50% 50%",
    });
    gsap.fromTo(
      el,
      { scale: 0.28, opacity: 0.88, rotate: 0 },
      {
        scale: opts.endScale,
        opacity: 0,
        rotate: opts.rotation,
        duration: opts.duration,
        delay: opts.delay,
        ease: "power3.out",
        onComplete: () => el.remove(),
      },
    );
  };

  mkRing({
    size: 52,
    borderWidth: 2,
    delay: 0,
    duration: 0.62,
    endScale: 3.4,
    rotation: 18,
  });
  mkRing({
    size: 72,
    borderWidth: 1,
    delay: 0.04,
    duration: 0.72,
    endScale: 3.1,
    rotation: -14,
  });
}

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ hovering: false, text: false });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!fine || reduced || !outer || !inner) return;

    document.body.dataset.customCursor = "1";

    gsap.set([outer, inner], { xPercent: -50, yPercent: -50 });
    gsap.to([outer, inner], { opacity: 1, duration: 0.35, ease: "power2.out" });

    const xOuter = gsap.quickTo(outer, "x", {
      duration: 0.52,
      ease: "power3.out",
    });
    const yOuter = gsap.quickTo(outer, "y", {
      duration: 0.52,
      ease: "power3.out",
    });
    const xInner = gsap.quickTo(inner, "x", {
      duration: 0.28,
      ease: "power3.out",
    });
    const yInner = gsap.quickTo(inner, "y", {
      duration: 0.28,
      ease: "power3.out",
    });

    const applyVisual = () => {
      const { hovering, text } = stateRef.current;
      if (text) {
        gsap.to(outer, {
          scale: 0.2,
          opacity: 0.35,
          duration: 0.22,
          ease: "power2.out",
        });
        gsap.to(inner, { scale: 0.25, opacity: 0.85, duration: 0.2 });
        return;
      }
      gsap.to(outer, {
        scale: hovering ? 1.55 : 1,
        opacity: 1,
        duration: 0.38,
        ease: "back.out(1.6)",
      });
      gsap.to(inner, {
        scale: hovering ? 0.35 : 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMove = (e: MouseEvent) => {
      xOuter(e.clientX);
      yOuter(e.clientY);
      xInner(e.clientX);
      yInner(e.clientY);

      const under = document.elementFromPoint(e.clientX, e.clientY);
      const textHit = Boolean(under?.closest(TEXT_SEL));
      const hoverHit = textHit
        ? false
        : Boolean(under?.closest(INTERACTIVE_SEL));

      if (
        stateRef.current.text !== textHit ||
        stateRef.current.hovering !== hoverHit
      ) {
        stateRef.current = { hovering: hoverHit, text: textHit };
        applyVisual();
      }
    };

    const pulseAfterContextMenu = () => {
      const { hovering, text } = stateRef.current;
      if (text) {
        gsap
          .timeline()
          .to(outer, {
            scale: 0.32,
            duration: 0.11,
            ease: "power2.out",
          })
          .to(outer, {
            scale: 0.2,
            opacity: 0.35,
            duration: 0.38,
            ease: "elastic.out(1, 0.65)",
          });
        gsap
          .timeline()
          .to(inner, { scale: 0.55, duration: 0.1 })
          .to(inner, { scale: 0.25, duration: 0.32, ease: "power2.out" });
        return;
      }
      const base = hovering ? 1.55 : 1;
      gsap
        .timeline()
        .to(outer, {
          scale: base * 1.22,
          duration: 0.11,
          ease: "power2.out",
        })
        .to(outer, {
          scale: base,
          duration: 0.48,
          ease: "elastic.out(1, 0.48)",
        });
      gsap
        .timeline()
        .to(inner, {
          scale: Math.max(0.45, hovering ? 0.5 : 1.15),
          duration: 0.1,
        })
        .to(inner, {
          scale: hovering ? 0.35 : 1,
          duration: 0.38,
          ease: "back.out(1.85)",
        });
    };

    const onContextMenu = (e: MouseEvent) => {
      spawnContextMenuRipple(e.clientX, e.clientY);
      pulseAfterContextMenu();
    };

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const { hovering, text } = stateRef.current;
      gsap.to(outer, {
        scale: text ? 0.12 : hovering ? 1.2 : 0.75,
        duration: 0.1,
        ease: "power2.in",
      });
      gsap.to(inner, { scale: 0.5, duration: 0.08 });
    };

    const onUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const { hovering, text } = stateRef.current;
      if (text) {
        gsap.to(outer, {
          scale: 0.2,
          opacity: 0.35,
          duration: 0.35,
          ease: "elastic.out(1, 0.6)",
        });
        gsap.to(inner, { scale: 0.25, duration: 0.3 });
      } else {
        gsap.to(outer, {
          scale: hovering ? 1.55 : 1,
          opacity: 1,
          duration: 0.55,
          ease: "elastic.out(1, 0.5)",
        });
        gsap.to(inner, {
          scale: hovering ? 0.35 : 1,
          duration: 0.4,
          ease: "back.out(1.9)",
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("contextmenu", onContextMenu);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("contextmenu", onContextMenu);
      document
        .querySelectorAll("[data-cv-context-ripple]")
        .forEach((n) => n.remove());
      delete document.body.dataset.customCursor;
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[10050] h-9 w-9 rounded-full border-2 border-[var(--cv-accent)] opacity-0 shadow-[0_0_16px_color-mix(in_srgb,var(--cv-accent)_35%,transparent)] max-md:hidden"
        aria-hidden
      />
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[10051] h-1.5 w-1.5 rounded-full bg-[var(--cv-accent)] opacity-0 shadow-[0_0_6px_var(--cv-accent)] max-md:hidden"
        aria-hidden
      />
    </>
  );
}
