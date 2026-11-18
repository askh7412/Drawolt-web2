'use client';

import React, { useState } from 'react';
import { Download, FileCheck2, Search, ShieldCheck, Wrench } from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { REPAIR_14_STEPS } from '@/lib/architecture-data';

type WarrantyTab = 'verify' | 'register' | 'track' | 'downloads';

export function WarrantySupportSection() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<WarrantyTab>('verify');
  const [codeInput, setCodeInput] = useState('DW-TL-2026-00419');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const switchTab = (next: WarrantyTab) => {
    setActiveTab(next);
    setResult(null);
    setErrorMsg(null);
    if (next === 'track') {
      setCodeInput('SRV-2026-8841');
    } else if (next === 'verify' || next === 'register') {
      setCodeInput('DW-TL-2026-00419');
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const mode = activeTab === 'track' ? 'repair' : activeTab === 'register' ? 'register' : 'serial';
      const res = await fetch('/api/warranty-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          code: codeInput.trim(),
          ...(mode === 'register' && ownerEmail ? { ownerEmail: ownerEmail.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          [data.message, data.securityNote, data.sampleHint, data.error]
            .filter(Boolean)
            .join(' '),
        );
      } else {
        setResult(data);
      }
    } catch {
      setErrorMsg('Unable to reach server verification endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="warranty" className="border-t border-[#E5E9ED] bg-[#F6F8FA] py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#101C35] text-balance sm:text-4xl">
            {t.warranty.sectionTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#7D8792]">
            {t.warranty.sectionSubtitle}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-[#E5E9ED] bg-white p-6 sm:p-8">
          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-2 border-b border-[#E5E9ED] pb-4">
            {(
              [
                { id: 'verify', label: t.warranty.tabs.verify, Icon: ShieldCheck },
                { id: 'register', label: t.warranty.tabs.register, Icon: FileCheck2 },
                { id: 'track', label: t.warranty.tabs.track, Icon: Wrench },
                { id: 'downloads', label: t.warranty.tabs.downloads, Icon: Download },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  activeTab === id
                    ? 'bg-[#101C35] text-white'
                    : 'bg-[#F6F8FA] text-[#7D8792] hover:text-[#101C35]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {activeTab !== 'downloads' ? (
            <div className="mt-6">
              <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder={
                    activeTab === 'track'
                      ? t.warranty.trackPlaceholder
                      : t.warranty.serialPlaceholder
                  }
                  className="min-w-0 flex-1 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 font-mono text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
                />
                {activeTab === 'register' && (
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@company.com"
                    className="min-w-0 flex-1 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
                  />
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#101C35] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#202226] disabled:opacity-50"
                >
                  <Search className="h-4 w-4 text-[#9DCB16]" />
                  <span>
                    {loading
                      ? 'Checking...'
                      : activeTab === 'track'
                        ? t.warranty.trackButton
                        : t.warranty.verifyButton}
                  </span>
                </button>
              </form>

              <p className="mt-2.5 text-xs text-[#7D8792]">
                Sample registry keys: <code className="font-mono text-[#101C35]">DW-TL-2026-00419</code>,{' '}
                <code className="font-mono text-[#101C35]">DW-CL-2026-10284</code>, or repair{' '}
                <code className="font-mono text-[#101C35]">SRV-2026-8841</code>. Any unrecognized serial is rejected by the server.
              </p>

              {errorMsg && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                  {errorMsg}
                </div>
              )}

              {result && result.record != null && (
                <div className="mt-6 rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-5">
                  {activeTab === 'track' ? (
                    (() => {
                      const rec = result.record as {
                        trackingId: string;
                        serial: string;
                        centerName: string;
                        currentStep: number;
                        statusLabel: string;
                        updatedAt: string;
                      };
                      return (
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E9ED] pb-3">
                            <div>
                              <span className="font-mono text-xs font-semibold text-[#101C35] tabular-nums">
                                {rec.trackingId}
                              </span>
                              <span className="mx-2 text-[#7D8792]">·</span>
                              <span className="text-xs text-[#7D8792]">{rec.centerName}</span>
                            </div>
                            <span className="text-xs font-semibold text-[#101C35] tabular-nums">
                              Step {rec.currentStep} of 14
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-medium text-[#101C35]">{rec.statusLabel}</p>
                          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-7">
                            {REPAIR_14_STEPS.map((st) => {
                              const done = st.step <= rec.currentStep;
                              return (
                                <div
                                  key={st.step}
                                  className={`rounded-lg border p-2 text-[11px] ${
                                    done
                                      ? 'border-[#101C35] bg-white text-[#101C35]'
                                      : 'border-[#E5E9ED] bg-transparent text-[#7D8792]'
                                  }`}
                                >
                                  <div className="font-mono font-bold tabular-nums">
                                    {String(st.step).padStart(2, '0')}
                                  </div>
                                  <div className="mt-0.5 line-clamp-2 leading-tight">{st.title}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    (() => {
                      const rec = result.record as {
                        serial: string;
                        sku: string;
                        series: string;
                        category: string;
                        batchCode: string;
                        warrantyStatus: string;
                        registeredOwnerHint: string;
                        expiresAt: string;
                      };
                      return (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                          <div>
                            <div className="text-xs text-[#7D8792]">Serial (DRAWOLT ID)</div>
                            <div className="mt-1 font-mono text-sm font-semibold text-[#101C35] tabular-nums">
                              {rec.serial}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-[#7D8792]">Series & SKU</div>
                            <div className="mt-1 text-sm font-semibold text-[#101C35]">
                              {rec.series} · {rec.sku}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-[#7D8792]">Registry Status</div>
                            <div className="mt-1 text-sm font-semibold text-[#101C35]">
                              {rec.warrantyStatus}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-[#7D8792]">Coverage</div>
                            <div className="mt-1 font-mono text-sm font-semibold text-[#101C35] tabular-nums">
                              {rec.expiresAt}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'DRAWOLT Brand & Design System Spec',
                  meta: 'Official Tokens · Colors · Typography',
                  href: '/architecture#design-system',
                },
                {
                  title: 'Database ERD & API Schema',
                  meta: 'PostgreSQL · RBAC · Sanctum Contracts',
                  href: '/architecture#erd',
                },
                {
                  title: 'Service 14-Step SOP & Intake Forms',
                  meta: 'Auditable Workflow · PDF Templates',
                  href: '/portals?tab=service',
                },
              ].map((doc) => (
                <a
                  key={doc.title}
                  href={doc.href}
                  className="flex flex-col justify-between rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4 transition-colors hover:border-[#101C35]"
                >
                  <div>
                    <div className="text-xs text-[#7D8792]">{doc.meta}</div>
                    <h3 className="mt-1 text-sm font-semibold text-[#101C35]">{doc.title}</h3>
                  </div>
                  <span className="mt-4 text-xs font-semibold text-[#101C35] underline decoration-[#9DCB16] decoration-2 underline-offset-4">
                    Open Document
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
