"use client";

import type { Locale, UiStrings } from "@/lib/i18n";
import { createContext, useContext } from "react";

type UiContextValue = { locale: Locale; ui: UiStrings };

const UiContext = createContext<UiContextValue | null>(null);

/** Sunucuda seçilen dilin arayüz metinlerini istemci bileşenlerine taşır. */
export function UiProvider({
  locale,
  ui,
  children,
}: UiContextValue & { children: React.ReactNode }) {
  return (
    <UiContext.Provider value={{ locale, ui }}>{children}</UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) {
    throw new Error("useUi() must be used inside <UiProvider>");
  }
  return ctx;
}
