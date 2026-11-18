import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { DrawoltHomeClient } from '@/components/home/DrawoltHomeClient';
import { isValidLocale, Locale } from '@/lib/i18n/types';

const LOCALE_SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'DRAWOLT — Industrial Power Tools, TOP LINE & Global Partner Network',
    description:
      'Engineered for industrial endurance. Explore DRAWOLT Standard and TOP LINE brushless power tools, DRAWOLT ID warranty verification, and authorized global partners.',
  },
  fa: {
    title: 'DRAWOLT — ابزارهای صنعتی، سری TOP LINE و شبکه جهانی نمایندگان',
    description:
      'ابزارهای برقی و شارژی صنعتی با مهندسی دقیق، سری تیتانیوم TOP LINE، استعلام اصالت DRAWOLT ID و پرتال پیشرفته نمایندگان فروش و خدمات مجاز.',
  },
  de: {
    title: 'DRAWOLT — Industrielle Elektrowerkzeuge, TOP LINE & Partnernetzwerk',
    description:
      'Präzisionsmechanik für den professionellen Einsatz: DRAWOLT Standard- und TOP LINE-Serie, Seriennummern-Verifizierung und autorisierte Servicezentren.',
  },
  ar: {
    title: 'DRAWOLT — الأدوات الكهربائية الصناعية، سلسلة TOP LINE وشبكة الشركاء',
    description:
      'أدوات كهربائية صناعية مصممة للأعمال الشاقة، سلسلة TOP LINE المصنوعة من التيتانيوم، التحقق من الضمان عبر DRAWOLT ID وبوابة الوكلاء المعتمدين.',
  },
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fa' }, { locale: 'de' }, { locale: 'ar' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const seo = LOCALE_SEO[locale];
  const baseUrl = (process.env.APP_URL || 'https://drawolt.com').replace(/\/$/, '');

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fa: `${baseUrl}/fa`,
        de: `${baseUrl}/de`,
        ar: `${baseUrl}/ar`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${locale}`,
      siteName: 'DRAWOLT',
      type: 'website',
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <LocaleProvider initialLocale={locale as Locale}>
      <DrawoltHomeClient />
    </LocaleProvider>
  );
}
