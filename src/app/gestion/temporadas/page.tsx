
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { SeasonDataTable } from '@/components/gestion/temporadas/SeasonDataTable';
import { columns } from '@/components/gestion/temporadas/Columns';
import { CreateSeasonForm } from '@/components/gestion/temporadas/CreateSeasonForm';
import { getAllSeasonsWithTeams, getAllTeams } from '@/actions/season-actions';
import { AddTeamToSeasonForm } from '@/components/gestion/temporadas/AddTeamToSeasonForm';

export default async function GestionTemporadasPage() {
    const seasons = await getAllSeasonsWithTeams();
    const teams = await getAllTeams();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Temporadas"
                    description="Administra las temporadas de la liga, los equipos participantes y sus posiciones."
                />
                 <div className="container mx-auto p-4 py-8 md:p-8">
                     <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-grow lg:w-2/3">
                             <h2 className="text-2xl font-bold text-primary mb-4">Lista de Temporadas</h2>
                             <div className="overflow-x-auto">
                                <SeasonDataTable columns={columns} data={seasons} />
                             </div>
                        </div>
                        <div className="flex-shrink-0 lg:w-1/3 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-primary mb-4">Crear Nueva Temporada</h2>
                                <CreateSeasonForm />
                            </div>
                             <div>
                                <h2 className="text-2xl font-bold text-primary mb-4">Añadir Equipo a Temporada</h2>
                                <AddTeamToSeasonForm seasons={seasons} teams={teams} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
