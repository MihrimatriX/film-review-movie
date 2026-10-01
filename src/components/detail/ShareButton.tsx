"use client";

import { toast } from "@/components/ui/Toaster";
import { useUi } from "@/components/ui/UiProvider";

/** Web Share API varsa yerel paylaşım, yoksa bağlantıyı panoya kopyalar. */
export function ShareButton({ title }: { title: string }) {
  const { ui } = useUi();

  const onClick = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast(ui.linkCopied);
    } catch {
      window.prompt(ui.share, url);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      className="inline-flex items-center gap-2 rounded-md border border-[var(--cv-border-strong)] px-4 py-3 font-[family-name:var(--font-dosis)] text-sm font-bold uppercase text-[var(--cv-heading)] transition hover:border-[var(--cv-accent)] hover:text-[var(--cv-accent)]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      {ui.share}
    </button>
  );
}
