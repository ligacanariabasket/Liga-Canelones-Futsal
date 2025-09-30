import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ligacanelonesfutsalmc.netlify.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/controles/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
