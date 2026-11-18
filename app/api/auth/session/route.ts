import { NextResponse } from 'next/server';
import { getActivePortalUser, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { INITIAL_DEALER_ORGS } from '@/lib/auth/demo-accounts';
import { evaluateTenantAccess } from '@/lib/rbac/policy';

export async function GET() {
  const user = await getActivePortalUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null, visibleOrgs: [] });
  }

  // Enforce strict server-side RBAC tenant filtering
  const visibleOrgs = INITIAL_DEALER_ORGS.filter((org) => {
    const check = evaluateTenantAccess({
      role: user.role,
      actorOrgId: user.orgId,
      targetOrgId: org.orgId,
      targetDomain: 'dealer',
      action: user.role === 'SUPER_ADMIN' ? 'dealer:read_all' : 'dealer:read_own',
    });
    return check.allowed;
  });

  return NextResponse.json({
    authenticated: true,
    user,
    visibleOrgs,
  });
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
