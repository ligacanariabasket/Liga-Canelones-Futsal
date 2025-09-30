
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { getAllPlayers } from '@/actions/player-actions';
import { PlayerDataTable } from '@/components/gestion/jugadores/PlayerDataTable';
import { columns } from '@/components/gestion/jugadores/Columns';
import { CreatePlayerForm } from '@/components/gestion/jugadores/CreatePlayerForm';
import { getAllTeams } from '@/actions/team-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TeamList } from '@/components/gestion/jugadores/TeamList';
import { Separator } from '@/components/ui/separator';

export default async function GestionJugadoresPage() {
    const players = await getAllPlayers();
    const teams = await getAllTeams();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Jugadores"
                    description="Administra todos los jugadores de la liga, equipo por equipo."
                />
                <div className="container mx-auto p-4 py-8 md:p-8 space-y-8">
                   <Card>
                        <CardHeader>
                            <CardTitle>Lista de Jugadores</CardTitle>
                            <CardDescription>
                                Visualiza, busca y filtra todos los jugadores registrados en la liga.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PlayerDataTable columns={columns} data={players} />
                        </CardContent>
                    </Card>
                    
                    <Separator />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Seleccionar Equipo</CardTitle>
                                    <CardDescription>
                                        Selecciona un equipo para ver su plantilla o añadir nuevos jugadores.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <TeamList teams={teams} />
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Crear Nuevo Jugador</CardTitle>
                                    <CardDescription>
                                        Añade rápidamente un nuevo jugador a cualquier equipo.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CreatePlayerForm teams={teams} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
