
export type NewsCategory = {
  name: string;
  slug: string;
  description: string;
};

export const newsCategories: NewsCategory[] = [
  {
    name: 'Noticias de la Liga',
    slug: 'noticias-liga',
    description: 'Actualizaciones generales, anuncios y novedades de la liga.'
  },
  {
    name: 'Resumen de Jornada',
    slug: 'resumen-jornada',
    description: 'Análisis y resultados de la última jornada disputada.'
  },
  {
    name: 'Análisis Táctico',
    slug: 'analisis-tactico',
    description: 'Profundiza en las estrategias y tácticas de los equipos.'
  },
  {
    name: 'Entrevistas',
    slug: 'entrevistas',
    description: 'Conversaciones exclusivas con jugadores, entrenadores y protagonistas.'
  },
  {
    name: 'Mercado de Fichajes',
    slug: 'mercado-fichajes',
    description: 'Altas, bajas y rumores del mercado de pases.'
  },
  {
    name: 'Presentaciones',
    slug: 'presentaciones',
    description: 'Presentaciones oficiales de equipos, jugadores o eventos.'
  },
  {
    name: 'Informacion',
    slug: 'informacion',
    description: 'Información general y comunicados importantes.'
  },
  {
    name: 'Banners informativos',
    slug: 'banners-informativos',
    description: 'Anuncios visuales y banners con información clave.'
  }
];
