import { PlatformRole } from '@/lib/rbac/policy';

export interface PortalUserAccount {
  id: string;
  email: string;
  passcode: string; // Demo/Test passcode clearly marked for owner testing
  displayName: string;
  role: PlatformRole;
  orgId: string | null;
  orgName: string;
  country: string;
  currency: 'EUR' | 'USD';
  tierLabel: string;
}

export interface DealerOrganization {
  orgId: string;
  dealerCode: string;
  companyName: string;
  country: string;
  territory: string;
  currency: 'EUR' | 'USD';
  tier: 'Platinum B2B' | 'Gold Distributor' | 'Regional Partner';
  discountPercent: number;
  creditLimit: number;
  outstandingBalance: number;
  status: 'Active' | 'Review';
}

export interface DealerCatalogItem {
  sku: string;
  name: string;
  series: 'Standard' | 'TOP LINE';
  category: string;
  listPriceEur: number;
  moq: number;
  stockStatus: 'In Stock' | 'Allocated' | 'Backorder';
}

export interface DealerOrderRecord {
  id: string;
  dealerOrgId: string;
  dealerName: string;
  docType: 'Purchase Order' | 'Proforma Invoice' | 'Commercial Invoice' | 'Credit Note';
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Invoiced (Locked)';
  currency: 'EUR' | 'USD';
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponApplied?: string;
  createdAt: string;
  lockedSnapshotHash?: string;
  items: { sku: string; name: string; qty: number; unitPrice: number }[];
}

export const PORTAL_TEST_ACCOUNTS: PortalUserAccount[] = [
  {
    id: 'USR-ADMIN-001',
    email: 'admin@drawolt.com',
    passcode: 'DRAWOLT-ADMIN-2026',
    displayName: 'Global Director (Super Admin)',
    role: 'SUPER_ADMIN',
    orgId: null,
    orgName: 'DRAWOLT Global HQ',
    country: 'International',
    currency: 'EUR',
    tierLabel: 'Global Root Access',
  },
  {
    id: 'USR-DLR-DE-01',
    email: 'dealer.de@drawolt.com',
    passcode: 'DEALER-DE-2026',
    displayName: 'Klaus Weber (RheinWerk GmbH)',
    role: 'DEALER_ADMIN',
    orgId: 'ORG-DLR-DE',
    orgName: 'RheinWerk Industrial Supply GmbH',
    country: 'Germany',
    currency: 'EUR',
    tierLabel: 'Platinum B2B · 22% Tier',
  },
  {
    id: 'USR-DLR-AE-02',
    email: 'dealer.ae@drawolt.com',
    passcode: 'DEALER-AE-2026',
    displayName: 'Tariq Al-Mansoor (Gulf Apex)',
    role: 'DEALER_ADMIN',
    orgId: 'ORG-DLR-AE',
    orgName: 'Gulf Apex Tooling LLC',
    country: 'UAE',
    currency: 'USD',
    tierLabel: 'Gold Distributor · 18% Tier',
  },
  {
    id: 'USR-DLR-IR-03',
    email: 'dealer.ir@drawolt.com',
    passcode: 'DEALER-IR-2026',
    displayName: 'امیرحسین رضایی (پارس صنعت)',
    role: 'DEALER_ADMIN',
    orgId: 'ORG-DLR-IR',
    orgName: 'شرکت بازرگانی ابزار پارس صنعت',
    country: 'Iran',
    currency: 'EUR',
    tierLabel: 'Regional Partner · 15% Tier',
  },
  {
    id: 'USR-SRV-IR-01',
    email: 'service.ir@drawolt.com',
    passcode: 'SERVICE-IR-2026',
    displayName: 'مهدی کریمی (مرکز خدمات تهران)',
    role: 'SERVICE_MANAGER',
    orgId: 'ORG-SRV-IR',
    orgName: 'Tehran Industrial Drive Service Center',
    country: 'Iran',
    currency: 'EUR',
    tierLabel: 'Authorized Service Hub',
  },
];

export const INITIAL_DEALER_ORGS: DealerOrganization[] = [
  {
    orgId: 'ORG-DLR-DE',
    dealerCode: 'DLR-EU-401',
    companyName: 'RheinWerk Industrial Supply GmbH',
    country: 'Germany',
    territory: 'DACH / Western Europe',
    currency: 'EUR',
    tier: 'Platinum B2B',
    discountPercent: 22,
    creditLimit: 120000,
    outstandingBalance: 24800,
    status: 'Active',
  },
  {
    orgId: 'ORG-DLR-AE',
    dealerCode: 'DLR-ME-208',
    companyName: 'Gulf Apex Tooling LLC',
    country: 'UAE',
    territory: 'GCC / Middle East',
    currency: 'USD',
    tier: 'Gold Distributor',
    discountPercent: 18,
    creditLimit: 85000,
    outstandingBalance: 19400,
    status: 'Active',
  },
  {
    orgId: 'ORG-DLR-IR',
    dealerCode: 'DLR-IR-105',
    companyName: 'شرکت بازرگانی ابزار پارس صنعت',
    country: 'Iran',
    territory: 'Tehran & Central Industrial Belt',
    currency: 'EUR',
    tier: 'Regional Partner',
    discountPercent: 15,
    creditLimit: 65000,
    outstandingBalance: 12200,
    status: 'Active',
  },
];

export const DEALER_CATALOG_SAMPLES: DealerCatalogItem[] = [
  {
    sku: 'DW-TL-IW120-SAMPLE',
    name: 'TOP LINE Brushless Impact Wrench (Sample SKU)',
    series: 'TOP LINE',
    category: 'TOP LINE',
    listPriceEur: 420,
    moq: 5,
    stockStatus: 'In Stock',
  },
  {
    sku: 'DW-CL-AG18-SAMPLE',
    name: 'Standard Cordless Angle Grinder 18V (Sample SKU)',
    series: 'Standard',
    category: 'Cutting & Grinding',
    listPriceEur: 215,
    moq: 10,
    stockStatus: 'In Stock',
  },
  {
    sku: 'DW-CL-HD20-SAMPLE',
    name: 'Standard Brushless Hammer Drill (Sample SKU)',
    series: 'Standard',
    category: 'Cordless Power Tools',
    listPriceEur: 240,
    moq: 10,
    stockStatus: 'In Stock',
  },
  {
    sku: 'DW-TL-RH32-SAMPLE',
    name: 'TOP LINE Titanium Rotary Hammer (Sample SKU)',
    series: 'TOP LINE',
    category: 'Drilling & Demolition',
    listPriceEur: 560,
    moq: 4,
    stockStatus: 'Allocated',
  },
  {
    sku: 'DW-AX-KIT01-SAMPLE',
    name: 'Industrial Carbide Cutting & Bit Pack (Sample SKU)',
    series: 'Standard',
    category: 'Industrial Accessories',
    listPriceEur: 95,
    moq: 25,
    stockStatus: 'In Stock',
  },
];

export const INITIAL_DEALER_ORDERS: DealerOrderRecord[] = [
  {
    id: 'INV-2026-9041',
    dealerOrgId: 'ORG-DLR-DE',
    dealerName: 'RheinWerk Industrial Supply GmbH',
    docType: 'Commercial Invoice',
    status: 'Invoiced (Locked)',
    currency: 'EUR',
    subtotal: 14000,
    discountAmount: 3080,
    taxAmount: 2074.8,
    totalAmount: 12994.8,
    createdAt: '2026-11-12',
    lockedSnapshotHash: 'SHA256:9f84c2a1b04e',
    items: [
      { sku: 'DW-TL-IW120-SAMPLE', name: 'TOP LINE Brushless Impact Wrench (Sample SKU)', qty: 20, unitPrice: 420 },
      { sku: 'DW-TL-RH32-SAMPLE', name: 'TOP LINE Titanium Rotary Hammer (Sample SKU)', qty: 10, unitPrice: 560 },
    ],
  },
  {
    id: 'PO-2026-4119',
    dealerOrgId: 'ORG-DLR-AE',
    dealerName: 'Gulf Apex Tooling LLC',
    docType: 'Proforma Invoice',
    status: 'Pending Approval',
    currency: 'USD',
    subtotal: 11250,
    discountAmount: 2025,
    taxAmount: 461.25,
    totalAmount: 9686.25,
    createdAt: '2026-11-16',
    items: [
      { sku: 'DW-CL-AG18-SAMPLE', name: 'Standard Cordless Angle Grinder 18V (Sample SKU)', qty: 30, unitPrice: 215 },
      { sku: 'DW-CL-HD20-SAMPLE', name: 'Standard Brushless Hammer Drill (Sample SKU)', qty: 20, unitPrice: 240 },
    ],
  },
  {
    id: 'PO-2026-4124',
    dealerOrgId: 'ORG-DLR-IR',
    dealerName: 'شرکت بازرگانی ابزار پارس صنعت',
    docType: 'Purchase Order',
    status: 'Approved',
    currency: 'EUR',
    subtotal: 8950,
    discountAmount: 1342.5,
    taxAmount: 760.75,
    totalAmount: 8368.25,
    couponApplied: 'DW-Q4-BULK10',
    createdAt: '2026-11-17',
    items: [
      { sku: 'DW-CL-HD20-SAMPLE', name: 'Standard Brushless Hammer Drill (Sample SKU)', qty: 25, unitPrice: 240 },
      { sku: 'DW-AX-KIT01-SAMPLE', name: 'Industrial Carbide Cutting & Bit Pack (Sample SKU)', qty: 31, unitPrice: 95 },
    ],
  },
];
