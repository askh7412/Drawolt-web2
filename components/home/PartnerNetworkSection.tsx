'use client';

import React, { useMemo, useState } from 'react';
import { Clock, Globe2, Mail, MapPin, Phone, Search } from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { SAMPLE_PARTNER_DIRECTORY } from '@/lib/architecture-data';

export function PartnerNetworkSection() {
  const { t } = useLocale();
  const [typeFilter, setTypeFilter] = useState<'all' | 'dealer' | 'service'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_PARTNER_DIRECTORY[0].id);

  const countries = useMemo(
    () => ['all', ...Array.from(new Set(SAMPLE_PARTNER_DIRECTORY.map((p) => p.country)))],
    [],
  );

  const filtered = useMemo(() => {
    return SAMPLE_PARTNER_DIRECTORY.filter((p) => {
      const matchType =
        typeFilter === 'all' ||
        p.type === typeFilter ||
        p.type === 'both';
      const matchCountry = countryFilter === 'all' || p.country === countryFilter;
      const q = searchTerm.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.country.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.dealerCode.toLowerCase().includes(q);
      return matchType && matchCountry && matchQuery;
    });
  }, [typeFilter, countryFilter, searchTerm]);

  const activePartner = filtered.find((p) => p.id === selectedId) || filtered[0] || null;

  return (
    <section id="network" className="border-t border-[#E5E9ED] bg-white py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7D8792]">
              <Globe2 className="h-4 w-4 text-[#9DCB16]" />
              <span>12 Countries · Demo Directory Excluded From Search Indexing</span>
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#101C35] text-balance sm:text-4xl">
              {t.network.sectionTitle}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-[#7D8792]">
              {t.network.sectionSubtitle}
            </p>
            <p className="mt-1.5 text-xs text-[#7D8792]">{t.network.verifiedOnlyNotice}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-[#7D8792]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="City, country, or code..."
                className="w-44 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] py-2 pr-3 pl-8 text-xs text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-[#F6F8FA] p-1">
              {(
                [
                  { id: 'all', label: t.network.filterAll },
                  { id: 'dealer', label: t.network.filterDealer },
                  { id: 'service', label: t.network.filterService },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTypeFilter(tab.id)}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    typeFilter === tab.id
                      ? 'bg-[#101C35] text-white'
                      : 'text-[#7D8792] hover:text-[#101C35]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              aria-label={t.network.countryLabel}
              className="rounded-lg border border-[#E5E9ED] bg-white px-3 py-2 text-xs font-semibold text-[#101C35] focus:border-[#101C35] focus:outline-none"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All 12 Countries (DEMO)' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Network Summary Strip from live filtered array */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4">
            <div className="text-xs text-[#7D8792]">Countries in Demo Seed</div>
            <div className="mt-1 font-mono text-xl font-semibold text-[#101C35] tabular-nums">12</div>
          </div>
          <div className="rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4">
            <div className="text-xs text-[#7D8792]">Matching Directory Nodes</div>
            <div className="mt-1 font-mono text-xl font-semibold text-[#101C35] tabular-nums">
              {filtered.length}
            </div>
          </div>
          <div className="rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4">
            <div className="text-xs text-[#7D8792]">Sales & Dual Dealers</div>
            <div className="mt-1 font-mono text-xl font-semibold text-[#101C35] tabular-nums">
              {filtered.filter((p) => p.type === 'dealer' || p.type === 'both').length}
            </div>
          </div>
          <div className="rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4">
            <div className="text-xs text-[#7D8792]">Authorized Service Centers</div>
            <div className="mt-1 font-mono text-xl font-semibold text-[#101C35] tabular-nums">
              {filtered.filter((p) => p.type === 'service' || p.type === 'both').length}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Interactive 12-Country Vector Map */}
          <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-6 lg:col-span-7">
            <svg
              viewBox="0 0 1000 520"
              className="h-full w-full text-[#DCE3EB]"
              aria-label="Global 12-country demonstration partner map"
            >
              <g fill="currentColor">
                <path d="M90,90 L265,75 L305,155 L235,235 L165,245 L105,175 Z" />
                <path d="M235,265 L330,280 L345,380 L280,465 L235,430 L220,335 Z" />
                <path d="M445,80 L575,70 L600,160 L515,180 L445,155 Z" />
                <path d="M450,195 L560,195 L595,285 L550,405 L485,395 L440,295 Z" />
                <path d="M580,105 L825,95 L875,200 L795,290 L650,275 L595,205 Z" />
                <path d="M745,330 L875,340 L890,425 L785,435 L735,385 Z" />
              </g>
              <g stroke="#E5E9ED" strokeWidth="1">
                <line x1="0" y1="260" x2="1000" y2="260" />
                <line x1="500" y1="0" x2="500" y2="520" />
              </g>
            </svg>

            {filtered.map((partner) => {
              const isSelected = activePartner?.id === partner.id;
              return (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => setSelectedId(partner.id)}
                  style={{ left: `${partner.xPercent}%`, top: `${partner.yPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-2 py-1 text-[10px] font-semibold transition-transform ${
                    isSelected
                      ? 'z-20 scale-110 border-[#101C35] bg-[#101C35] text-white shadow-md'
                      : 'z-10 border-[#E5E9ED] bg-white text-[#101C35] hover:border-[#101C35]'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <MapPin
                      className={`h-3 w-3 ${isSelected ? 'text-[#9DCB16]' : 'text-[#7D8792]'}`}
                    />
                    <span>{partner.city}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Partner Full Demo Card + Scrollable Directory */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {activePartner && (
              <div className="rounded-2xl border border-[#101C35] bg-[#F6F8FA] p-5">
                <div className="flex items-center justify-between text-xs text-[#7D8792]">
                  <span className="font-mono font-semibold text-[#101C35]">
                    {activePartner.dealerCode}
                  </span>
                  <span>
                    {activePartner.level} · {activePartner.country}
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-semibold text-[#101C35]">
                  {activePartner.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#7D8792]">
                  {activePartner.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-[#E5E9ED] pt-3 text-xs text-[#202226]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#7D8792]" />
                    <span className="font-mono">{activePartner.demoEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#7D8792]" />
                    <span className="font-mono tabular-nums">{activePartner.demoPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#7D8792]" />
                    <span>{activePartner.workingHours}</span>
                  </div>
                  <div className="text-[11px] text-[#7D8792]">
                    Contact: {activePartner.contactPerson} · {activePartner.coordinatesLabel}
                  </div>
                </div>
              </div>
            )}

            <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
              {filtered.map((partner) => {
                const isSelected = activePartner?.id === partner.id;
                return (
                  <button
                    key={partner.id}
                    type="button"
                    onClick={() => setSelectedId(partner.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-start text-xs transition-colors ${
                      isSelected
                        ? 'border-[#101C35] bg-white font-semibold text-[#101C35]'
                        : 'border-[#E5E9ED] bg-white text-[#7D8792] hover:border-[#7D8792] hover:text-[#101C35]'
                    }`}
                  >
                    <span className="truncate">
                      {partner.country} — {partner.city}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-[#7D8792]">
                      {partner.type === 'both'
                        ? 'Dealer + Service'
                        : partner.type === 'dealer'
                          ? 'Dealer'
                          : 'Service'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
