"use client";

import { useCallback, useState } from "react";

type Labels = {
  copyLink: string;
  copied: string;
  share: string;
};

export function BlogArticleActions({
  title,
  labels,
}: {
  title: string;
  labels: Labels;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const onShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled or error */
      }
    } else {
      await onCopy();
    }
  }, [title, onCopy]);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onCopy}
        className="rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-card)] px-3 py-2 text-sm font-medium text-[var(--cv-heading)] transition hover:border-[var(--cv-accent)]/50 hover:text-[var(--cv-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cv-accent)]"
      >
        {copied ? labels.copied : labels.copyLink}
      </button>
      <button
        type="button"
        onClick={onShare}
        className="rounded-md border border-[var(--cv-border-strong)] bg-[var(--cv-card)] px-3 py-2 text-sm font-medium text-[var(--cv-heading)] transition hover:border-[var(--cv-accent)]/50 hover:text-[var(--cv-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cv-accent)]"
      >
        {labels.share}
      </button>
    </div>
  );
}
