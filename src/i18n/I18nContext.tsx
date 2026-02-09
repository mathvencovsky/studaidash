import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Locale, TranslationKeys } from "./types";
import { ptBR } from "./pt-BR";
import { enUS } from "./en-US";

const STORAGE_KEY = "studai_locale";

const translations: Record<Locale, TranslationKeys> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

function detectLocale(): Locale {
  // 1. Check localStorage for saved preference
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "pt-BR" || saved === "en-US") return saved;
  }

  // 2. Fallback: navigator.language
  if (typeof navigator !== "undefined") {
    const lang = navigator.language || (navigator as any).userLanguage || "";
    if (lang.startsWith("pt")) return "pt-BR";
  }

  // 3. Default to English
  return "en-US";
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationKeys) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  // Update <html lang> whenever locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: keyof TranslationKeys): string => {
      return translations[locale][key] ?? translations["pt-BR"][key] ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
