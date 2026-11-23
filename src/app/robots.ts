import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://airastra.netlify.app/sitemap.xml',
    host: 'https://airastra.netlify.app',
  };
}
