
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CalendarDays, Shield, Users, Trophy, ListChecks, Wrench, AlertTriangle, Vote } from 'lucide-react';
import { ClearLocalStorageButton } from '@/components/gestion/ClearLocalStorageButton';

export default async function GestionLigaPage() {

    const managementModules = [
        {
            title: 'Gestión de Calendario',
            description: 'Crea, edita y visualiza los partidos de cada jornada.',
            href: `/gestion/partidos`,
            icon: CalendarDays,
        },
        {
            title: 'Gestión de Equipos',
            description: 'Administra los clubes, sus plantillas y su información.',
            href: '/gestion/clubes',
            icon: Shield,
        },
        {
            title: 'Gestión de Jugadores',
            description: 'Añade, edita y gestiona los perfiles de todos los jugadores.',
            href: '/gestion/jugadores',
            icon: Users,
        },
        {
            title: 'Gestión de Temporadas',
            description: 'Configura las temporadas, participantes y tablas de posiciones.',
            href: '/gestion/temporadas',
            icon: Trophy,
        },
        {
            title: 'Configurar Nueva Temporada',
            description: 'Asistente para crear una nueva temporada, añadir equipos y generar el fixture.',
            href: '/gestion/configuracion',
            icon: Wrench,
        },
        {
            title: 'Gestión de Encuestas',
            description: 'Crea y administra encuestas para la interacción de los fans.',
            href: '/gestion/encuestas',
            icon: Vote,
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-left mb-12">
                            <ListChecks className="h-12 w-12 text-primary" />
                            <h1 className="text-4xl font-bold font-orbitron mt-4">Panel de Gestión</h1>
                            <p className="text-muted-foreground mt-2">Selecciona un módulo para empezar a administrar la competición.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {managementModules.map((module) => (
                                <Link href={module.href} key={module.title} className="group">
                                    <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <module.icon className="h-8 w-8 text-primary" />
                                            <div>
                                                <CardTitle>{module.title}</CardTitle>
                                                <CardDescription>{module.description}</CardDescription>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        <Card className="mt-12 border-destructive/50 bg-destructive/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    Acciones de Administrador
                                </CardTitle>
                                <CardDescription>
                                    Estas acciones son permanentes y deben usarse con precaución.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ClearLocalStorageButton />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
