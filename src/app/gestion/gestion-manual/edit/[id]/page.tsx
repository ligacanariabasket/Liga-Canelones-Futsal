

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { getAllSeasonsWithTeams, getAllTeams } from '@/actions/season-actions';
import { getAllMatches } from '@/actions/match-actions';
import { notFound } from 'next/navigation';
import { FixtureEditor } from '@/components/gestion/gestion-manual/edit/FixtureEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Team } from '@/types';

interface EditFixturePageProps {
  params: {
    id: string;
  };
}

export default async function EditFixturePage({ params }: EditFixturePageProps) {
    const seasonId = parseInt(params.id, 10);
    if (isNaN(seasonId)) {
        notFound();
    }

    const seasons = await getAllSeasonsWithTeams();
    const teamsData = await getAllTeams();
    const teams = teamsData as Team[];
    const matches = await getAllMatches();

    const seasonToEdit = seasons.find(s => s.id === seasonId);

    if (!seasonToEdit) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Editor de Fixture Manual"
                    description={`Editando el calendario para la temporada: ${seasonToEdit.name}`}
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <Card className="max-w-7xl mx-auto">
                        <CardContent className="p-4 md:p-6">
                           <FixtureEditor
                                season={seasonToEdit}
                                allTeams={teams}
                                allMatches={matches}
                           />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
