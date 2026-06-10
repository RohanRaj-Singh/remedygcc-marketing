"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { en, ar } from "./locales";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Locale = "en" | "ar";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "remedy-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve a dot-separated path on a nested dictionary object. */
function deepGet(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let value: unknown = obj;

  for (const key of keys) {
    if (value == null || typeof value !== "object") return path;
    value = (value as Record<string, unknown>)[key];
  }

  return typeof value === "string" ? value : path;
}

/** Persist the chosen locale to localStorage + cookie + html lang attribute. */
function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // localStorage may be unavailable (private browsing, SSR)
  }

  // Cookie so server components (generateMetadata) can read it
  document.cookie = `${STORAGE_KEY}=${locale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;

  document.documentElement.lang = locale;
}

/** Read the persisted locale, defaulting to 'en'. */
function readPersistedLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    // ignore
  }
  return "en";
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  // Track mount to avoid hydration mismatch between SSR cookie and client
  const [ready, setReady] = useState(false);

  // Initialize from localStorage on mount (runs once)
  useEffect(() => {
    setLocaleState(readPersistedLocale());
    setReady(true);
  }, []);

  // Sync html attributes whenever locale changes (including initial)
  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const dict = locale === "ar" ? ar : en;

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: (key: string) => deepGet(dict as unknown as Record<string, unknown>, key),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an <I18nProvider>");
  }
  return ctx;
}
