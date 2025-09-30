
import { MetadataRoute } from 'next';
import { getAllMatches } from '../actions/match-actions';
import { getPosts } from '../actions/blog-actions';
import { getAllTeams } from '../actions/team-actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://liga-canelones-futsal.netlify.app';

  // Páginas estáticas públicas
  const staticRoutes = [
    '', 
    '/partidos', 
    '/blog',
    '/clubes',
    '/jugadores',
    '/posiciones',
    '/gestion',
    '/resumen'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
  
  // Páginas dinámicas de partidos
  const allMatches = await getAllMatches();
  const matchRoutes = allMatches.map((match) => ({
    url: `${baseUrl}/partidos/${match.id}`,
    lastModified: new Date(match.scheduledTime).toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.7
  }));

  // Páginas dinámicas de estadísticas (SOLO para partidos finalizados)
  const finishedMatches = allMatches.filter(m => m.status === 'FINISHED');
  const statsRoutes = finishedMatches.map((match) => ({
    url: `${baseUrl}/partidos/${match.id}/estadisticas`,
    lastModified: new Date(match.scheduledTime).toISOString(),
     changeFrequency: 'weekly' as const,
    priority: 0.6
  }));

  // Páginas dinámicas de blog
  const { posts: allPosts } = await getPosts(); // Suponiendo que esto puede obtener todos los posts
  const blogPostRoutes = allPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.createdAt).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
  }));

  // Páginas de clubes
  const allTeams = await getAllTeams();
  const clubRoutes = allTeams.map(team => ({
    url: `${baseUrl}/clubes/${team.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }));


  return [
    ...staticRoutes,
    ...matchRoutes,
    ...statsRoutes,
    ...blogPostRoutes,
    ...clubRoutes
  ];
}
