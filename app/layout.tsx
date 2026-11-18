import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono, Vazirmatn } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rtl',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://drawolt.com'),
  title: 'DRAWOLT — Global Industrial Power Tools & Partner Ecosystem',
  description:
    'DRAWOLT international industrial power tools platform featuring Standard and TOP LINE collections, multilingual discovery, authorized sales dealers, and certified service operations.',
  openGraph: {
    title: 'DRAWOLT — Global Industrial Power Tools & Partner Ecosystem',
    description:
      'Engineered for industrial reliability. Explore DRAWOLT Standard and TOP LINE tools, DRAWOLT ID warranty verification, and global partner operations.',
    type: 'website',
    siteName: 'DRAWOLT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRAWOLT — Global Industrial Power Tools & Partner Ecosystem',
    description:
      'International industrial power tools platform with multilingual support, interactive 3D showcase, and enterprise partner ecosystem.',
  },
  alternates: {
    languages: {
      en: '/en',
      fa: '/fa',
      de: '/de',
      ar: '/ar',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DRAWOLT',
    url: process.env.APP_URL || 'https://drawolt.com',
    description:
      'International industrial power tools platform with multilingual product discovery, DRAWOLT ID warranty registry, dealer hub, and authorized service network.',
  };

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${outfit.variable} ${jakarta.variable} ${jetbrainsMono.variable} ${vazirmatn.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans bg-white text-[#101C35] antialiased selection:bg-[#9DCB16]/30 selection:text-[#101C35]"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
