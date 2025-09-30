
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { PlayerDataTable } from '@/components/gestion/jugadores/PlayerDataTable';
import { columns } from '@/components/gestion/jugadores/Columns';
import { CreatePlayerForm } from '@/components/gestion/jugadores/CreatePlayerForm';
import { getAllTeams, getTeamBySlug } from '@/actions/team-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface TeamPlayersPageProps {
    params: {
        slug: string;
    };
}

export default async function TeamPlayersPage({ params }: TeamPlayersPageProps) {
    const { slug } = params;
    const team = await getTeamBySlug(slug);
    const allTeams = await getAllTeams();

    if (!team) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title={`Gestión de: ${team.name}`}
                    description={`Administra la plantilla y añade nuevos jugadores al equipo.`}
                />
                <div className="container mx-auto p-4 py-8 md:p-8 space-y-8">
                     <Button asChild variant="outline">
                        <Link href="/gestion/jugadores">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a la gestión
                        </Link>
                    </Button>

                   <Card>
                        <CardHeader>
                            <CardTitle>Plantilla Actual</CardTitle>
                            <CardDescription>
                                Jugadores registrados en {team.name}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PlayerDataTable columns={columns} data={team.players} />
                        </CardContent>
                    </Card>
                    
                    <Separator />

                     <Card>
                        <CardHeader>
                            <CardTitle>Añadir Nuevo Jugador</CardTitle>
                            <CardDescription>
                                Crea y asigna un nuevo jugador a {team.name}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CreatePlayerForm teams={allTeams} defaultTeamId={team.id} />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
