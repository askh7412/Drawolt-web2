'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DICTIONARIES, TranslationDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, isValidLocale, Locale, SUPPORTED_LOCALES } from '@/lib/i18n/types';

interface LocaleContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: TranslationDictionary;
  setLocale: (next: Locale, persistChoice?: boolean) => void;
  hasChosenLanguage: boolean;
  markLanguageChosen: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = 'drawolt_preferred_locale';
const CHOSEN_KEY = 'drawolt_locale_chosen';

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [hasChosenLanguage, setHasChosenLanguage] = useState<boolean>(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const chosen = window.localStorage.getItem(CHOSEN_KEY) === '1';
        setHasChosenLanguage(chosen);

        const pathSeg = window.location.pathname.split('/')[1];
        if (!isValidLocale(pathSeg)) {
          const saved = window.localStorage.getItem(STORAGE_KEY);
          if (isValidLocale(saved)) {
            setLocaleState(saved);
          }
        }
      } catch {
        setHasChosenLanguage(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const meta = SUPPORTED_LOCALES[locale];
    document.documentElement.lang = meta.code;
    document.documentElement.dir = meta.dir;
  }, [locale]);

  const setLocale = useCallback((next: Locale, persistChoice = true) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      if (persistChoice) {
        window.localStorage.setItem(CHOSEN_KEY, '1');
        setHasChosenLanguage(true);
      }
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }, []);

  const markLanguageChosen = useCallback(() => {
    setHasChosenLanguage(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
      window.localStorage.setItem(CHOSEN_KEY, '1');
    } catch {
      // Ignore
    }
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: SUPPORTED_LOCALES[locale].dir,
      t: DICTIONARIES[locale],
      setLocale,
      hasChosenLanguage,
      markLanguageChosen,
    }),
    [locale, setLocale, hasChosenLanguage, markLanguageChosen],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return ctx;
}
