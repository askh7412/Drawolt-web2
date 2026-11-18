import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PORTAL_TEST_ACCOUNTS } from '@/lib/auth/demo-accounts';
import { SESSION_COOKIE_NAME, signSessionToken } from '@/lib/auth/session';

const LoginSchema = z.object({
  email: z.string().trim().email(),
  passcode: z.string().trim().min(6).max(120),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid corporate email and passcode.' },
        { status: 400 },
      );
    }

    const emailNormalized = parsed.data.email.toLowerCase();
    const user = PORTAL_TEST_ACCOUNTS.find(
      (u) => u.email.toLowerCase() === emailNormalized && u.passcode === parsed.data.passcode,
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. Verify email and fixed portal passcode.' },
        { status: 401 },
      );
    }

    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
      exp: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
    });

    const { passcode: _omitted, ...safeUser } = user;
    void _omitted;

    const res = NextResponse.json({
      authenticated: true,
      user: safeUser,
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Authentication service error.' }, { status: 500 });
  }
}
