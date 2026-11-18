'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import { DrawoltMark } from '@/components/brand/DrawoltMark';
import { PORTAL_TEST_ACCOUNTS } from '@/lib/auth/demo-accounts';
import drillStudioImg from '@/src/assets/images/drill_studio_clean_1795034598620.jpg';

interface PortalLoginExperienceProps {
  onLoginSuccess: () => void;
}

export function PortalLoginExperience({ onLoginSuccess }: PortalLoginExperienceProps) {
  const [email, setEmail] = useState('admin@drawolt.com');
  const [passcode, setPasscode] = useState('DRAWOLT-ADMIN-2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setOauthNotice(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed.');
      } else {
        onLoginSuccess();
      }
    } catch {
      setErrorMsg('Network error reaching authentication endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuthReadiness = () => {
    setOauthNotice(
      'Google OAuth 2.0 / OIDC login requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment secrets. Per DRAWOLT security policy, Google sign-in creates a standard customer account and never auto-grants Dealer or Admin privileges without explicit RBAC approval.',
    );
  };

  return (
    <div className="mx-auto max-w-[1160px] py-8">
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#E5E9ED] bg-white lg:grid-cols-12">
        {/* Left: White Premium Authentication Panel */}
        <div className="p-6 sm:p-10 lg:col-span-6">
          <DrawoltMark size="md" />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#101C35]">
            DRAWOLT Partner & Command Login
          </h1>
          <p className="mt-1.5 text-sm text-[#7D8792]">
            Signed HTTP-only session authentication with tenant-isolated RBAC enforcement.
          </p>

          {/* Continue with Google OIDC Option */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleOAuthReadiness}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm font-semibold text-[#101C35] transition-colors hover:border-[#101C35]"
            >
              <ShieldCheck className="h-4 w-4 text-[#9DCB16]" />
              <span>Continue with Google (OIDC)</span>
            </button>
          </div>

          {oauthNotice && (
            <div className="mt-3 rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-3 text-xs leading-relaxed text-[#202226]">
              {oauthNotice}
            </div>
          )}

          <div className="my-6 flex items-center gap-3 text-xs text-[#7D8792]">
            <span className="h-px flex-1 bg-[#E5E9ED]" />
            <span>or Continue with Email</span>
            <span className="h-px flex-1 bg-[#E5E9ED]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#101C35]">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-[#7D8792]" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] py-2.5 pr-4 pl-10 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#101C35]">
                Fixed Portal Passcode
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-[#7D8792]" />
                <input
                  required
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] py-2.5 pr-4 pl-10 font-mono text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#7D8792]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#9DCB16]"
                />
                <span>Remember 12h session</span>
              </label>
              <span className="text-[#7D8792]">MFA enforced for production admins</span>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#9DCB16] px-5 py-3 text-sm font-bold text-[#101C35] transition-colors hover:bg-[#8EB812] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Test Accounts Quick Selector for Project Owner */}
          <div className="mt-7 border-t border-[#E5E9ED] pt-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#101C35]">
              <KeyRound className="h-3.5 w-3.5 text-[#9DCB16]" />
              <span>Test Credentials (Click to fill Super Admin or Test Partners)</span>
            </div>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PORTAL_TEST_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPasscode(acc.passcode);
                  }}
                  className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-3 py-2 text-start text-[11px] transition-colors hover:border-[#101C35]"
                >
                  <div className="font-semibold text-[#101C35]">{acc.displayName}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-[#7D8792]">
                    {acc.email} · {acc.passcode}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Studio Industrial Tool Showcase */}
        <div className="relative hidden min-h-[540px] bg-[#F6F8FA] lg:col-span-6 lg:block">
          <Image
            src={drillStudioImg}
            alt="DRAWOLT Industrial Cordless Drill Studio Photograph"
            fill
            referrerPolicy="no-referrer"
            className="object-cover"
          />
          <div className="absolute inset-x-6 bottom-6 rounded-xl border border-[#E5E9ED] bg-white/95 p-5">
            <div className="text-xs font-semibold text-[#7D8792]">
              Isolated Enterprise Architecture
            </div>
            <p className="mt-1 text-sm font-semibold text-[#101C35]">
              Role-scoped sales pricing, immutable proforma & commercial invoices, and 14-step
              authorized service workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
