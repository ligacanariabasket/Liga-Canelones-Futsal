'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings, Gamepad2, LayoutGrid, Shield, Users, Trophy, BookOpen, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const manualSections = [
  {
    title: 'Gestión',
    slug: 'gestion',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: 'Controles',
    slug: 'controles',
    icon: <Gamepad2 className="h-5 w-5" />,
  },
  {
    title: 'Cancha',
    slug: 'cancha',
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    title: 'Clubes',
    slug: 'clubes',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: 'Jugadores',
    slug: 'jugadores',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Posiciones',
    slug: 'posiciones',
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    title: 'Optimización',
    slug: 'optimizacion',
    icon: <Rocket className="h-5 w-5" />,
  },
];

interface ManualSidebarProps {
  currentSlug: string;
}

export function ManualSidebar({ currentSlug }: ManualSidebarProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            Índice del Manual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="flex flex-col gap-1">
          {manualSections.map(section => (
            <Link
              key={section.slug}
              href={`/manual/${section.slug}`}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                currentSlug === section.slug
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {section.icon}
              <span>{section.title}</span>
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
