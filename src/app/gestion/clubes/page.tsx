

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { getAllTeams } from '@/actions/team-actions';
import { ClubDataTable } from '@/components/gestion/clubes/ClubDataTable';
import { columns } from '@/components/gestion/clubes/Columns';
import { CreateClubForm } from '@/components/gestion/clubes/CreateClubForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function GestionClubesPage() {
    const teams = await getAllTeams();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Clubes"
                    description="Administra los equipos que participan en la liga."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Lista de Clubes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ClubDataTable columns={columns} data={teams} />
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Crear Nuevo Club</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CreateClubForm />
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
