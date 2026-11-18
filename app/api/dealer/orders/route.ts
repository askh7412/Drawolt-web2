import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getActivePortalUser } from '@/lib/auth/session';
import {
  DEALER_CATALOG_SAMPLES,
  DealerOrderRecord,
  INITIAL_DEALER_ORDERS,
  INITIAL_DEALER_ORGS,
} from '@/lib/auth/demo-accounts';
import { evaluateTenantAccess } from '@/lib/rbac/policy';

// In-memory store for session prototype persistence across requests in the running Node process
const orderStore: DealerOrderRecord[] = [...INITIAL_DEALER_ORDERS];
const auditLogStore: {
  id: string;
  timestamp: string;
  actorEmail: string;
  role: string;
  action: string;
  targetId: string;
  outcome: 'ALLOWED' | 'DENIED';
}[] = [
  {
    id: 'AUD-2026-001',
    timestamp: '2026-11-12T09:15:00Z',
    actorEmail: 'admin@drawolt.com',
    role: 'SUPER_ADMIN',
    action: 'finance:invoice_issue (Immutable Snapshot)',
    targetId: 'INV-2026-9041',
    outcome: 'ALLOWED',
  },
];

const CreateOrderSchema = z.object({
  dealerOrgId: z.string().min(3),
  docType: z.enum(['Purchase Order', 'Proforma Invoice']),
  couponCode: z.string().trim().max(32).optional(),
  items: z
    .array(
      z.object({
        sku: z.string().min(2),
        qty: z.number().int().min(1).max(10000),
      }),
    )
    .min(1),
});

const ActionOrderSchema = z.object({
  orderId: z.string().min(3),
  operation: z.enum(['approve', 'lock_invoice']),
});

export async function GET() {
  const user = await getActivePortalUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const orders = orderStore.filter((ord) => {
    const check = evaluateTenantAccess({
      role: user.role,
      actorOrgId: user.orgId,
      targetOrgId: ord.dealerOrgId,
      targetDomain: 'dealer',
      action: user.role === 'SUPER_ADMIN' ? 'dealer:read_all' : 'dealer:read_own',
    });
    return check.allowed;
  });

  const canReadAudit = evaluateTenantAccess({
    role: user.role,
    actorOrgId: user.orgId,
    targetOrgId: null,
    targetDomain: 'audit',
    action: 'audit:read',
  }).allowed;

  return NextResponse.json({
    orders,
    auditLogs: canReadAudit ? auditLogStore : [],
  });
}

export async function POST(req: NextRequest) {
  const user = await getActivePortalUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid order payload.' }, { status: 400 });
    }

    const access = evaluateTenantAccess({
      role: user.role,
      actorOrgId: user.orgId,
      targetOrgId: parsed.data.dealerOrgId,
      targetDomain: 'dealer',
      action: 'dealer:order_create',
    });

    if (!access.allowed) {
      auditLogStore.unshift({
        id: `AUD-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        actorEmail: user.email,
        role: user.role,
        action: `Attempted cross-tenant order create on ${parsed.data.dealerOrgId}`,
        targetId: parsed.data.dealerOrgId,
        outcome: 'DENIED',
      });
      return NextResponse.json({ error: access.reason }, { status: 403 });
    }

    const org = INITIAL_DEALER_ORGS.find((o) => o.orgId === parsed.data.dealerOrgId);
    if (!org) {
      return NextResponse.json({ error: 'Target dealer organization not found.' }, { status: 404 });
    }

    const lineItems = parsed.data.items.map((reqItem) => {
      const cat = DEALER_CATALOG_SAMPLES.find((c) => c.sku === reqItem.sku);
      if (!cat) {
        throw new Error(`Unknown SKU: ${reqItem.sku}`);
      }
      return {
        sku: cat.sku,
        name: cat.name,
        qty: reqItem.qty,
        unitPrice: cat.listPriceEur,
      };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const couponValid = parsed.data.couponCode?.toUpperCase() === 'DW-Q4-BULK10';
    const discountRate = (org.discountPercent + (couponValid ? 10 : 0)) / 100;
    const discountAmount = Number((subtotal * discountRate).toFixed(2));
    const taxable = subtotal - discountAmount;
    const taxAmount = Number((taxable * 0.1).toFixed(2));
    const totalAmount = Number((taxable + taxAmount).toFixed(2));

    const newOrder: DealerOrderRecord = {
      id: `${parsed.data.docType === 'Proforma Invoice' ? 'PRF' : 'PO'}-2026-${Math.floor(5000 + Math.random() * 4999)}`,
      dealerOrgId: org.orgId,
      dealerName: org.companyName,
      docType: parsed.data.docType,
      status: 'Pending Approval',
      currency: org.currency,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      ...(couponValid ? { couponApplied: 'DW-Q4-BULK10 (+10%)' } : {}),
      createdAt: new Date().toISOString().slice(0, 10),
      items: lineItems,
    };

    orderStore.unshift(newOrder);
    auditLogStore.unshift({
      id: `AUD-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      actorEmail: user.email,
      role: user.role,
      action: `Created ${newOrder.docType}`,
      targetId: newOrder.id,
      outcome: 'ALLOWED',
    });

    return NextResponse.json({ created: true, order: newOrder });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unable to create order.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getActivePortalUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = ActionOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid operation payload.' }, { status: 400 });
    }

    const idx = orderStore.findIndex((o) => o.id === parsed.data.orderId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Order record not found.' }, { status: 404 });
    }

    const target = orderStore[idx];
    const requiredAction =
      parsed.data.operation === 'lock_invoice' ? 'finance:invoice_issue' : 'dealer:order_approve';

    const access = evaluateTenantAccess({
      role: user.role,
      actorOrgId: user.orgId,
      targetOrgId: target.dealerOrgId,
      targetDomain: 'dealer',
      action: requiredAction,
    });

    if (!access.allowed) {
      auditLogStore.unshift({
        id: `AUD-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        actorEmail: user.email,
        role: user.role,
        action: `Attempted ${parsed.data.operation} without permission`,
        targetId: target.id,
        outcome: 'DENIED',
      });
      return NextResponse.json({ error: access.reason }, { status: 403 });
    }

    if (parsed.data.operation === 'approve') {
      orderStore[idx] = { ...target, status: 'Approved' };
    } else {
      const snapshotHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(target))
        .digest('hex')
        .slice(0, 12);
      orderStore[idx] = {
        ...target,
        docType: 'Commercial Invoice',
        status: 'Invoiced (Locked)',
        lockedSnapshotHash: `SHA256:${snapshotHash}`,
      };
    }

    auditLogStore.unshift({
      id: `AUD-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      actorEmail: user.email,
      role: user.role,
      action: `Executed ${parsed.data.operation}`,
      targetId: target.id,
      outcome: 'ALLOWED',
    });

    return NextResponse.json({ updated: true, order: orderStore[idx] });
  } catch {
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}
