'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Instagram, Settings2 } from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';

import workshopImg from '@/src/assets/images/workshop_technician_real_1795034599407.jpg';
import drillImg from '@/src/assets/images/drill_studio_clean_1795034598620.jpg';
import rotaryImg from '@/src/assets/images/rotary_hammer_studio_1795034600887.jpg';
import sawImg from '@/src/assets/images/circular_saw_studio_1795034599683.jpg';

const SHOWCASE_CAMPAIGNS = [
  {
    id: 'IG-SLOT-01',
    title: 'Precision Bench Calibration',
    caption: 'Industrial workshop calibration showcase (Demo feed slot awaiting Meta Graph API token).',
    image: workshopImg,
    campaignSlug: 'calibration-series',
  },
  {
    id: 'IG-SLOT-02',
    title: 'Brushless Cordless Platform',
    caption: 'Compact industrial torque architecture (Demo feed slot).',
    image: drillImg,
    campaignSlug: 'cordless-platform',
  },
  {
    id: 'IG-SLOT-03',
    title: 'Heavy Rotary Demolition',
    caption: 'Anti-vibration SDS chuck engineering (Demo feed slot).',
    image: rotaryImg,
    campaignSlug: 'rotary-demolition',
  },
  {
    id: 'IG-SLOT-04',
    title: 'Carbide Cutting Precision',
    caption: 'Industrial circular saw and blade series (Demo feed slot).',
    image: sawImg,
    campaignSlug: 'cutting-series',
  },
];

export function InstagramShowcaseSection() {
  const { locale } = useLocale();
  const [clicks, setClicks] = useState<Record<string, number>>({});

  const trackClick = (id: string) => {
    setClicks((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <section id="instagram" className="border-t border-[#E5E9ED] bg-white py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7D8792]">
              <Instagram className="h-4 w-4 text-[#9DCB16]" />
              <span>@drawolt.official · Meta Graph API Integration Ready</span>
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#101C35] text-balance sm:text-4xl">
              {locale === 'fa'
                ? 'ویترین رسمی اینستاگرام DRAWOLT'
                : locale === 'de'
                  ? 'Offizielles DRAWOLT Instagram Showcase'
                  : locale === 'ar'
                    ? 'معرض إنستغرام الرسمي من DRAWOLT'
                    : 'Official Instagram & Campaign Showcase'}
            </h2>
            <p className="mt-2 text-sm text-[#7D8792]">
              Admin-curated campaign slots with click tracking. Connect an authorized Meta/Instagram
              Graph API token in the Admin Command Center to sync live reels and posts without scraping.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/portals?tab=instagram"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2 text-xs font-semibold text-[#101C35] hover:border-[#101C35]"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>Admin IG Settings</span>
            </Link>
            <a
              href="https://instagram.com/drawolt.official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#101C35] px-4 py-2 text-xs font-semibold text-white hover:bg-[#202226]"
            >
              <Instagram className="h-3.5 w-3.5 text-[#9DCB16]" />
              <span>@drawolt.official</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SHOWCASE_CAMPAIGNS.map((post) => (
            <div
              key={post.id}
              className="group overflow-hidden rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] transition-colors hover:border-[#101C35]/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-[#7D8792]">
                  <span className="font-mono">{post.id}</span>
                  <span className="tabular-nums">
                    {clicks[post.id] ? `${clicks[post.id]} session clicks` : 'Demo Slot'}
                  </span>
                </div>
                <h3 className="mt-1.5 text-sm font-semibold text-[#101C35]">{post.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#7D8792]">{post.caption}</p>
                <button
                  type="button"
                  onClick={() => trackClick(post.id)}
                  className="mt-3 text-xs font-semibold text-[#101C35] underline decoration-[#9DCB16] decoration-2 underline-offset-4"
                >
                  Track Campaign Click
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
