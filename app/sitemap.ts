import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.APP_URL || 'https://drawolt.com').replace(/\/$/, '');
  const now = new Date();

  const locales = ['en', 'fa', 'de', 'ar'] as const;

  const localizedHomeEntries: MetadataRoute.Sitemap = locales.map((loc) => ({
    url: `${baseUrl}/${loc}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: loc === 'en' ? 1.0 : 0.9,
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        fa: `${baseUrl}/fa`,
        de: `${baseUrl}/de`,
        ar: `${baseUrl}/ar`,
      },
    },
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fa: `${baseUrl}/fa`,
          de: `${baseUrl}/de`,
          ar: `${baseUrl}/ar`,
        },
      },
    },
    ...localizedHomeEntries,
    {
      url: `${baseUrl}/architecture`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
