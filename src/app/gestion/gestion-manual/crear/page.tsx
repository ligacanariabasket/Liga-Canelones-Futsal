

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { FixtureCreator } from '@/components/gestion/gestion-manual/crear/FixtureCreator';
import { getAllSeasonsWithTeams, getAllTeams } from '@/actions/season-actions';
import { getAllMatches } from '@/actions/match-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Team } from '@/types';

export default async function CrearFixtureManualPage() {
    const seasons = await getAllSeasonsWithTeams();
    const teamsData = await getAllTeams();
    const teams = teamsData as Team[];
    const matches = await getAllMatches();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Creador de Fixture Manual"
                    description="Diseña el calendario de tu temporada fecha por fecha con total control."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <Card className="max-w-7xl mx-auto">
                        <CardContent className="p-4 md:p-6">
                            <FixtureCreator seasons={seasons} allTeams={teams} allMatches={matches} />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
