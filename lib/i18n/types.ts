export type Locale = 'en' | 'fa' | 'de' | 'ar';

export interface LocaleMeta {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  hreflang: string;
  regionLabel: string;
}

export const SUPPORTED_LOCALES: Record<Locale, LocaleMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    hreflang: 'en',
    regionLabel: 'Global (Default)',
  },
  fa: {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    dir: 'rtl',
    hreflang: 'fa',
    regionLabel: 'ایران و منطقه',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    dir: 'ltr',
    hreflang: 'de',
    regionLabel: 'DACH / Europa',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    hreflang: 'ar',
    regionLabel: 'الشرق الأوسط',
  },
};

export const DEFAULT_LOCALE: Locale = 'en';

export function isValidLocale(val: string | undefined | null): val is Locale {
  return val === 'en' || val === 'fa' || val === 'de' || val === 'ar';
}
