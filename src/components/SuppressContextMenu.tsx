"use client";

import { useEffect } from "react";

/** Blocks the browser default context menu (right-click / long-press) on the public site. */
export function SuppressContextMenu() {
  useEffect(() => {
    const block = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);
  return null;
}
