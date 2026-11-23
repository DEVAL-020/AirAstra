import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://airastra.netlify.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-11-23'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}
