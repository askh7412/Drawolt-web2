'use client';

import React, { useState } from 'react';
import { Building2, Wrench } from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { MultiStepPartnerOnboarding } from '@/components/partners/MultiStepPartnerOnboarding';

export function PartnershipSection() {
  const { t } = useLocale();
  const [activeType, setActiveType] = useState<'distributor' | 'service' | null>(null);

  return (
    <section id="partnership" className="border-t border-[#E5E9ED] bg-white py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-8 sm:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-semibold tracking-tight text-[#101C35] text-balance sm:text-4xl">
                {t.partnership.headline}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#7D8792]">
                {t.partnership.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <button
                type="button"
                onClick={() => setActiveType('distributor')}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#101C35] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#202226]"
              >
                <Building2 className="h-4 w-4 text-[#9DCB16]" />
                <span>{t.partnership.distributorBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveType('service')}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#101C35]/20 bg-white px-5 py-3 text-sm font-semibold text-[#101C35] transition-colors hover:border-[#101C35]"
              >
                <Wrench className="h-4 w-4 text-[#7D8792]" />
                <span>{t.partnership.serviceBtn}</span>
              </button>
            </div>
          </div>

          {activeType && (
            <div className="mt-8">
              <MultiStepPartnerOnboarding
                key={activeType}
                initialType={activeType}
                onClose={() => setActiveType(null)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
