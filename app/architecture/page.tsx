'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Database, Layers, Lock, Route as RouteIcon, Shield } from 'lucide-react';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ERD_ENTITIES, ROADMAP_PHASES } from '@/lib/architecture-data';
import {
  evaluateTenantAccess,
  PermissionAction,
  PlatformRole,
  RBAC_POLICIES,
} from '@/lib/rbac/policy';

const ROUTE_MAP = [
  { route: '/en, /fa, /de, /ar', area: 'Public Brand Experience (SEO Hreflang)', status: 'Live' },
  { route: '/sitemap.xml & /robots.txt', area: 'Multilingual Search Engine Indexing', status: 'Live' },
  { route: '/architecture', area: 'Architecture, ERD, RBAC Simulator & Roadmap', status: 'Live' },
  { route: '/portals', area: 'Signed Auth, Dealer Hub, Service Hub & Admin Command', status: 'Live Session' },
  { route: '/api/assistant', area: 'Ramax (راماکس) Streaming AI Concierge', status: 'Live SSE API' },
  { route: '/api/partner-application', area: '4-Step Onboarding & SHA-256 Document Validation', status: 'Live Server API' },
  { route: '/api/dealer/orders', area: 'RBAC Tenant-Isolated Ordering & Immutable Invoices', status: 'Live Server API' },
];

export default function ArchitecturePage() {
  const [selectedDomain, setSelectedDomain] = useState<string>(ERD_ENTITIES[0].domain);
  const [simRole, setSimRole] = useState<PlatformRole>('DEALER_ADMIN');
  const [simActorOrg, setSimActorOrg] = useState<string>('ORG-DLR-DE');
  const [simTargetOrg, setSimTargetOrg] = useState<string>('ORG-DLR-AE');
  const [simTargetDomain, setSimTargetDomain] = useState<'dealer' | 'service' | 'pim' | 'audit'>('dealer');
  const [simAction, setSimAction] = useState<PermissionAction>('dealer:read_own');

  const simResult = evaluateTenantAccess({
    role: simRole,
    actorOrgId: simRole === 'SUPER_ADMIN' ? null : simActorOrg,
    targetOrgId: simTargetOrg,
    targetDomain: simTargetDomain,
    action: simAction,
  });

  return (
    <LocaleProvider initialLocale="en">
      <div className="min-h-screen bg-white text-[#101C35]">
        <SiteHeader />

        <main className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E5E9ED] pb-8">
            <div>
              <p className="text-xs font-semibold text-[#7D8792]">
                DRAWOLT Enterprise Architecture & RBAC Blueprint · drawolt.com
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#101C35] sm:text-4xl">
                System Architecture, RBAC Isolation & Database ERD
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#7D8792]">
                Complete architectural specification guaranteeing strict multi-tenant data isolation
                across sales dealers, authorized service centers, immutable financial ledgers, and
                global administration.
              </p>
            </div>
            <Link
              href="/portals"
              className="whitespace-nowrap rounded-lg bg-[#9DCB16] px-5 py-2.5 text-xs font-bold text-[#101C35] transition-colors hover:bg-[#8EB812]"
            >
              Open Partner Hub (Login)
            </Link>
          </div>

          {/* 1. Architecture Stack & Security */}
          <section className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-6">
              <Layers className="h-5 w-5 text-[#9DCB16]" />
              <h2 className="mt-3 text-base font-semibold text-[#101C35]">Frontend & 3D Layer</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#7D8792]">
                Next.js 15 App Router, TypeScript, Tailwind CSS v4, Motion for React, Three.js PBR
                engineering stage, and localized LTR/RTL routing across EN, FA, DE, and AR.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-6">
              <Database className="h-5 w-5 text-[#9DCB16]" />
              <h2 className="mt-3 text-base font-semibold text-[#101C35]">Target Enterprise Core</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#7D8792]">
                Laravel 11+ / PHP 8.3 REST & OpenAPI backend, PostgreSQL Row-Level Security schemas,
                Redis cache & Horizon queues, S3 media pipeline, and immutable financial snapshots.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-6">
              <Shield className="h-5 w-5 text-[#9DCB16]" />
              <h2 className="mt-3 text-base font-semibold text-[#101C35]">Security & Isolation</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#7D8792]">
                Tenant-scoped dealer and service center queries, mandatory admin MFA, database-backed
                serial registry verification, and append-only audit logs.
              </p>
            </div>
          </section>

          {/* 2. Comprehensive RBAC Policy Matrix + Interactive Tenant Isolation Simulator */}
          <section className="mt-14 border-t border-[#E5E9ED] pt-12">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#9DCB16]" />
              <h2 className="text-2xl font-semibold text-[#101C35]">
                Comprehensive RBAC Matrix & Tenant Isolation Simulator
              </h2>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#E5E9ED]">
              <table className="w-full text-start text-xs">
                <thead className="border-b border-[#E5E9ED] bg-[#F6F8FA] font-semibold text-[#7D8792]">
                  <tr>
                    <th className="px-4 py-3 text-start">Role</th>
                    <th className="px-4 py-3 text-start">Isolation Boundary</th>
                    <th className="px-4 py-3 text-start">PostgreSQL RLS / Policy Rule</th>
                    <th className="px-4 py-3 text-start">MFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E9ED] bg-white">
                  {Object.values(RBAC_POLICIES).map((pol) => (
                    <tr key={pol.role}>
                      <td className="px-4 py-3 font-semibold text-[#101C35]">
                        {pol.label}
                        <div className="font-mono text-[10px] text-[#7D8792]">{pol.role}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[#101C35]">{pol.isolationBoundary}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[#202226]">{pol.sqlRlsRule}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#101C35]">{pol.mfaPolicy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live Policy Simulator */}
            <div className="mt-6 rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-6">
              <h3 className="text-sm font-semibold text-[#101C35]">
                Live Multi-Tenant Isolation Tester
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
                <select
                  value={simRole}
                  onChange={(e) => setSimRole(e.target.value as PlatformRole)}
                  className="rounded-lg border border-[#E5E9ED] bg-white px-3 py-2 text-xs font-semibold text-[#101C35]"
                >
                  {(Object.keys(RBAC_POLICIES) as PlatformRole[]).map((r) => (
                    <option key={r} value={r}>
                      Role: {r}
                    </option>
                  ))}
                </select>
                <select
                  value={simActorOrg}
                  onChange={(e) => setSimActorOrg(e.target.value)}
                  className="rounded-lg border border-[#E5E9ED] bg-white px-3 py-2 font-mono text-xs text-[#101C35]"
                >
                  <option value="ORG-DLR-DE">Actor Org: ORG-DLR-DE</option>
                  <option value="ORG-DLR-AE">Actor Org: ORG-DLR-AE</option>
                  <option value="ORG-SRV-IR">Actor Org: ORG-SRV-IR</option>
                </select>
                <select
                  value={simTargetOrg}
                  onChange={(e) => setSimTargetOrg(e.target.value)}
                  className="rounded-lg border border-[#E5E9ED] bg-white px-3 py-2 font-mono text-xs text-[#101C35]"
                >
                  <option value="ORG-DLR-DE">Target Org: ORG-DLR-DE</option>
                  <option value="ORG-DLR-AE">Target Org: ORG-DLR-AE</option>
                  <option value="ORG-SRV-IR">Target Org: ORG-SRV-IR</option>
                </select>
                <select
                  value={simTargetDomain}
                  onChange={(e) =>
                    setSimTargetDomain(e.target.value as 'dealer' | 'service' | 'pim' | 'audit')
                  }
                  className="rounded-lg border border-[#E5E9ED] bg-white px-3 py-2 text-xs text-[#101C35]"
                >
                  <option value="dealer">Domain: Dealer</option>
                  <option value="service">Domain: Service</option>
                  <option value="pim">Domain: PIM</option>
                  <option value="audit">Domain: Audit</option>
                </select>
                <select
                  value={simAction}
                  onChange={(e) => setSimAction(e.target.value as PermissionAction)}
                  className="rounded-lg border border-[#E5E9ED] bg-white px-3 py-2 font-mono text-xs text-[#101C35]"
                >
                  <option value="dealer:read_own">dealer:read_own</option>
                  <option value="dealer:order_approve">dealer:order_approve</option>
                  <option value="finance:invoice_issue">finance:invoice_issue</option>
                  <option value="service:read_own">service:read_own</option>
                  <option value="audit:read">audit:read</option>
                </select>
              </div>
              <div
                className={`mt-4 rounded-xl border px-4 py-3 font-mono text-xs font-semibold ${
                  simResult.allowed
                    ? 'border-[#9DCB16] bg-white text-[#101C35]'
                    : 'border-red-300 bg-red-50 text-red-800'
                }`}
              >
                {simResult.reason}
              </div>
            </div>
          </section>

          {/* 3. Interactive Database ERD */}
          <section id="erd" className="mt-14 border-t border-[#E5E9ED] pt-12">
            <h2 className="text-2xl font-semibold text-[#101C35]">PostgreSQL Database ERD</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {ERD_ENTITIES.map((grp) => (
                <button
                  key={grp.domain}
                  type="button"
                  onClick={() => setSelectedDomain(grp.domain)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    selectedDomain === grp.domain
                      ? 'bg-[#101C35] text-white'
                      : 'border border-[#E5E9ED] bg-[#F6F8FA] text-[#7D8792] hover:text-[#101C35]'
                  }`}
                >
                  {grp.domain}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {ERD_ENTITIES.find((g) => g.domain === selectedDomain)?.tables.map((tbl) => (
                <div
                  key={tbl.name}
                  className="rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-5"
                >
                  <div className="border-b border-[#E5E9ED] pb-2.5 font-mono text-sm font-semibold text-[#101C35]">
                    {tbl.name}
                  </div>
                  <ul className="mt-3 space-y-1.5 font-mono text-xs text-[#202226]">
                    {tbl.columns.map((col) => (
                      <li key={col}>{col}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Route Map & Design Tokens */}
          <section id="design-system" className="mt-14 grid grid-cols-1 gap-8 border-t border-[#E5E9ED] pt-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2">
                <RouteIcon className="h-5 w-5 text-[#9DCB16]" />
                <h2 className="text-xl font-semibold text-[#101C35]">Active Route Map</h2>
              </div>
              <div className="mt-4 divide-y divide-[#E5E9ED] rounded-2xl border border-[#E5E9ED] bg-white">
                {ROUTE_MAP.map((item) => (
                  <div key={item.route} className="flex items-center justify-between gap-4 px-4 py-3 text-xs">
                    <div>
                      <div className="font-mono font-semibold text-[#101C35]">{item.route}</div>
                      <div className="mt-0.5 text-[#7D8792]">{item.area}</div>
                    </div>
                    <span className="shrink-0 font-semibold text-[#101C35]">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <h2 className="text-xl font-semibold text-[#101C35]">Official DRAWOLT Design Tokens</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { name: 'Deep Lime', hex: '#9DCB16' },
                  { name: 'Midnight Navy', hex: '#101C35' },
                  { name: 'Dolphin Gray', hex: '#7D8792' },
                  { name: 'Charcoal', hex: '#202226' },
                  { name: 'Titanium', hex: '#777E87' },
                  { name: 'Carbon Black', hex: '#15171A' },
                ].map((swatch) => (
                  <div
                    key={swatch.hex}
                    className="flex items-center gap-3 rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-3"
                  >
                    <span
                      className="h-8 w-8 shrink-0 rounded-lg border border-black/10"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-[#101C35]">{swatch.name}</div>
                      <div className="font-mono text-[11px] text-[#7D8792]">{swatch.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Roadmap */}
          <section className="mt-14 border-t border-[#E5E9ED] pt-12">
            <h2 className="text-2xl font-semibold text-[#101C35]">Development Roadmap Checklist</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ROADMAP_PHASES.map((phase) => (
                <div
                  key={phase.phase}
                  className="rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-6"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-[#7D8792]">{phase.phase}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#101C35]">
                      {phase.status === 'completed' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#9DCB16]" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-[#7D8792]" />
                      )}
                      <span className="capitalize">{phase.status}</span>
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-[#101C35]">{phase.title}</h3>
                  <ul className="mt-3 space-y-2 text-xs text-[#202226]">
                    {phase.items.map((it) => (
                      <li key={it} className="leading-relaxed">
                        · {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </LocaleProvider>
  );
}
