
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ManualHero } from '@/components/gestion/gestion-manual/ManualHero';
import { MatchManagementTable } from '@/components/gestion/gestion-manual/MatchManagementTable';
import { getAllMatches } from '@/actions/match-actions';
import { getAllSeasonsWithTeams } from '@/actions/season-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function GestionManualPage() {
    const matches = await getAllMatches();
    const seasons = await getAllSeasonsWithTeams();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <ManualHero />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lista de Partidos para Gestión Manual</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MatchManagementTable matches={matches} seasons={seasons} />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
