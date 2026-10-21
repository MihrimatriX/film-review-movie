"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAdminResourceButton({
  apiUrl,
  label,
}: {
  apiUrl: string;
  label: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete “${label}”?`)) return;
    setPending(true);
    try {
      const res = await fetch(apiUrl, { method: "DELETE" });
      if (!res.ok) return;
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={onDelete}
      className="text-xs text-red-400 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
