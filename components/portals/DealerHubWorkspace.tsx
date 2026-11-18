'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Lock,
  PackageCheck,
  Printer,
  ShoppingCart,
  Tag,
  TrendingUp,
} from 'lucide-react';
import {
  DEALER_CATALOG_SAMPLES,
  DealerOrderRecord,
  DealerOrganization,
  PortalUserAccount,
} from '@/lib/auth/demo-accounts';
import { MultiStepPartnerOnboarding } from '@/components/partners/MultiStepPartnerOnboarding';

type DealerSection = 'overview' | 'ordering' | 'ledger' | 'promotions' | 'onboarding' | 'audit';

interface AuditRow {
  id: string;
  timestamp: string;
  actorEmail: string;
  role: string;
  action: string;
  targetId: string;
  outcome: 'ALLOWED' | 'DENIED';
}

export function DealerHubWorkspace({
  user,
  visibleOrgs,
}: {
  user: Omit<PortalUserAccount, 'passcode'>;
  visibleOrgs: DealerOrganization[];
}) {
  const [section, setSection] = useState<DealerSection>('overview');
  const [selectedOrgId, setSelectedOrgId] = useState<string>(visibleOrgs[0]?.orgId || '');
  const [orders, setOrders] = useState<DealerOrderRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({
    'DW-TL-IW120-SAMPLE': 10,
    'DW-CL-AG18-SAMPLE': 15,
  });
  const [couponCode, setCouponCode] = useState('DW-Q4-BULK10');
  const [docType, setDocType] = useState<'Purchase Order' | 'Proforma Invoice'>('Proforma Invoice');
  const [orderStatusMsg, setOrderStatusMsg] = useState<string | null>(null);
  const [printableOrder, setPrintableOrder] = useState<DealerOrderRecord | null>(null);

  const activeOrg = visibleOrgs.find((o) => o.orgId === selectedOrgId) || visibleOrgs[0] || null;

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/dealer/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setAuditLogs(data.auditLogs || []);
      }
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/dealer/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setOrders(data.orders || []);
          setAuditLogs(data.auditLogs || []);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingOrders(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const orgOrders = orders.filter((o) => !activeOrg || o.dealerOrgId === activeOrg.orgId);

  const handleCreateOrder = async () => {
    if (!activeOrg) return;
    setOrderStatusMsg(null);
    const items = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([sku, qty]) => ({ sku, qty }));

    if (items.length === 0) {
      setOrderStatusMsg('Add at least one SKU quantity to place an order.');
      return;
    }

    const res = await fetch('/api/dealer/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealerOrgId: activeOrg.orgId,
        docType,
        couponCode: couponCode.trim() || undefined,
        items,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setOrderStatusMsg(data.error || 'Failed to create order.');
    } else {
      setOrderStatusMsg(`Created ${data.order.docType} ${data.order.id} successfully.`);
      await fetchOrders();
      setSection('ledger');
    }
  };

  const handleAdminOperation = async (orderId: string, operation: 'approve' | 'lock_invoice') => {
    const res = await fetch('/api/dealer/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, operation }),
    });
    const data = await res.json();
    if (!res.ok) {
      setOrderStatusMsg(data.error || 'Permission denied.');
    } else {
      setOrderStatusMsg(`Order ${orderId} updated (${data.order.status}).`);
      await fetchOrders();
    }
  };

  const exportCsv = () => {
    const rows = [
      ['Document ID', 'Dealer', 'Type', 'Status', 'Currency', 'Total', 'Snapshot Hash'],
      ...orgOrders.map((o) => [
        o.id,
        o.dealerName,
        o.docType,
        o.status,
        o.currency,
        String(o.totalAmount),
        o.lockedSnapshotHash || 'UNLOCKED',
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v.replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drawolt-dealer-ledger-${activeOrg?.dealerCode || 'all'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const creditPercent = activeOrg
    ? Math.min(100, Math.round((activeOrg.outstandingBalance / activeOrg.creditLimit) * 100))
    : 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left SaaS Sidebar (240px aesthetic) */}
      <aside className="rounded-2xl border border-[#E5E9ED] bg-white p-4 lg:col-span-3">
        <div className="border-b border-[#E5E9ED] pb-4">
          <div className="text-[11px] font-semibold text-[#7D8792]">Authenticated Tenant</div>
          <div className="mt-1 text-sm font-semibold text-[#101C35]">
            {activeOrg?.companyName || user.orgName}
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-[#7D8792]">
            {user.role} · {activeOrg?.dealerCode || 'GLOBAL'}
          </div>
        </div>

        {user.role === 'SUPER_ADMIN' && visibleOrgs.length > 1 && (
          <div className="mt-4 border-b border-[#E5E9ED] pb-4">
            <label className="block text-[11px] font-semibold text-[#7D8792]">
              Super Admin Tenant Inspector
            </label>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-2.5 py-2 text-xs font-semibold text-[#101C35]"
            >
              {visibleOrgs.map((org) => (
                <option key={org.orgId} value={org.orgId}>
                  {org.country} — {org.companyName}
                </option>
              ))}
            </select>
          </div>
        )}

        <nav className="mt-4 space-y-1">
          {(
            [
              { id: 'overview', label: 'Dashboard & Intelligence', Icon: TrendingUp },
              { id: 'ordering', label: 'Bulk Order & Price List', Icon: ShoppingCart },
              { id: 'ledger', label: 'Orders & Immutable Invoices', Icon: FileText },
              { id: 'promotions', label: 'Promotions & Coupons', Icon: Tag },
              { id: 'onboarding', label: 'Partner Onboarding Form', Icon: PackageCheck },
              ...(user.role === 'SUPER_ADMIN'
                ? [{ id: 'audit', label: 'RBAC Security Audit Log', Icon: Lock }]
                : []),
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id as DealerSection)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-xs font-semibold transition-colors ${
                section === id
                  ? 'bg-[#101C35] text-white'
                  : 'text-[#7D8792] hover:bg-[#F6F8FA] hover:text-[#101C35]'
              }`}
            >
              <Icon className={`h-4 w-4 ${section === id ? 'text-[#9DCB16]' : ''}`} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Viewport */}
      <div className="space-y-6 lg:col-span-9">
        {orderStatusMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-[#9DCB16] bg-white px-4 py-3 text-xs font-medium text-[#101C35]">
            <CheckCircle2 className="h-4 w-4 text-[#9DCB16]" />
            <span>{orderStatusMsg}</span>
          </div>
        )}

        {section === 'overview' && activeOrg && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-[#E5E9ED] bg-white p-5">
                <div className="text-xs text-[#7D8792]">Dealer Discount Tier</div>
                <div className="mt-1.5 font-mono text-2xl font-semibold text-[#101C35] tabular-nums">
                  {activeOrg.discountPercent}%
                </div>
                <div className="mt-1 text-[11px] text-[#7D8792]">{activeOrg.tier}</div>
              </div>
              <div className="rounded-xl border border-[#E5E9ED] bg-white p-5">
                <div className="text-xs text-[#7D8792]">Credit Limit</div>
                <div className="mt-1.5 font-mono text-2xl font-semibold text-[#101C35] tabular-nums">
                  {activeOrg.currency} {activeOrg.creditLimit.toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] text-[#7D8792]">Sample B2B Ceiling</div>
              </div>
              <div className="rounded-xl border border-[#E5E9ED] bg-white p-5">
                <div className="text-xs text-[#7D8792]">Outstanding Balance</div>
                <div className="mt-1.5 font-mono text-2xl font-semibold text-[#101C35] tabular-nums">
                  {activeOrg.currency} {activeOrg.outstandingBalance.toLocaleString()}
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1F3]">
                  <div
                    className="h-full bg-[#9DCB16]"
                    style={{ width: `${creditPercent}%` }}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-[#E5E9ED] bg-white p-5">
                <div className="text-xs text-[#7D8792]">Active Documents</div>
                <div className="mt-1.5 font-mono text-2xl font-semibold text-[#101C35] tabular-nums">
                  {orgOrders.length}
                </div>
                <div className="mt-1 text-[11px] text-[#7D8792]">Tenant-scoped records</div>
              </div>
            </div>

            {/* Dealer Intelligence Panel */}
            <div className="rounded-2xl border border-[#E5E9ED] bg-white p-6">
              <h2 className="text-sm font-semibold text-[#101C35]">
                Dealer Intelligence & Reorder Insights (Estimated Sample Guidance)
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4 text-xs">
                  <div className="font-semibold text-[#101C35]">
                    Recommended Reorder: TOP LINE Series
                  </div>
                  <p className="mt-1 text-[#7D8792]">
                    Combine 10+ units of <span className="font-mono">DW-TL-IW120-SAMPLE</span> with
                    coupon <span className="font-mono font-semibold text-[#101C35]">DW-Q4-BULK10</span>{' '}
                    for an extra 10% promotional tier discount.
                  </p>
                </div>
                <div className="rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4 text-xs">
                  <div className="font-semibold text-[#101C35]">
                    Territory Coverage: {activeOrg.territory}
                  </div>
                  <p className="mt-1 text-[#7D8792]">
                    Data strictly isolated to <span className="font-mono">{activeOrg.orgId}</span>.
                    Other regional dealers cannot view your pricing or invoice history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === 'ordering' && activeOrg && (
          <div className="rounded-2xl border border-[#E5E9ED] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E9ED] pb-4">
              <div>
                <h2 className="text-base font-semibold text-[#101C35]">
                  Dealer Wholesale Price List & Bulk Order Builder
                </h2>
                <p className="text-xs text-[#7D8792]">
                  Automatic {activeOrg.discountPercent}% dealer discount applied ({activeOrg.tier})
                </p>
              </div>
              <select
                value={docType}
                onChange={(e) =>
                  setDocType(e.target.value as 'Purchase Order' | 'Proforma Invoice')
                }
                className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-3 py-2 text-xs font-semibold text-[#101C35]"
              >
                <option value="Proforma Invoice">Generate Proforma Invoice</option>
                <option value="Purchase Order">Submit Purchase Order</option>
              </select>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="border-b border-[#E5E9ED] text-[#7D8792]">
                  <tr>
                    <th className="py-2.5 text-start">SKU</th>
                    <th className="py-2.5 text-start">Product</th>
                    <th className="py-2.5 text-end">List Price</th>
                    <th className="py-2.5 text-end">Dealer Net</th>
                    <th className="py-2.5 text-end">Order Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E9ED]">
                  {DEALER_CATALOG_SAMPLES.map((item) => {
                    const net = (item.listPriceEur * (1 - activeOrg.discountPercent / 100)).toFixed(2);
                    return (
                      <tr key={item.sku}>
                        <td className="py-3 font-mono font-semibold text-[#101C35]">{item.sku}</td>
                        <td className="py-3 text-[#202226]">{item.name}</td>
                        <td className="py-3 text-end font-mono text-[#7D8792] tabular-nums">
                          {activeOrg.currency} {item.listPriceEur.toFixed(2)}
                        </td>
                        <td className="py-3 text-end font-mono font-semibold text-[#101C35] tabular-nums">
                          {activeOrg.currency} {net}
                        </td>
                        <td className="py-3 text-end">
                          <input
                            type="number"
                            min={0}
                            max={1000}
                            value={cart[item.sku] ?? 0}
                            onChange={(e) =>
                              setCart((prev) => ({
                                ...prev,
                                [item.sku]: Math.max(0, parseInt(e.target.value || '0', 10)),
                              }))
                            }
                            className="w-20 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-2.5 py-1.5 text-end font-mono text-xs text-[#101C35] tabular-nums"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E9ED] pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo coupon (try DW-Q4-BULK10)"
                  className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-3 py-2 font-mono text-xs text-[#101C35]"
                />
                <span className="text-[11px] text-[#7D8792]">Active code: DW-Q4-BULK10</span>
              </div>

              <button
                type="button"
                onClick={() => void handleCreateOrder()}
                className="rounded-lg bg-[#9DCB16] px-5 py-2.5 text-xs font-bold text-[#101C35] transition-colors hover:bg-[#8EB812]"
              >
                Create {docType}
              </button>
            </div>
          </div>
        )}

        {section === 'ledger' && (
          <div className="overflow-hidden rounded-2xl border border-[#E5E9ED] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E9ED] px-6 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#101C35]">
                  Orders, Proforma & Immutable Commercial Invoices
                </h2>
                <p className="text-xs text-[#7D8792]">
                  Issued commercial invoices lock a cryptographic SHA-256 snapshot.
                </p>
              </div>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-3 py-1.5 text-xs font-semibold text-[#101C35] hover:border-[#101C35]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-6 text-xs text-[#7D8792]">Loading tenant-scoped documents...</div>
            ) : orgOrders.length === 0 ? (
              <div className="p-6 text-xs text-[#7D8792]">No documents found for this tenant.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="border-b border-[#E5E9ED] bg-[#F6F8FA] text-[#7D8792]">
                    <tr>
                      <th className="px-4 py-3 text-start">Document</th>
                      <th className="px-4 py-3 text-start">Type</th>
                      <th className="px-4 py-3 text-start">Status</th>
                      <th className="px-4 py-3 text-end">Total</th>
                      <th className="px-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E9ED]">
                    {orgOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="px-4 py-3 font-mono font-semibold text-[#101C35]">
                          {ord.id}
                          {ord.lockedSnapshotHash && (
                            <div className="text-[10px] font-normal text-[#7D8792]">
                              {ord.lockedSnapshotHash}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#202226]">{ord.docType}</td>
                        <td className="px-4 py-3 font-semibold text-[#101C35]">{ord.status}</td>
                        <td className="px-4 py-3 text-end font-mono font-semibold text-[#101C35] tabular-nums">
                          {ord.currency} {ord.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPrintableOrder(ord)}
                              className="inline-flex items-center gap-1 rounded border border-[#E5E9ED] px-2 py-1 text-[11px] font-semibold text-[#101C35] hover:bg-[#F6F8FA]"
                            >
                              <Printer className="h-3 w-3" />
                              <span>Print</span>
                            </button>
                            {user.role === 'SUPER_ADMIN' && ord.status === 'Pending Approval' && (
                              <button
                                type="button"
                                onClick={() => void handleAdminOperation(ord.id, 'approve')}
                                className="rounded bg-[#101C35] px-2 py-1 text-[11px] font-semibold text-white"
                              >
                                Approve
                              </button>
                            )}
                            {user.role === 'SUPER_ADMIN' && ord.status !== 'Invoiced (Locked)' && (
                              <button
                                type="button"
                                onClick={() => void handleAdminOperation(ord.id, 'lock_invoice')}
                                className="rounded bg-[#9DCB16] px-2 py-1 text-[11px] font-bold text-[#101C35]"
                              >
                                Issue Invoice
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {section === 'promotions' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                code: 'DW-Q4-BULK10',
                title: 'Q4 Industrial Bulk Incentive (+10% Extra)',
                scope: 'All Authorized Distributors · Valid in Bulk Order Builder',
              },
              {
                code: 'TOPLINE-LAUNCH',
                title: 'TOP LINE Titanium Display Bundle',
                scope: 'Minimum 5 units · Territory Marketing Kit Included',
              },
            ].map((promo) => (
              <div key={promo.code} className="rounded-2xl border border-[#E5E9ED] bg-white p-5">
                <div className="font-mono text-xs font-bold text-[#101C35]">{promo.code}</div>
                <h3 className="mt-1.5 text-sm font-semibold text-[#101C35]">{promo.title}</h3>
                <p className="mt-1 text-xs text-[#7D8792]">{promo.scope}</p>
              </div>
            ))}
          </div>
        )}

        {section === 'onboarding' && <MultiStepPartnerOnboarding />}

        {section === 'audit' && user.role === 'SUPER_ADMIN' && (
          <div className="rounded-2xl border border-[#E5E9ED] bg-white p-6">
            <h2 className="text-sm font-semibold text-[#101C35]">
              RBAC & Financial Snapshot Security Audit Log
            </h2>
            <div className="mt-4 space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-xs"
                >
                  <div>
                    <span className="font-mono font-semibold text-[#101C35]">{log.actorEmail}</span>
                    <span className="mx-2 text-[#7D8792]">·</span>
                    <span>{log.action}</span>
                    <span className="mx-2 text-[#7D8792]">·</span>
                    <span className="font-mono text-[#7D8792]">{log.targetId}</span>
                  </div>
                  <span className="font-mono font-bold text-[#101C35]">{log.outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Printable Document Modal */}
        {printableOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101C35]/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-[#E5E9ED] bg-white p-6 sm:p-8 shadow-2xl">
              <div className="flex items-start justify-between border-b border-[#E5E9ED] pb-4">
                <div>
                  <div className="font-mono text-xs text-[#7D8792]">{printableOrder.docType}</div>
                  <h3 className="text-xl font-semibold text-[#101C35]">{printableOrder.id}</h3>
                  <p className="text-xs text-[#7D8792]">{printableOrder.dealerName}</p>
                </div>
                <div className="text-end font-mono text-xs text-[#7D8792]">
                  <div>Date: {printableOrder.createdAt}</div>
                  <div>{printableOrder.lockedSnapshotHash || 'Draft / Non-Final'}</div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                {printableOrder.items.map((it) => (
                  <div key={it.sku} className="flex justify-between border-b border-[#E5E9ED] py-2">
                    <span>
                      <strong className="font-mono">{it.sku}</strong> · {it.name} × {it.qty}
                    </span>
                    <span className="font-mono tabular-nums">
                      {printableOrder.currency} {(it.qty * it.unitPrice).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-1 text-end font-mono text-xs">
                <div className="text-[#7D8792]">
                  Subtotal: {printableOrder.currency} {printableOrder.subtotal.toLocaleString()}
                </div>
                <div className="text-[#7D8792]">
                  Discount: -{printableOrder.currency} {printableOrder.discountAmount.toLocaleString()}
                </div>
                <div className="text-[#7D8792]">
                  Tax: {printableOrder.currency} {printableOrder.taxAmount.toLocaleString()}
                </div>
                <div className="text-base font-bold text-[#101C35]">
                  Total: {printableOrder.currency} {printableOrder.totalAmount.toLocaleString()}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#101C35] px-4 py-2 text-xs font-semibold text-white"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintableOrder(null)}
                  className="rounded-lg border border-[#E5E9ED] px-4 py-2 text-xs font-semibold text-[#101C35]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
