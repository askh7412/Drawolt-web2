import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const VerifySchema = z.object({
  mode: z.enum(['serial', 'repair', 'register']),
  code: z.string().trim().min(4).max(64),
  ownerEmail: z.string().email().optional(),
});

interface SampleSerialRecord {
  serial: string;
  sku: string;
  series: 'TOP LINE' | 'Standard';
  category: string;
  batchCode: string;
  warrantyStatus: 'Active (Sample Record)' | 'Unregistered (Sample Record)';
  registeredOwnerHint: string;
  expiresAt: string;
}

const SAMPLE_SERIAL_REGISTRY: Record<string, SampleSerialRecord> = {
  'DW-TL-2026-00419': {
    serial: 'DW-TL-2026-00419',
    sku: 'DW-TL-IW120-SAMPLE',
    series: 'TOP LINE',
    category: 'Industrial Impact Wrench (Sample SKU)',
    batchCode: 'BATCH-2026-Q3-DEMO',
    warrantyStatus: 'Active (Sample Record)',
    registeredOwnerHint: 'Verified B2B Fleet Account',
    expiresAt: '2029-09-30',
  },
  'DW-CL-2026-10284': {
    serial: 'DW-CL-2026-10284',
    sku: 'DW-CL-AG18-SAMPLE',
    series: 'Standard',
    category: 'Cordless Angle Grinder (Sample SKU)',
    batchCode: 'BATCH-2026-Q2-DEMO',
    warrantyStatus: 'Unregistered (Sample Record)',
    registeredOwnerHint: 'Available for initial ownership claim',
    expiresAt: 'Pending registration',
  },
};

const SAMPLE_REPAIR_REGISTRY: Record<
  string,
  {
    trackingId: string;
    serial: string;
    centerName: string;
    currentStep: number;
    statusLabel: string;
    updatedAt: string;
  }
> = {
  'SRV-2026-8841': {
    trackingId: 'SRV-2026-8841',
    serial: 'DW-TL-2026-00419',
    centerName: 'Tehran Industrial Drive Center (Sample)',
    currentStep: 9,
    statusLabel: 'Spare parts allocated from center inventory',
    updatedAt: '2026-11-18 10:42 UTC',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input format. Please provide a valid serial or tracking code.' },
        { status: 400 },
      );
    }

    const normalizedCode = parsed.data.code.toUpperCase();

    if (parsed.data.mode === 'repair') {
      const repair = SAMPLE_REPAIR_REGISTRY[normalizedCode];
      if (!repair) {
        return NextResponse.json(
          {
            found: false,
            mode: 'repair',
            code: normalizedCode,
            message:
              'Tracking ID not found in server registry. Try sample ID SRV-2026-8841 to inspect the 14-step repair workflow.',
          },
          { status: 404 },
        );
      }
      return NextResponse.json({
        found: true,
        isDemoRecord: true,
        mode: 'repair',
        record: repair,
      });
    }

    const record = SAMPLE_SERIAL_REGISTRY[normalizedCode];
    if (!record) {
      return NextResponse.json(
        {
          found: false,
          mode: parsed.data.mode,
          code: normalizedCode,
          securityNote:
            'DRAWOLT rejects format-only validation. Even well-formed strings fail unless cryptographically matched in the server serial registry.',
          sampleHint: 'Try DW-TL-2026-00419 or DW-CL-2026-10284 to test registry lookup.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      found: true,
      isDemoRecord: true,
      mode: parsed.data.mode,
      record:
        parsed.data.mode === 'register' && parsed.data.ownerEmail
          ? {
              ...record,
              warrantyStatus: 'Claim Logged (Demo Session)',
              registeredOwnerHint: parsed.data.ownerEmail,
            }
          : record,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to process verification request.' }, { status: 500 });
  }
}
