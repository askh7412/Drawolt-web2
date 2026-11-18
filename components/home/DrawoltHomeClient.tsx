'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Box,
  Camera,
  Check,
  Cpu,
  Layers,
  Scale,
  Search,
  Shield,
  Zap,
} from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { DrawoltMark } from '@/components/brand/DrawoltMark';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { LanguageModal } from '@/components/i18n/LanguageModal';
import { RamaxAssistant } from '@/components/ai/RamaxAssistant';
import { PartnerNetworkSection } from '@/components/home/PartnerNetworkSection';
import { InstagramShowcaseSection } from '@/components/home/InstagramShowcaseSection';
import { WarrantySupportSection } from '@/components/home/WarrantySupportSection';
import { PartnershipSection } from '@/components/home/PartnershipSection';
import { CategoryItem, PRODUCT_CATEGORIES } from '@/lib/architecture-data';
import type { ToolFinish } from '@/components/three/ToolShowcase3D';

import drillStudioImg from '@/src/assets/images/drill_studio_clean_1795034598620.jpg';
import angleGrinderImg from '@/src/assets/images/hero_angle_grinder_1795032912334.jpg';
import rotaryHammerImg from '@/src/assets/images/rotary_hammer_studio_1795034600887.jpg';
import circularSawImg from '@/src/assets/images/circular_saw_studio_1795034599683.jpg';
import batterySystemImg from '@/src/assets/images/battery_charger_system_1795034637059.jpg';
import toplineWrenchImg from '@/src/assets/images/topline_impact_wrench_1795032895571.jpg';
import motorCutawayImg from '@/src/assets/images/engineering_motor_cutaway_1795032896456.jpg';
import workshopImg from '@/src/assets/images/workshop_technician_real_1795034599407.jpg';

const CATEGORY_IMAGES: Record<CategoryItem['imageKey'], StaticImageData> = {
  drill: drillStudioImg,
  grinder: angleGrinderImg,
  rotary: rotaryHammerImg,
  saw: circularSawImg,
  battery: batterySystemImg,
  motor: motorCutawayImg,
  workshop: workshopImg,
  topline: toplineWrenchImg,
};

const ToolShowcase3D = dynamic(
  () => import('@/components/three/ToolShowcase3D').then((m) => m.ToolShowcase3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[440px] w-full items-center justify-center rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] text-xs font-medium text-[#7D8792] sm:h-[520px]">
        Initializing 3D Engineering Viewport...
      </div>
    ),
  },
);

type EngineeringTab = 'motor' | 'battery' | 'torque' | 'ergonomics' | 'materials';

const ENGINEERING_DETAILS: Record<
  EngineeringTab,
  {
    title: string;
    summary: string;
    pillars: string[];
  }
> = {
  motor: {
    title: 'Brushless Stator & Thermal Architecture',
    summary:
      'High-density copper stator windings paired with closed-loop temperature sensing reduce friction losses and support continuous industrial duty cycles.',
    pillars: [
      'Electronic commutation control without brush wear',
      'Directed internal airflow channels across stator laminations',
      'Overload current cutoff integrated into controller firmware',
    ],
  },
  battery: {
    title: 'Modular Industrial Power Pack System',
    summary:
      'Unified mechanical rail interface engineered for cross-tool compatibility with shock-isolated cell cradles and thermal telemetry.',
    pillars: [
      'Cell-level voltage and temperature monitoring interface',
      'Impact-damped elastomeric lower housing frame',
      'Compatible charger handshake verification protocol',
    ],
  },
  torque: {
    title: 'Multi-Stage Planetary Torque Delivery',
    summary:
      'Hardened steel planetary gear stages calibrated for repeatable fastening precision and minimal backlash under heavy structural loads.',
    pillars: [
      'CNC-machined steel ring and sun gear profiles',
      'Precision multi-step mechanical clutch collar',
      'Electronic brake engagement on trigger release',
    ],
  },
  ergonomics: {
    title: 'Vibration Isolation & Operator Safety',
    summary:
      'Balanced center-of-gravity geometry and overmolded charcoal grip surfaces reduce operator fatigue across extended workshop shifts.',
    pillars: [
      'Anti-kickback electronic gyroscopic cutoff architecture',
      'Two-stage lock-off trigger discipline for cutting tools',
      'Neutral wrist alignment between chuck axis and battery base',
    ],
  },
  materials: {
    title: 'Industrial Composite & Titanium Alloys',
    summary:
      'Glass-fiber reinforced housings in Midnight Navy and brushed Titanium alloy gearcases engineered to resist workshop solvents and impact.',
    pillars: [
      'Standard Line: Midnight Navy #101C35 + Charcoal #202226',
      'TOP LINE: Titanium #777E87 + Carbon Black #15171A',
      'Restrained Lime Green #9DCB16 functional indicators only',
    ],
  },
};

export function DrawoltHomeClient() {
  const { locale, dir, t } = useLocale();
  const [introVisible, setIntroVisible] = useState(true);
  const [heroMode, setHeroMode] = useState<'drill' | 'grinder' | '3d'>('drill');
  const [toolFinish, setToolFinish] = useState<ToolFinish>('standard');
  const [activeHotspot, setActiveHotspot] = useState<'motor' | 'clutch' | 'battery'>('motor');
  const [catFilter, setCatFilter] = useState<'all' | 'standard' | 'topline'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>(['cat-cordless', 'cat-topline']);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(['cat-cordless']);
  const [engTab, setEngTab] = useState<EngineeringTab>('motor');

  const visibleCategories = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    return PRODUCT_CATEGORIES.filter((c) => {
      const matchSeries = catFilter === 'all' || c.series === catFilter;
      const matchQuery =
        !q ||
        c.names[locale].toLowerCase().includes(q) ||
        c.names.en.toLowerCase().includes(q) ||
        c.skuPrefix.toLowerCase().includes(q);
      return matchSeries && matchQuery;
    });
  }, [catFilter, catalogSearch, locale]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
    setRecentlyViewedIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 4));
  };

  const comparedItems = PRODUCT_CATEGORIES.filter((c) => compareIds.includes(c.id));

  return (
    <div dir={dir} className="min-h-screen bg-white text-[#101C35]">
      <SiteHeader />
      <LanguageModal />

      {/* Scene 1 — Skippable White Mechanical Brand Introduction */}
      {introVisible && (
        <section
          aria-label="Brand Introduction"
          className="industrial-grid-bg border-b border-[#E5E9ED] bg-white"
        >
          <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-4 py-7 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <div className="text-xs font-medium text-[#7D8792]">
                <span>{t.scene1.kicker}</span>
                <span className="mx-2">·</span>
                <span>drawolt.com</span>
              </div>
              <DrawoltMark
                size="lg"
                showVectorSlotNote
                slotNoteText={t.scene1.logoSlotNotice}
              />
              <p className="max-w-xl text-sm text-[#202226]">{t.scene1.statement}</p>
            </motion.div>

            <button
              type="button"
              onClick={() => setIntroVisible(false)}
              className="shrink-0 whitespace-nowrap rounded-lg border border-[#E5E9ED] bg-white px-3.5 py-2 text-xs font-semibold text-[#7D8792] transition-colors hover:border-[#101C35] hover:text-[#101C35]"
            >
              {t.scene1.skip}
            </button>
          </div>
        </section>
      )}

      {/* Scene 2 — Cinematic Product Hero */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Editorial & 3 Action CTAs */}
            <div className="space-y-6 lg:col-span-5">
              <div className="text-xs font-semibold tracking-wide text-[#7D8792]">
                {t.hero.subheadline}
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-[#101C35] text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.07]">
                {t.hero.headline}
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-[#7D8792]">
                {t.hero.description}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#9DCB16] px-5 py-3 text-sm font-bold text-[#101C35] transition-colors hover:bg-[#8EB812] focus-visible:outline-2 focus-visible:outline-[#101C35]"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#topline"
                  className="inline-flex items-center whitespace-nowrap rounded-lg bg-[#101C35] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#202226]"
                >
                  {locale === 'fa' ? 'کشف سری TOP LINE' : 'Discover TOP LINE'}
                </a>
                <a
                  href="#partnership"
                  className="inline-flex items-center whitespace-nowrap rounded-lg border border-[#E5E9ED] bg-white px-5 py-3 text-sm font-semibold text-[#101C35] transition-colors hover:border-[#101C35]"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>

              {/* Interactive Technical Hotspots */}
              <div className="border-t border-[#E5E9ED] pt-6">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'motor', label: t.hero.hotspotMotor, Icon: Cpu },
                      { id: 'clutch', label: t.hero.hotspotClutch, Icon: Shield },
                      { id: 'battery', label: t.hero.hotspotBattery, Icon: Zap },
                    ] as const
                  ).map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveHotspot(id)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        activeHotspot === id
                          ? 'bg-[#EEF1F3] text-[#101C35]'
                          : 'text-[#7D8792] hover:bg-[#F6F8FA] hover:text-[#101C35]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 text-[#9DCB16]" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[#7D8792]">
                  {activeHotspot === 'motor'
                    ? t.hero.hotspotMotorDesc
                    : activeHotspot === 'clutch'
                      ? t.hero.hotspotClutchDesc
                      : t.hero.hotspotBatteryDesc}
                </p>
              </div>
            </div>

            {/* Studio Product Photography Gallery + Interactive 3D */}
            <div className="space-y-3 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1 rounded-lg bg-[#F6F8FA] p-1">
                  <button
                    type="button"
                    onClick={() => setHeroMode('drill')}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      heroMode === 'drill'
                        ? 'bg-white text-[#101C35] shadow-xs'
                        : 'text-[#7D8792] hover:text-[#101C35]'
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Cordless Drill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroMode('grinder')}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      heroMode === 'grinder'
                        ? 'bg-white text-[#101C35] shadow-xs'
                        : 'text-[#7D8792] hover:text-[#101C35]'
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Angle Grinder</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroMode('3d')}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      heroMode === '3d'
                        ? 'bg-white text-[#101C35] shadow-xs'
                        : 'text-[#7D8792] hover:text-[#101C35]'
                    }`}
                  >
                    <Box className="h-3.5 w-3.5" />
                    <span>{t.hero.view3d}</span>
                  </button>
                </div>

                <span className="text-xs text-[#7D8792]">{t.hero.specNote}</span>
              </div>

              {heroMode === '3d' ? (
                <ToolShowcase3D
                  finish={toolFinish}
                  onFinishChange={setToolFinish}
                  standardLabel={t.hero.seriesStandard}
                  toplineLabel={t.hero.seriesTopline}
                />
              ) : (
                <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] sm:h-[520px]">
                  <Image
                    src={heroMode === 'drill' ? drillStudioImg : angleGrinderImg}
                    alt={
                      heroMode === 'drill'
                        ? 'DRAWOLT Industrial Brushless Cordless Hammer Drill'
                        : 'DRAWOLT Industrial Cordless Angle Grinder'
                    }
                    fill
                    priority
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />

                  <button
                    type="button"
                    onClick={() => setActiveHotspot('clutch')}
                    style={{ left: heroMode === 'drill' ? '40%' : '28%', top: heroMode === 'drill' ? '33%' : '44%' }}
                    aria-label={t.hero.hotspotClutch}
                    className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-bold transition-transform hover:scale-110 ${
                      activeHotspot === 'clutch'
                        ? 'border-[#101C35] bg-[#9DCB16] text-[#101C35]'
                        : 'border-white bg-[#101C35] text-white'
                    }`}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHotspot('motor')}
                    style={{ left: heroMode === 'drill' ? '59%' : '54%', top: heroMode === 'drill' ? '32%' : '40%' }}
                    aria-label={t.hero.hotspotMotor}
                    className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-bold transition-transform hover:scale-110 ${
                      activeHotspot === 'motor'
                        ? 'border-[#101C35] bg-[#9DCB16] text-[#101C35]'
                        : 'border-white bg-[#101C35] text-white'
                    }`}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHotspot('battery')}
                    style={{ left: heroMode === 'drill' ? '52%' : '80%', top: heroMode === 'drill' ? '73%' : '53%' }}
                    aria-label={t.hero.hotspotBattery}
                    className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-bold transition-transform hover:scale-110 ${
                      activeHotspot === 'battery'
                        ? 'border-[#101C35] bg-[#9DCB16] text-[#101C35]'
                        : 'border-white bg-[#101C35] text-white'
                    }`}
                  >
                    3
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scene 3 — Interactive Product Collections & Discovery */}
      <section id="collections" className="border-t border-[#E5E9ED] bg-[#F6F8FA] py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-[#101C35] text-balance sm:text-4xl">
                {t.collections.sectionTitle}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-[#7D8792]">
                {t.collections.sectionSubtitle}
              </p>
              <p className="mt-1.5 text-xs text-[#7D8792]">{t.collections.sampleNotice}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-[#7D8792]" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Smart product search..."
                  className="w-52 rounded-lg border border-[#E5E9ED] bg-white py-2 pr-3 pl-8 text-xs text-[#101C35] focus:border-[#101C35] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-[#E5E9ED] bg-white p-1">
                {(
                  [
                    { id: 'all', label: t.collections.filterAll },
                    { id: 'standard', label: 'Standard' },
                    { id: 'topline', label: 'TOP LINE' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCatFilter(item.id)}
                    className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      catFilter === item.id
                        ? 'bg-[#101C35] text-white'
                        : 'text-[#7D8792] hover:text-[#101C35]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleCategories.map((cat, idx) => {
              const isCompared = compareIds.includes(cat.id);
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-colors ${
                    cat.series === 'topline'
                      ? 'border-[#777E87]/40 bg-[#EEF1F3]'
                      : 'border-[#E5E9ED] bg-white hover:border-[#101C35]/40'
                  }`}
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                      <Image
                        src={CATEGORY_IMAGES[cat.imageKey]}
                        alt={`${cat.names[locale]} — DRAWOLT Sample Studio Image`}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-[#7D8792]">
                        <span className="font-mono tabular-nums">{cat.skuPrefix}</span>
                        <span>{cat.sampleLabel}</span>
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-[#101C35]">
                        {cat.names[locale]}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#7D8792]">
                        {cat.descriptions[locale]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E5E9ED] px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleCompare(cat.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                        isCompared ? 'text-[#101C35]' : 'text-[#7D8792] hover:text-[#101C35]'
                      }`}
                    >
                      <Scale className={`h-3.5 w-3.5 ${isCompared ? 'text-[#9DCB16]' : ''}`} />
                      <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                    </button>

                    <Link
                      href="/portals?tab=pim"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#101C35] hover:underline decoration-[#9DCB16] decoration-2 underline-offset-4"
                    >
                      <span>{t.collections.exploreSeries}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Product Comparison & Recently Viewed Panel */}
          {comparedItems.length > 0 && (
            <div className="mt-10 rounded-2xl border border-[#E5E9ED] bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E9ED] pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#101C35]">
                    Interactive Series & Category Comparison ({comparedItems.length}/3)
                  </h3>
                  <p className="text-xs text-[#7D8792]">
                    Recently viewed:{' '}
                    {recentlyViewedIds
                      .map((id) => PRODUCT_CATEGORIES.find((c) => c.id === id)?.skuPrefix)
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <span className="text-xs text-[#7D8792]">
                  Architectural Spec Matrix (QA lab values load from PIM)
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {comparedItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-[#101C35]">{item.skuPrefix}</span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(item.id)}
                        className="text-[#7D8792] hover:text-[#101C35]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-1 font-semibold text-[#101C35]">{item.names[locale]}</div>
                    <div className="mt-2 space-y-1 text-[#7D8792]">
                      <div>Series: {item.series === 'topline' ? 'TOP LINE Titanium' : 'DRAWOLT Standard'}</div>
                      <div>Warranty Registry: DRAWOLT ID Verified</div>
                      <div>Documentation: Multilingual PIM & Manuals</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scene 4 — Engineering Showcase & Workshop Precision */}
      <section id="engineering" className="border-t border-[#E5E9ED] bg-white py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-[#101C35] text-balance sm:text-4xl">
                  {t.engineering.sectionTitle}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#7D8792]">
                  {t.engineering.sectionSubtitle}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(Object.keys(t.engineering.tabs) as EngineeringTab[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setEngTab(key)}
                      className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                        engTab === key
                          ? 'bg-[#101C35] text-white'
                          : 'border border-[#E5E9ED] bg-[#F6F8FA] text-[#7D8792] hover:text-[#101C35]'
                      }`}
                    >
                      {t.engineering.tabs[key]}
                    </button>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-6">
                  <h3 className="text-lg font-semibold text-[#101C35]">
                    {ENGINEERING_DETAILS[engTab].title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#7D8792]">
                    {ENGINEERING_DETAILS[engTab].summary}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {ENGINEERING_DETAILS[engTab].pillars.map((pillar) => (
                      <li key={pillar} className="flex items-start gap-2.5 text-sm text-[#202226]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9DCB16]" />
                        <span>{pillar}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-4 text-xs text-[#7D8792]">{t.engineering.specsDisclaimer}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:col-span-6">
              <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA]">
                <Image
                  src={motorCutawayImg}
                  alt="Brushless motor stator and planetary gearbox engineering cutaway"
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA]">
                <Image
                  src={workshopImg}
                  alt="Industrial workshop technician calibrating power tool torque"
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 5 — TOP LINE Titanium Experience */}
      <section id="topline" className="titanium-grid-bg border-t border-[#E5E9ED] bg-[#EEF1F3] py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-[#777E87]/30 bg-white lg:col-span-7">
              <Image
                src={toplineWrenchImg}
                alt="DRAWOLT TOP LINE Titanium and Carbon Black Industrial Impact Wrench"
                fill
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>

            <div className="space-y-5 lg:col-span-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#777E87]">
                <Layers className="h-4 w-4 text-[#9DCB16]" />
                <span>{t.topline.kicker}</span>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-[#15171A] text-balance sm:text-4xl">
                {t.topline.title}
              </h2>

              <p className="text-base font-medium text-[#202226]">{t.topline.subtitle}</p>
              <p className="text-sm leading-relaxed text-[#777E87]">{t.topline.description}</p>

              <div className="flex flex-wrap items-center gap-4 border-t border-[#777E87]/25 pt-4">
                <div className="flex items-center gap-2 text-xs text-[#15171A]">
                  <span className="h-4 w-4 rounded border border-black/10 bg-[#777E87]" />
                  <span className="font-mono">Titanium #777E87</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#15171A]">
                  <span className="h-4 w-4 rounded border border-black/10 bg-[#15171A]" />
                  <span className="font-mono">Carbon #15171A</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#15171A]">
                  <span className="h-4 w-4 rounded border border-black/10 bg-[#9DCB16]" />
                  <span className="font-mono">Lime 2–4%</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setHeroMode('3d');
                    setToolFinish('topline');
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#15171A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#202226]"
                >
                  <span>{t.topline.cta}</span>
                  <ArrowRight className="h-4 w-4 text-[#9DCB16]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 6 — 12-Country Global Partner Network */}
      <PartnerNetworkSection />

      {/* Instagram Official Showcase */}
      <InstagramShowcaseSection />

      {/* Scene 7 — Warranty & Support */}
      <WarrantySupportSection />

      {/* Scene 8 — Multi-Step Partnership Invitation */}
      <PartnershipSection />

      {/* Scene 9 — Final Brand Signature */}
      <section className="border-t border-[#E5E9ED] bg-white py-14">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:px-6 sm:text-start lg:px-8">
          <DrawoltMark size="md" />
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#7D8792]">
            <Link href="/architecture" className="hover:text-[#101C35]">
              {t.footer.architectureLink}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/portals" className="hover:text-[#101C35]">
              {t.footer.portalsLink}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <RamaxAssistant />
    </div>
  );
}
