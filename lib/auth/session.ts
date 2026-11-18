import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { PORTAL_TEST_ACCOUNTS, PortalUserAccount } from './demo-accounts';

export const SESSION_COOKIE_NAME = 'drawolt_portal_session';

function getSigningSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.GEMINI_API_KEY ||
    'drawolt-dev-session-signing-key-2026'
  );
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: PortalUserAccount['role'];
  orgId: string | null;
  exp: number;
}

export function signSessionToken(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof parsed.exp !== 'number' || parsed.exp < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getActivePortalUser(): Promise<Omit<PortalUserAccount, 'passcode'> | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(raw);
  if (!session) return null;

  const account = PORTAL_TEST_ACCOUNTS.find((u) => u.id === session.userId);
  if (!account) return null;

  const { passcode: _omitted, ...safeUser } = account;
  void _omitted;
  return safeUser;
}
