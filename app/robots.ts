import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.APP_URL || 'https://drawolt.com').replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/en', '/fa', '/de', '/ar', '/architecture'],
        disallow: ['/api/', '/portals', '/login'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
