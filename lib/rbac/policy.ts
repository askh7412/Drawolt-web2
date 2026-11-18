export type PlatformRole =
  | 'SUPER_ADMIN'
  | 'PIM_MANAGER'
  | 'FINANCE_CONTROLLER'
  | 'DEALER_ADMIN'
  | 'DEALER_BUYER'
  | 'SERVICE_MANAGER'
  | 'SERVICE_TECHNICIAN'
  | 'CUSTOMER';

export type PermissionAction =
  | 'dealer:read_all'
  | 'dealer:read_own'
  | 'dealer:order_create'
  | 'dealer:order_approve'
  | 'dealer:credit_adjust'
  | 'finance:invoice_issue'
  | 'finance:ledger_read'
  | 'service:read_all'
  | 'service:read_own'
  | 'service:ticket_advance'
  | 'pim:catalog_write'
  | 'audit:read';

export interface RolePolicyDefinition {
  role: PlatformRole;
  label: string;
  labelFa: string;
  isolationBoundary: 'GLOBAL' | 'TENANT_DEALER' | 'TENANT_SERVICE' | 'OWNER_SELF';
  mfaPolicy: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
  permissions: PermissionAction[];
  sqlRlsRule: string;
}

export const RBAC_POLICIES: Record<PlatformRole, RolePolicyDefinition> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    label: 'Global Super Admin',
    labelFa: 'مدیر کل پلتفرم',
    isolationBoundary: 'GLOBAL',
    mfaPolicy: 'MANDATORY',
    permissions: [
      'dealer:read_all',
      'dealer:read_own',
      'dealer:order_create',
      'dealer:order_approve',
      'dealer:credit_adjust',
      'finance:invoice_issue',
      'finance:ledger_read',
      'service:read_all',
      'service:read_own',
      'service:ticket_advance',
      'pim:catalog_write',
      'audit:read',
    ],
    sqlRlsRule: 'app.current_role = SUPER_ADMIN -> bypass tenant filter with mandatory audit_log entry',
  },
  PIM_MANAGER: {
    role: 'PIM_MANAGER',
    label: 'Product & Multilingual PIM Manager',
    labelFa: 'مدیر محصولات و محتوای چندزبانه',
    isolationBoundary: 'GLOBAL',
    mfaPolicy: 'MANDATORY',
    permissions: ['pim:catalog_write'],
    sqlRlsRule: 'Scope limited to products, categories, media_assets, page_builder_sections',
  },
  FINANCE_CONTROLLER: {
    role: 'FINANCE_CONTROLLER',
    label: 'Global Finance Controller',
    labelFa: 'کنترلر مالی و اسناد حسابداری',
    isolationBoundary: 'GLOBAL',
    mfaPolicy: 'MANDATORY',
    permissions: ['dealer:read_all', 'dealer:credit_adjust', 'finance:invoice_issue', 'finance:ledger_read', 'audit:read'],
    sqlRlsRule: 'Append-only access on financial_documents; UPDATE/DELETE blocked by PostgreSQL trigger',
  },
  DEALER_ADMIN: {
    role: 'DEALER_ADMIN',
    label: 'Authorized Dealer Administrator',
    labelFa: 'مدیر نمایندگی فروش',
    isolationBoundary: 'TENANT_DEALER',
    mfaPolicy: 'RECOMMENDED',
    permissions: ['dealer:read_own', 'dealer:order_create', 'finance:ledger_read'],
    sqlRlsRule: 'WHERE dealer_id = current_setting(\'app.tenant_org_id\')::uuid',
  },
  DEALER_BUYER: {
    role: 'DEALER_BUYER',
    label: 'Dealer Purchasing Officer',
    labelFa: 'کارشناس خرید نمایندگی',
    isolationBoundary: 'TENANT_DEALER',
    mfaPolicy: 'OPTIONAL',
    permissions: ['dealer:read_own', 'dealer:order_create'],
    sqlRlsRule: 'WHERE dealer_id = current_setting(\'app.tenant_org_id\')::uuid AND status IN (draft, quote)',
  },
  SERVICE_MANAGER: {
    role: 'SERVICE_MANAGER',
    label: 'Authorized Service Center Manager',
    labelFa: 'مدیر مرکز خدمات مجاز',
    isolationBoundary: 'TENANT_SERVICE',
    mfaPolicy: 'RECOMMENDED',
    permissions: ['service:read_own', 'service:ticket_advance'],
    sqlRlsRule: 'WHERE service_center_id = current_setting(\'app.tenant_org_id\')::uuid',
  },
  SERVICE_TECHNICIAN: {
    role: 'SERVICE_TECHNICIAN',
    label: 'Certified Repair Technician',
    labelFa: 'تکنسین فنی تعمیرات',
    isolationBoundary: 'TENANT_SERVICE',
    mfaPolicy: 'OPTIONAL',
    permissions: ['service:read_own', 'service:ticket_advance'],
    sqlRlsRule: 'WHERE service_center_id = current_setting(\'app.tenant_org_id\') AND assigned_tech_id = app.user_id',
  },
  CUSTOMER: {
    role: 'CUSTOMER',
    label: 'End Customer (DRAWOLT ID)',
    labelFa: 'مشتری نهایی (دارنده DRAWOLT ID)',
    isolationBoundary: 'OWNER_SELF',
    mfaPolicy: 'OPTIONAL',
    permissions: [],
    sqlRlsRule: 'WHERE owner_user_id = current_setting(\'app.user_id\')::uuid',
  },
};

export interface AccessCheckContext {
  role: PlatformRole;
  actorOrgId: string | null;
  targetOrgId: string | null;
  targetDomain: 'dealer' | 'service' | 'pim' | 'audit';
  action: PermissionAction;
}

export function evaluateTenantAccess(ctx: AccessCheckContext): {
  allowed: boolean;
  reason: string;
} {
  const policy = RBAC_POLICIES[ctx.role];
  if (!policy.permissions.includes(ctx.action)) {
    return {
      allowed: false,
      reason: `DENIED: Role ${ctx.role} lacks permission '${ctx.action}'.`,
    };
  }

  if (policy.isolationBoundary === 'GLOBAL') {
    return {
      allowed: true,
      reason: `ALLOWED (Global Scope): ${ctx.role} authorized with audit trail logging.`,
    };
  }

  if (policy.isolationBoundary === 'TENANT_DEALER') {
    if (ctx.targetDomain !== 'dealer') {
      return {
        allowed: false,
        reason: `ISOLATION BLOCK: Dealer role cannot access '${ctx.targetDomain}' domain.`,
      };
    }
    if (!ctx.actorOrgId || ctx.actorOrgId !== ctx.targetOrgId) {
      return {
        allowed: false,
        reason: `TENANT ISOLATION VIOLATION: Actor org (${ctx.actorOrgId}) != Target org (${ctx.targetOrgId}).`,
      };
    }
    return {
      allowed: true,
      reason: `ALLOWED (Tenant Scoped): Verified orgId match (${ctx.actorOrgId}).`,
    };
  }

  if (policy.isolationBoundary === 'TENANT_SERVICE') {
    if (ctx.targetDomain !== 'service') {
      return {
        allowed: false,
        reason: `ISOLATION BLOCK: Service role cannot access '${ctx.targetDomain}' domain.`,
      };
    }
    if (!ctx.actorOrgId || ctx.actorOrgId !== ctx.targetOrgId) {
      return {
        allowed: false,
        reason: `TENANT ISOLATION VIOLATION: Actor center (${ctx.actorOrgId}) != Target center (${ctx.targetOrgId}).`,
      };
    }
    return {
      allowed: true,
      reason: `ALLOWED (Center Scoped): Verified centerId match (${ctx.actorOrgId}).`,
    };
  }

  return {
    allowed: false,
    reason: 'DENIED: Insufficient scope.',
  };
}
