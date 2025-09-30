
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Settings, Gamepad2, LayoutGrid, Shield, Users, Trophy, Rocket } from 'lucide-react';
import { ManualCard } from '@/components/manual/ManualCard';

const manualSections = [
  {
    title: 'Gestión',
    description: 'Aprende a administrar temporadas, clubes y jugadores.',
    slug: 'gestion',
    icon: <Settings className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Controles',
    description: 'Registra eventos de partidos en tiempo real.',
    slug: 'controles',
    icon: <Gamepad2 className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Cancha',
    description: 'Utiliza la pizarra táctica para planificar estrategias.',
    slug: 'cancha',
    icon: <LayoutGrid className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Clubes',
    description: 'Explora perfiles de equipos, plantillas y calendarios.',
    slug: 'clubes',
    icon: <Shield className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Jugadores',
    description: 'Consulta rankings de goleadores y perfiles de jugadores.',
    slug: 'jugadores',
    icon: <Users className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Posiciones',
    description: 'Sigue la tabla de posiciones y el fixture del torneo.',
    slug: 'posiciones',
    icon: <Trophy className="h-8 w-8 text-primary" />,
  },
   {
    title: 'Optimización',
    description: 'Mejora el rendimiento y la velocidad de la aplicación.',
    slug: 'optimizacion',
    icon: <Rocket className="h-8 w-8 text-primary" />,
  },
];

export default function ManualPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Manual de Usuario"
          description="Guía y documentación para utilizar la plataforma de gestión de torneos."
          icon={true}
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {manualSections.map((section) => (
              <ManualCard key={section.slug} section={section} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
