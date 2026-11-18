'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { DrawoltMark } from '@/components/brand/DrawoltMark';
import { Locale, SUPPORTED_LOCALES } from '@/lib/i18n/types';

export function SiteFooter() {
  const { locale, t, setLocale } = useLocale();

  return (
    <footer className="border-t border-[#E5E9ED] bg-[#F6F8FA] text-[#101C35]">
      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <DrawoltMark size="md" />
            <p className="max-w-sm text-sm leading-relaxed text-[#7D8792]">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-4 text-xs text-[#7D8792]">
              <span>drawolt.com</span>
              <span aria-hidden="true">·</span>
              <a
                href="https://instagram.com/drawolt.official"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[#101C35] hover:underline decoration-[#9DCB16] decoration-2 underline-offset-4"
              >
                <Instagram className="h-3.5 w-3.5" />
                <span>@drawolt.official</span>
              </a>
            </div>
          </div>

          <div className="space-y-3 md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wide text-[#101C35]">
              {t.footer.publicGroup}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#7D8792]">
              <li>
                <a href={`/${locale}#collections`} className="hover:text-[#101C35]">
                  {t.nav.products}
                </a>
              </li>
              <li>
                <a href={`/${locale}#topline`} className="hover:text-[#101C35]">
                  {t.nav.topline}
                </a>
              </li>
              <li>
                <a href={`/${locale}#network`} className="hover:text-[#101C35]">
                  {t.nav.network}
                </a>
              </li>
              <li>
                <a href={`/${locale}#warranty`} className="hover:text-[#101C35]">
                  {t.nav.warranty}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-3">
            <h3 className="text-xs font-semibold tracking-wide text-[#101C35]">
              {t.footer.portalsGroup}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#7D8792]">
              <li>
                <Link href="/portals" className="hover:text-[#101C35]">
                  {t.footer.portalsLink}
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-[#101C35]">
                  {t.footer.architectureLink}
                </Link>
              </li>
              <li>
                <a href={`/${locale}#partnership`} className="hover:text-[#101C35]">
                  {t.partnership.distributorBtn}
                </a>
              </li>
              <li>
                <a href={`/${locale}#partnership`} className="hover:text-[#101C35]">
                  {t.partnership.serviceBtn}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wide text-[#101C35]">
              {t.footer.languageLabel}
            </h3>
            <div className="flex flex-col gap-1.5">
              {(Object.keys(SUPPORTED_LOCALES) as Locale[]).map((code) => {
                const item = SUPPORTED_LOCALES[code];
                const active = locale === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code, true)}
                    className={`w-fit text-start text-sm transition-colors ${
                      active
                        ? 'font-semibold text-[#101C35] underline decoration-[#9DCB16] decoration-2 underline-offset-4'
                        : 'text-[#7D8792] hover:text-[#101C35]'
                    }`}
                  >
                    {item.nativeName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#E5E9ED] pt-6 text-xs text-[#7D8792] sm:flex-row sm:items-center">
          <p>{t.footer.copyright}</p>
          <p className="tabular-nums">EN · FA · DE · AR</p>
        </div>
      </div>
    </footer>
  );
}
