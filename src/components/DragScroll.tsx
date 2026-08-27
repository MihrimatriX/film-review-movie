"use client";

import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type Ref,
} from "react";

const DRAG_THRESHOLD_PX = 8;

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") ref(value);
  else ref.current = value;
}

function isOnScrollbar(el: HTMLElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect();
  const barH = el.offsetHeight - el.clientHeight;
  const barW = el.offsetWidth - el.clientWidth;
  if (barH > 0 && clientY > rect.bottom - barH - 2) return true;
  if (barW > 0 && clientX > rect.right - barW - 2) return true;
  return false;
}

function useDragScroll(
  elRef: { current: HTMLDivElement | null },
  wheelToAxis: boolean,
) {
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let pointerId: number | null = null;
    let dragging = false;
    let suppressClick = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;

      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        dragging = true;
        suppressClick = true;
        el.classList.add("is-dragging");
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* capture is optional */
        }
      }

      el.scrollLeft = startScroll - dx;
    };

    const detachWindow = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };

    const endDrag = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      el.style.userSelect = "";
      el.classList.remove("is-dragging");
      detachWindow();
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      dragging = false;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (e.button !== 0) return;
      if (isOnScrollbar(el, e.clientX, e.clientY)) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;

      pointerId = e.pointerId;
      dragging = false;
      suppressClick = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.style.userSelect = "none";
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    };

    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const onWheel = (e: WheelEvent) => {
      if (!wheelToAxis) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const max = el.scrollWidth - el.clientWidth;
      const next = Math.max(0, Math.min(max, el.scrollLeft + e.deltaY));
      if (next === el.scrollLeft) return;

      e.preventDefault();
      el.scrollLeft = next;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);
    if (wheelToAxis) {
      el.addEventListener("wheel", onWheel, { passive: false });
    }

    return () => {
      detachWindow();
      el.style.userSelect = "";
      el.classList.remove("is-dragging");
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("wheel", onWheel);
    };
  }, [elRef, wheelToAxis]);
}

export function DragScroll({
  className = "",
  children,
  wheelToAxis = true,
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  wheelToAxis?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  useDragScroll(localRef, wheelToAxis);

  return (
    <div
      ref={(node) => {
        localRef.current = node;
        assignRef(ref, node);
      }}
      data-drag-scroll=""
      className={`touch-pan-x overscroll-x-contain ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
