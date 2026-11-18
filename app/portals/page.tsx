'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Building2,
  ClipboardCheck,
  Database,
  Globe,
  Instagram,
  LayoutGrid,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { RamaxAssistant } from '@/components/ai/RamaxAssistant';
import { PortalLoginExperience } from '@/components/portals/PortalLoginExperience';
import { DealerHubWorkspace } from '@/components/portals/DealerHubWorkspace';
import { DealerOrganization, PortalUserAccount } from '@/lib/auth/demo-accounts';
import { PRODUCT_CATEGORIES, REPAIR_14_STEPS } from '@/lib/architecture-data';

type PortalModule = 'dealer' | 'service' | 'admin' | 'customer' | 'pim' | 'builder' | 'instagram';

const INITIAL_BUILDER_SECTIONS = [
  { id: 'sec-1', type: 'Hero Banner', title: 'Engineered for Industrial Endurance', status: 'Published' },
  { id: 'sec-2', type: 'TOP LINE Showcase', title: 'Titanium Impact Series', status: 'Published' },
  { id: 'sec-3', type: 'Dealer Promotion Strip', title: 'Q4 Authorized Partner Program', status: 'Draft' },
];

export default function PortalsPage() {
  const [user, setUser] = useState<Omit<PortalUserAccount, 'passcode'> | null>(null);
  const [visibleOrgs, setVisibleOrgs] = useState<DealerOrganization[]>([]);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeModule, setActiveModule] = useState<PortalModule>('dealer');

  // Admin / Service / PIM state
  const [searchQuery, setSearchQuery] = useState('');
  const [repairStep, setRepairStep] = useState(9);
  const [builderSections, setBuilderSections] = useState(INITIAL_BUILDER_SECTIONS);
  const [demoDirectoryEnabled, setDemoDirectoryEnabled] = useState(true);
  const [igHandle, setIgHandle] = useState('@drawolt.official');
  const [igTokenStatus, setIgTokenStatus] = useState('Not connected (Awaiting Meta Graph API credentials)');

  const applySessionPayload = useCallback((data: { user?: Omit<PortalUserAccount, 'passcode'> | null; visibleOrgs?: DealerOrganization[] }) => {
    setUser(data.user || null);
    setVisibleOrgs(data.visibleOrgs || []);
    const params =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const requestedTab = params?.get('tab') as PortalModule | null;
    const role = data.user?.role;
    const isAllowedTab =
      requestedTab &&
      ((requestedTab === 'dealer' && role !== 'SERVICE_MANAGER') ||
        requestedTab === 'service' ||
        requestedTab === 'customer' ||
        ((requestedTab === 'admin' ||
          requestedTab === 'instagram' ||
          requestedTab === 'pim' ||
          requestedTab === 'builder') &&
          role === 'SUPER_ADMIN'));

    if (isAllowedTab && requestedTab) {
      setActiveModule(requestedTab);
    } else if (role === 'SERVICE_MANAGER') {
      setActiveModule('service');
    } else {
      setActiveModule('dealer');
    }
  }, []);

  const loadSession = useCallback(async () => {
    setCheckingSession(true);
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        applySessionPayload(data);
      }
    } finally {
      setCheckingSession(false);
    }
  }, [applySessionPayload]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          applySessionPayload(data);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCheckingSession(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [applySessionPayload]);

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    setUser(null);
    setVisibleOrgs([]);
  };

  const filteredCats = PRODUCT_CATEGORIES.filter(
    (c) =>
      c.names.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skuPrefix.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addBuilderSection = () => {
    setBuilderSections((prev) => [
      ...prev,
      {
        id: `sec-${prev.length + 1}`,
        type: 'Engineering Spec Block',
        title: `Custom Section ${prev.length + 1}`,
        status: 'Draft',
      },
    ]);
  };

  return (
    <LocaleProvider initialLocale="en">
      <div className="min-h-screen bg-[#F6F8FA] text-[#101C35]">
        <SiteHeader />

        <main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
          {checkingSession ? (
            <div className="rounded-2xl border border-[#E5E9ED] bg-white p-12 text-center text-sm text-[#7D8792]">
              Verifying signed DRAWOLT portal session...
            </div>
          ) : !user ? (
            <PortalLoginExperience onLoginSuccess={() => void loadSession()} />
          ) : (
            <>
              <div className="flex flex-col justify-between gap-4 border-b border-[#E5E9ED] pb-6 lg:flex-row lg:items-end">
                <div>
                  <p className="text-xs font-medium text-[#7D8792]">
                    Signed Session Active · {user.displayName} ({user.role})
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#101C35] sm:text-3xl">
                    DRAWOLT Enterprise Operations & Partner Hub
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-1 rounded-xl border border-[#E5E9ED] bg-white p-1">
                    {(
                      [
                        { id: 'dealer', label: 'Dealer Hub', Icon: Building2, allowed: user.role !== 'SERVICE_MANAGER' },
                        { id: 'service', label: 'Service Hub (14-Step)', Icon: Wrench, allowed: true },
                        { id: 'admin', label: 'Command & SEO', Icon: Globe, allowed: user.role === 'SUPER_ADMIN' },
                        { id: 'instagram', label: 'Instagram Admin', Icon: Instagram, allowed: user.role === 'SUPER_ADMIN' },
                        { id: 'pim', label: 'Admin PIM', Icon: Database, allowed: user.role === 'SUPER_ADMIN' },
                        { id: 'builder', label: 'Page Builder', Icon: LayoutGrid, allowed: user.role === 'SUPER_ADMIN' },
                        { id: 'customer', label: 'DRAWOLT ID', Icon: ShieldCheck, allowed: true },
                      ] as const
                    )
                      .filter((t) => t.allowed)
                      .map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setActiveModule(id)}
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                            activeModule === id
                              ? 'bg-[#101C35] text-white'
                              : 'text-[#7D8792] hover:text-[#101C35]'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{label}</span>
                        </button>
                      ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E9ED] bg-white px-3.5 py-2 text-xs font-semibold text-[#101C35] hover:border-[#101C35]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              <div className="mt-6">
                {activeModule === 'dealer' && (
                  <DealerHubWorkspace user={user} visibleOrgs={visibleOrgs} />
                )}

                {activeModule === 'service' && (
                  <section className="rounded-2xl border border-[#E5E9ED] bg-white p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E9ED] pb-4">
                      <div>
                        <h2 className="text-lg font-semibold text-[#101C35]">
                          Authorized Service Ticket SRV-2026-8841 (Sample)
                        </h2>
                        <p className="text-xs text-[#7D8792]">
                          14-step auditable repair workflow. Isolated per Authorized Service Center.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRepairStep((s) => Math.max(1, s - 1))}
                          className="rounded-lg border border-[#E5E9ED] px-3 py-1.5 text-xs font-semibold text-[#101C35]"
                        >
                          Previous Step
                        </button>
                        <button
                          type="button"
                          onClick={() => setRepairStep((s) => Math.min(14, s + 1))}
                          className="rounded-lg bg-[#101C35] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Advance Step
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
                      {REPAIR_14_STEPS.map((st) => {
                        const active = st.step === repairStep;
                        const done = st.step < repairStep;
                        return (
                          <button
                            key={st.step}
                            type="button"
                            onClick={() => setRepairStep(st.step)}
                            className={`rounded-xl border p-3 text-start transition-colors ${
                              active
                                ? 'border-[#101C35] bg-[#101C35] text-white'
                                : done
                                  ? 'border-[#9DCB16] bg-[#F6F8FA] text-[#101C35]'
                                  : 'border-[#E5E9ED] bg-white text-[#7D8792]'
                            }`}
                          >
                            <div className="font-mono text-xs font-bold tabular-nums">
                              {String(st.step).padStart(2, '0')}
                            </div>
                            <div className="mt-1 text-xs font-semibold leading-snug">{st.title}</div>
                            <div className="mt-1.5 text-[11px] opacity-75">{st.actor}</div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {activeModule === 'admin' && user.role === 'SUPER_ADMIN' && (
                  <section className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-[#E5E9ED] bg-white p-5">
                        <div className="text-xs text-[#7D8792]">SEO Indexing Health</div>
                        <div className="mt-1 text-base font-semibold text-[#101C35]">
                          Sitemap, Robots & Hreflang Active
                        </div>
                        <p className="mt-1 text-xs text-[#7D8792]">
                          /sitemap.xml & /robots.txt configured. Private portals & demo dealers excluded.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#E5E9ED] bg-white p-5">
                        <div className="text-xs text-[#7D8792]">12-Country Demo Seed Mode</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#101C35]">
                            {demoDirectoryEnabled ? 'Staging Demo Active' : 'Verified Partners Only'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setDemoDirectoryEnabled((v) => !v)}
                            className="rounded-lg bg-[#101C35] px-3 py-1 text-xs font-semibold text-white"
                          >
                            Toggle
                          </button>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[#E5E9ED] bg-white p-5">
                        <div className="text-xs text-[#7D8792]">Structured Data (JSON-LD)</div>
                        <div className="mt-1 text-base font-semibold text-[#101C35]">
                          Organization + Multilingual Alternates
                        </div>
                        <p className="mt-1 text-xs text-[#7D8792]">
                          EN, FA, DE, AR canonical tags active.
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {activeModule === 'instagram' && user.role === 'SUPER_ADMIN' && (
                  <section className="rounded-2xl border border-[#E5E9ED] bg-white p-6">
                    <h2 className="text-base font-semibold text-[#101C35]">
                      Official Instagram Graph API Configuration
                    </h2>
                    <p className="mt-1 text-xs text-[#7D8792]">
                      Connect an authorized Meta Business / Instagram Graph API access token. No
                      unreliable scraping is permitted.
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={igHandle}
                        onChange={(e) => setIgHandle(e.target.value)}
                        className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-3.5 py-2 text-sm text-[#101C35]"
                      />
                      <div className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-3.5 py-2 text-xs text-[#7D8792]">
                        Status: <strong className="text-[#101C35]">{igTokenStatus}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setIgTokenStatus('Configuration saved locally; add META_IG_ACCESS_TOKEN in server Secrets to sync live feed.')
                      }
                      className="mt-4 rounded-lg bg-[#101C35] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Save Instagram Handle
                    </button>
                  </section>
                )}

                {activeModule === 'pim' && user.role === 'SUPER_ADMIN' && (
                  <section className="rounded-2xl border border-[#E5E9ED] bg-white p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E9ED] pb-4">
                      <h2 className="text-base font-semibold text-[#101C35]">
                        PIM Category Registry (EN / FA / DE / AR)
                      </h2>
                      <div className="relative">
                        <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-[#7D8792]" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Filter SKU prefix or title..."
                          className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] py-2 pr-3 pl-9 text-xs text-[#101C35]"
                        />
                      </div>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-start text-xs">
                        <thead className="border-b border-[#E5E9ED] text-[#7D8792]">
                          <tr>
                            <th className="py-2.5 text-start">Prefix</th>
                            <th className="py-2.5 text-start">English</th>
                            <th className="py-2.5 text-start">Persian (FA)</th>
                            <th className="py-2.5 text-start">German (DE)</th>
                            <th className="py-2.5 text-start">Arabic (AR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E9ED]">
                          {filteredCats.map((cat) => (
                            <tr key={cat.id}>
                              <td className="py-3 font-mono font-semibold text-[#101C35]">{cat.skuPrefix}</td>
                              <td className="py-3">{cat.names.en}</td>
                              <td className="py-3" dir="rtl">{cat.names.fa}</td>
                              <td className="py-3">{cat.names.de}</td>
                              <td className="py-3" dir="rtl">{cat.names.ar}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {activeModule === 'builder' && user.role === 'SUPER_ADMIN' && (
                  <section className="rounded-2xl border border-[#E5E9ED] bg-white p-6">
                    <div className="flex items-center justify-between border-b border-[#E5E9ED] pb-4">
                      <h2 className="text-base font-semibold text-[#101C35]">
                        Native Visual Page Builder
                      </h2>
                      <button
                        type="button"
                        onClick={addBuilderSection}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#101C35] px-3.5 py-2 text-xs font-semibold text-white"
                      >
                        <Plus className="h-3.5 w-3.5 text-[#9DCB16]" />
                        <span>Add Block</span>
                      </button>
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {builderSections.map((sec, i) => (
                        <div
                          key={sec.id}
                          className="flex items-center justify-between rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-3 text-xs"
                        >
                          <div>
                            <span className="font-mono text-[#7D8792]">0{i + 1}.</span>{' '}
                            <span className="font-semibold text-[#101C35]">{sec.title}</span>
                          </div>
                          <span className="font-semibold text-[#101C35]">{sec.status}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activeModule === 'customer' && (
                  <section className="rounded-2xl border border-[#E5E9ED] bg-white p-6">
                    <div className="flex items-start gap-3">
                      <ClipboardCheck className="mt-0.5 h-5 w-5 text-[#9DCB16]" />
                      <div>
                        <h2 className="text-base font-semibold text-[#101C35]">
                          DRAWOLT ID Ownership & Warranty Vault
                        </h2>
                        <p className="mt-1 text-xs text-[#7D8792]">
                          Serial ownership claims are bound to database serial hashes and never accept
                          format-only strings.
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </main>

        <SiteFooter />
        <RamaxAssistant />
      </div>
    </LocaleProvider>
  );
}
