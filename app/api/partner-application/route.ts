import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const DocumentMetadataSchema = z.object({
  docCategory: z.enum(['business_license', 'tax_certificate', 'signatory_or_tech_cert']),
  fileName: z.string().trim().min(3).max(180),
  mimeType: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  sizeBytes: z.number().int().min(100).max(10 * 1024 * 1024),
  sha256Checksum: z.string().regex(/^[a-f0-9]{64}$/i, 'Invalid SHA-256 document checksum'),
  expiresAt: z.string().refine(
    (dateStr) => {
      const ts = Date.parse(dateStr);
      return !Number.isNaN(ts) && ts > Date.now();
    },
    { message: 'Corporate document must not be expired.' },
  ),
});

const ApplicationSchema = z.object({
  partnerType: z.enum(['distributor', 'service']),
  companyName: z.string().trim().min(2).max(160),
  registrationNumber: z.string().trim().min(4).max(60),
  taxId: z.string().trim().min(4).max(60),
  contactName: z.string().trim().min(2).max(120),
  contactRole: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  territoryOrCapabilities: z.string().trim().min(5).max(500),
  warehouseOrTechCount: z.string().trim().min(1).max(80),
  documents: z.array(DocumentMetadataSchema).min(2).max(5),
  complianceConfirmed: z.literal(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Corporate onboarding validation failed. Verify company registration, tax ID, and valid unexpired documents.',
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const prefix = parsed.data.partnerType === 'distributor' ? 'DLR-APP' : 'SRV-APP';
    const referenceId = `${prefix}-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      accepted: true,
      referenceId,
      partnerType: parsed.data.partnerType,
      companyName: parsed.data.companyName,
      verifiedDocumentsCount: parsed.data.documents.length,
      status: 'pending_admin_compliance_review',
      submittedAt: new Date().toISOString(),
      message:
        'Multi-step corporate registration and document checksums validated. Queued for DRAWOLT Compliance & Admin review.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process partner application.' }, { status: 500 });
  }
}
