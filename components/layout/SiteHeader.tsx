'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Instagram } from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { Locale, SUPPORTED_LOCALES } from '@/lib/i18n/types';

export function SiteHeader() {
  const { locale, t, setLocale } = useLocale();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Locale;
    setLocale(next, true);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E9ED] bg-white/95">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          href={`/${locale}`}
          className="shrink-0 whitespace-nowrap text-lg font-bold italic tracking-tight text-[#101C35] focus-visible:outline-2 focus-visible:outline-[#9DCB16]"
        >
          DRA<span className="text-[#9DCB16]">W</span>OLT
        </Link>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-6 text-sm font-medium text-[#7D8792] lg:flex"
        >
          <a
            href={`/${locale}#collections`}
            className="shrink-0 whitespace-nowrap transition-colors hover:text-[#101C35]"
          >
            {t.nav.products}
          </a>
          <a
            href={`/${locale}#topline`}
            className="shrink-0 whitespace-nowrap transition-colors hover:text-[#101C35]"
          >
            {t.nav.topline}
          </a>
          <a
            href={`/${locale}#network`}
            className="shrink-0 whitespace-nowrap transition-colors hover:text-[#101C35]"
          >
            {t.nav.network}
          </a>
          <a
            href={`/${locale}#warranty`}
            className="shrink-0 whitespace-nowrap transition-colors hover:text-[#101C35]"
          >
            {t.nav.warranty}
          </a>
          <Link
            href="/architecture"
            className="shrink-0 whitespace-nowrap transition-colors hover:text-[#101C35]"
          >
            {t.nav.architecture}
          </Link>
        </nav>

        {/* Zone 3: Instagram, Language Switcher & Partner Hub CTA */}
        <div className="flex shrink-0 items-center gap-2.5">
          <a
            href="https://instagram.com/drawolt.official"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DRAWOLT Official Instagram"
            title="@drawolt.official"
            className="hidden h-8 w-8 items-center justify-center rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] text-[#101C35] transition-colors hover:border-[#101C35] sm:inline-flex"
          >
            <Instagram className="h-3.5 w-3.5" />
          </a>

          <label className="flex items-center gap-1.5 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-2.5 py-1.5 text-xs font-medium text-[#101C35]">
            <Globe className="h-3.5 w-3.5 text-[#7D8792]" aria-hidden="true" />
            <span className="sr-only">Language</span>
            <select
              value={locale}
              onChange={handleLocaleChange}
              aria-label="Select Language"
              className="cursor-pointer bg-transparent text-xs font-semibold text-[#101C35] focus:outline-none"
            >
              {(Object.keys(SUPPORTED_LOCALES) as Locale[]).map((code) => (
                <option key={code} value={code}>
                  {SUPPORTED_LOCALES[code].nativeName}
                </option>
              ))}
            </select>
          </label>

          <Link
            href="/portals"
            className="shrink-0 whitespace-nowrap rounded-lg bg-[#101C35] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#202226] focus-visible:outline-2 focus-visible:outline-[#9DCB16]"
          >
            {t.nav.partnerHub}
          </Link>
        </div>
      </div>
    </header>
  );
}
