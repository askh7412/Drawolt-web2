'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Globe, X } from 'lucide-react';
import { useLocale } from './LocaleProvider';
import { Locale, SUPPORTED_LOCALES } from '@/lib/i18n/types';
import { DrawoltMark } from '@/components/brand/DrawoltMark';

const ORDERED_LOCALES: Locale[] = ['en', 'fa', 'de', 'ar'];

export function LanguageModal() {
  const { locale, t, setLocale, hasChosenLanguage, markLanguageChosen } = useLocale();
  const [open, setOpen] = useState(false);
  const [userSelection, setUserSelection] = useState<Locale | null>(null);
  const pendingLocale = userSelection ?? locale;

  useEffect(() => {
    if (hasChosenLanguage) return;
    const timer = window.setTimeout(() => {
      setOpen(true);
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [hasChosenLanguage]);

  const handleContinue = () => {
    setLocale(pendingLocale, true);
    setOpen(false);
  };

  const handleDismiss = () => {
    markLanguageChosen();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101C35]/35 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-dialog-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-2xl border border-[#E5E9ED] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E5E9ED] pb-5">
              <div className="space-y-2">
                <DrawoltMark size="md" />
                <h2
                  id="lang-dialog-title"
                  className="pt-2 text-xl font-semibold tracking-tight text-[#101C35]"
                >
                  {t.langModal.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#7D8792]">
                  {t.langModal.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss language dialog"
                className="rounded-lg p-2 text-[#7D8792] transition-colors hover:bg-[#F6F8FA] hover:text-[#101C35] focus-visible:outline-2 focus-visible:outline-[#9DCB16]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {ORDERED_LOCALES.map((code) => {
                const item = SUPPORTED_LOCALES[code];
                const active = pendingLocale === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setUserSelection(code)}
                    dir={item.dir}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-[#9DCB16] ${
                      active
                        ? 'border-[#101C35] bg-[#F6F8FA] text-[#101C35]'
                        : 'border-[#E5E9ED] bg-white text-[#202226] hover:border-[#7D8792]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 shrink-0 text-[#7D8792]" />
                        <span className="font-semibold text-[#101C35]">{item.nativeName}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#7D8792]">
                        {item.name} · {item.dir.toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? 'border-[#9DCB16] bg-[#9DCB16] text-[#101C35]'
                          : 'border-[#E5E9ED] bg-white'
                      }`}
                    >
                      {active && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[#E5E9ED] pt-5">
              <button
                type="button"
                onClick={handleDismiss}
                className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium text-[#7D8792] transition-colors hover:bg-[#F6F8FA] hover:text-[#101C35]"
              >
                {t.langModal.dismissBtn}
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="whitespace-nowrap rounded-lg bg-[#101C35] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#202226] focus-visible:outline-2 focus-visible:outline-[#9DCB16]"
              >
                {t.langModal.continueBtn}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
