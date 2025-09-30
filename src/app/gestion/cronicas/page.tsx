
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CronicasHero } from '@/components/gestion/cronicas/CronicasHero';
import { Card, CardContent } from '@/components/ui/card';
import { getAllMatches } from '@/actions/match-actions';
import { FinishedMatchesList } from '@/components/gestion/cronicas/FinishedMatchesList';

export default async function GestionCronicasPage() {
    const allMatches = await getAllMatches();
    const finishedMatches = allMatches.filter(m => m.status === 'FINISHED');

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <CronicasHero />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <Card>
                        <CardContent className="p-4 md:p-6">
                            <FinishedMatchesList matches={finishedMatches} />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
