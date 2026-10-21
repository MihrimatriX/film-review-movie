"use client";

import { useEffect } from "react";

/** Segment `metadata` yerine — Next MetadataOutlet hidrasyon sorunlarını tetiklememek için. */
export function NotFoundDocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
