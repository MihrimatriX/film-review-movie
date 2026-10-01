"use client";

import { useEffect } from "react";

/**
 * Poster/görsellerde tarayıcı sağ-tık menüsünü kapatır (“resmi kaydet” caydırıcı).
 * Bağlantılar, metin ve form alanlarında menü açık kalır — “yeni sekmede aç”,
 * kopyala/yapıştır gibi temel davranışlar bozulmasın.
 */
export function SuppressContextMenu() {
  useEffect(() => {
    const block = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || target.closest("a, input, textarea, [contenteditable]"))
        return;
      if (target.closest("img, picture, video, [data-protect-media]")) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);
  return null;
}
