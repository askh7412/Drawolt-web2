'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, ShieldAlert, Upload } from 'lucide-react';

interface UploadedDocState {
  docCategory: 'business_license' | 'tax_certificate' | 'signatory_or_tech_cert';
  label: string;
  fileName: string;
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/webp';
  sizeBytes: number;
  sha256Checksum: string;
  expiresAt: string;
}

const ALLOWED_MIMES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);

async function computeFileSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isFutureExpiryDate(isoDate: string): boolean {
  return Boolean(isoDate && Date.parse(isoDate) > Date.now());
}

export function MultiStepPartnerOnboarding({
  initialType = 'distributor',
  onClose,
}: {
  initialType?: 'distributor' | 'service';
  onClose?: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [partnerType, setPartnerType] = useState<'distributor' | 'service'>(initialType);

  // Step 1
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [warehouseOrTechCount, setWarehouseOrTechCount] = useState('');
  const [territoryOrCapabilities, setTerritoryOrCapabilities] = useState('');

  // Step 3: Corporate Documents
  const [docs, setDocs] = useState<UploadedDocState[]>([]);
  const [docExpiryMap, setDocExpiryMap] = useState<Record<string, string>>({
    business_license: '2028-12-31',
    tax_certificate: '2028-06-30',
    signatory_or_tech_cert: '2028-12-31',
  });
  const [docError, setDocError] = useState<string | null>(null);

  // Step 4
  const [complianceConfirmed, setComplianceConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<{
    referenceId: string;
    companyName: string;
    verifiedDocumentsCount: number;
  } | null>(null);

  const handleFilePick = async (
    category: UploadedDocState['docCategory'],
    label: string,
    file: File | undefined,
  ) => {
    setDocError(null);
    if (!file) return;

    if (!ALLOWED_MIMES.has(file.type)) {
      setDocError(`Unsupported file type (${file.type || 'unknown'}). Allowed: PDF, JPG, PNG, WebP.`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDocError('File exceeds 10 MB maximum limit.');
      return;
    }

    const expiry = docExpiryMap[category];
    if (!isFutureExpiryDate(expiry)) {
      setDocError('Document expiry date must be in the future.');
      return;
    }

    try {
      const sha256 = await computeFileSha256(file);
      setDocs((prev) => {
        const filtered = prev.filter((d) => d.docCategory !== category);
        return [
          ...filtered,
          {
            docCategory: category,
            label,
            fileName: file.name,
            mimeType: file.type as UploadedDocState['mimeType'],
            sizeBytes: file.size,
            sha256Checksum: sha256,
            expiresAt: expiry,
          },
        ];
      });
    } catch {
      setDocError('Unable to compute SHA-256 checksum for the selected file.');
    }
  };

  const canProceedStep1 =
    companyName.trim().length >= 2 &&
    registrationNumber.trim().length >= 4 &&
    taxId.trim().length >= 4 &&
    country.trim().length >= 2 &&
    city.trim().length >= 2 &&
    email.includes('@') &&
    phone.trim().length >= 6;

  const canProceedStep2 =
    contactName.trim().length >= 2 &&
    contactRole.trim().length >= 2 &&
    warehouseOrTechCount.trim().length >= 1 &&
    territoryOrCapabilities.trim().length >= 5;

  const canProceedStep3 = docs.length >= 2;

  const handleFinalSubmit = async () => {
    if (!complianceConfirmed) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/partner-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerType,
          companyName,
          registrationNumber,
          taxId,
          contactName,
          contactRole,
          email,
          phone,
          country,
          city,
          territoryOrCapabilities,
          warehouseOrTechCount,
          documents: docs.map((d) => ({
            docCategory: d.docCategory,
            fileName: d.fileName,
            mimeType: d.mimeType,
            sizeBytes: d.sizeBytes,
            sha256Checksum: d.sha256Checksum,
            expiresAt: d.expiresAt,
          })),
          complianceConfirmed: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Corporate compliance validation failed.');
      } else {
        setSubmittedRef({
          referenceId: data.referenceId,
          companyName: data.companyName,
          verifiedDocumentsCount: data.verifiedDocumentsCount,
        });
      }
    } catch {
      setSubmitError('Network error submitting multi-step onboarding.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <div className="rounded-2xl border border-[#9DCB16] bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#9DCB16]" />
          <div>
            <h3 className="text-lg font-semibold text-[#101C35]">
              Corporate Onboarding Queued · {submittedRef.referenceId}
            </h3>
            <p className="mt-1.5 text-sm text-[#7D8792]">
              Application for <strong className="text-[#101C35]">{submittedRef.companyName}</strong> passed
              all 4 compliance stages with {submittedRef.verifiedDocumentsCount} SHA-256 verified corporate
              documents.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedRef(null);
                  setStep(1);
                }}
                className="rounded-lg border border-[#E5E9ED] px-4 py-2 text-xs font-semibold text-[#101C35] hover:bg-[#F6F8FA]"
              >
                New Application
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-[#101C35] px-4 py-2 text-xs font-semibold text-white"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E9ED] bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E9ED] pb-4">
        <div>
          <span className="text-xs font-medium text-[#7D8792]">
            Multi-Step Partner Registration · Step {step} of 4
          </span>
          <h3 className="mt-1 text-lg font-semibold text-[#101C35]">
            {partnerType === 'distributor'
              ? 'Authorized Sales Distributor Onboarding'
              : 'Authorized Service Center Onboarding'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((num) => (
            <span
              key={num}
              className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold tabular-nums ${
                step === num
                  ? 'bg-[#101C35] text-white'
                  : step > num
                    ? 'bg-[#9DCB16] text-[#101C35]'
                    : 'border border-[#E5E9ED] bg-[#F6F8FA] text-[#7D8792]'
              }`}
            >
              {num}
            </span>
          ))}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ml-2 text-xs font-medium text-[#7D8792] hover:text-[#101C35]"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Step 1: Company Profile */}
      {step === 1 && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            {(['distributor', 'service'] as const).map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => setPartnerType(tp)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  partnerType === tp
                    ? 'bg-[#101C35] text-white'
                    : 'border border-[#E5E9ED] bg-[#F6F8FA] text-[#7D8792]'
                }`}
              >
                {tp === 'distributor' ? 'Sales Distributor' : 'Service Center'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Legal Company Name *"
              className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Company Registration No. / شناسه ملی *"
              className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 font-mono text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="VAT / Tax Identification Number *"
              className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 font-mono text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Corporate Email Address *"
              className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country *"
              className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City *"
              className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Corporate Phone *"
              className="sm:col-span-2 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 font-mono text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Step 2: Authorized Contact & Capacity */}
      {step === 2 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Authorized Signatory / Manager Name *"
            className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
          />
          <input
            type="text"
            value={contactRole}
            onChange={(e) => setContactRole(e.target.value)}
            placeholder="Title / Position (e.g. Managing Director) *"
            className="rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
          />
          <input
            type="text"
            value={warehouseOrTechCount}
            onChange={(e) => setWarehouseOrTechCount(e.target.value)}
            placeholder={
              partnerType === 'distributor'
                ? 'Warehouse Capacity (e.g. 1,200 m²) *'
                : 'Certified Technicians & Bench Count *'
            }
            className="sm:col-span-2 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
          />
          <textarea
            rows={3}
            value={territoryOrCapabilities}
            onChange={(e) => setTerritoryOrCapabilities(e.target.value)}
            placeholder={
              partnerType === 'distributor'
                ? 'Requested territory, B2B industrial channels, and annual procurement profile *'
                : 'Supported tool categories, diagnostic tools, and warranty turnaround SLA *'
            }
            className="sm:col-span-2 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101C35] focus:border-[#101C35] focus:bg-white focus:outline-none"
          />
        </div>
      )}

      {/* Step 3: Corporate Document Verification */}
      {step === 3 && (
        <div className="mt-6 space-y-4">
          <p className="text-xs leading-relaxed text-[#7D8792]">
            Upload at least <strong>2 corporate documents</strong> (PDF, JPG, PNG, WebP, max 10 MB).
            Browser computes a real SHA-256 integrity hash and verifies non-expired validity dates before
            server submission.
          </p>

          {(
            [
              {
                key: 'business_license',
                title: 'Commercial Registration / Business License (Required)',
              },
              {
                key: 'tax_certificate',
                title: 'Tax / VAT Registration Certificate (Required)',
              },
              {
                key: 'signatory_or_tech_cert',
                title:
                  partnerType === 'distributor'
                    ? 'Authorized Signatory ID (Optional)'
                    : 'Technical Workshop Qualification (Optional)',
              },
            ] as const
          ).map((slot) => {
            const uploaded = docs.find((d) => d.docCategory === slot.key);
            return (
              <div
                key={slot.key}
                className="flex flex-col justify-between gap-3 rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#101C35]">{slot.title}</div>
                  {uploaded ? (
                    <div className="mt-1 space-y-0.5 text-[11px] text-[#202226]">
                      <div className="flex items-center gap-1.5 font-medium text-[#101C35]">
                        <FileCheck2 className="h-3.5 w-3.5 text-[#9DCB16]" />
                        <span>{uploaded.fileName}</span>
                        <span className="text-[#7D8792] tabular-nums">
                          ({Math.round(uploaded.sizeBytes / 1024)} KB)
                        </span>
                      </div>
                      <div className="truncate font-mono text-[10px] text-[#7D8792]">
                        SHA-256: {uploaded.sha256Checksum}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-[11px] text-[#7D8792]">No file attached yet</div>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <label className="text-[11px] text-[#7D8792]">
                    Expiry:{' '}
                    <input
                      type="date"
                      value={docExpiryMap[slot.key]}
                      onChange={(e) =>
                        setDocExpiryMap((prev) => ({ ...prev, [slot.key]: e.target.value }))
                      }
                      className="rounded border border-[#E5E9ED] bg-white px-2 py-1 font-mono text-[11px] text-[#101C35]"
                    />
                  </label>

                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#101C35]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#101C35] hover:border-[#101C35]">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploaded ? 'Replace' : 'Select File'}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) =>
                        void handleFilePick(slot.key, slot.title, e.target.files?.[0])
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            );
          })}

          {docError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{docError}</span>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Compliance Summary & Submit */}
      {step === 4 && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#E5E9ED] bg-[#F6F8FA] p-4 text-xs sm:grid-cols-2">
            <div>
              <span className="text-[#7D8792]">Company:</span>{' '}
              <strong className="text-[#101C35]">{companyName}</strong>
            </div>
            <div>
              <span className="text-[#7D8792]">Registration / Tax ID:</span>{' '}
              <strong className="font-mono text-[#101C35]">
                {registrationNumber} / {taxId}
              </strong>
            </div>
            <div>
              <span className="text-[#7D8792]">Location:</span>{' '}
              <strong className="text-[#101C35]">
                {city}, {country}
              </strong>
            </div>
            <div>
              <span className="text-[#7D8792]">Verified Attachments:</span>{' '}
              <strong className="font-mono text-[#101C35]">{docs.length} SHA-256 Verified</strong>
            </div>
          </div>

          <label className="flex items-start gap-2.5 rounded-xl border border-[#E5E9ED] p-3.5 text-xs text-[#202226]">
            <input
              type="checkbox"
              checked={complianceConfirmed}
              onChange={(e) => setComplianceConfirmed(e.target.checked)}
              className="mt-0.5 accent-[#9DCB16]"
            />
            <span>
              I confirm that all corporate registration numbers, tax IDs, and attached documents are
              authentic and understand that DRAWOLT isolates partner portals by verified tenant ID
              only after compliance approval.
            </span>
          </label>

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {submitError}
            </div>
          )}
        </div>
      )}

      {/* Step Footer Navigation */}
      <div className="mt-6 flex items-center justify-between border-t border-[#E5E9ED] pt-5">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E9ED] px-4 py-2 text-xs font-semibold text-[#101C35] disabled:opacity-40"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>

        {step < 4 ? (
          <button
            type="button"
            disabled={
              (step === 1 && !canProceedStep1) ||
              (step === 2 && !canProceedStep2) ||
              (step === 3 && !canProceedStep3)
            }
            onClick={() => setStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#101C35] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#202226] disabled:opacity-40"
          >
            <span>Continue</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#9DCB16]" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!complianceConfirmed || submitting}
            onClick={() => void handleFinalSubmit()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#9DCB16] px-6 py-2.5 text-xs font-bold text-[#101C35] transition-colors hover:bg-[#8EB812] disabled:opacity-40"
          >
            <span>{submitting ? 'Validating & Submitting...' : 'Submit Verified Application'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
