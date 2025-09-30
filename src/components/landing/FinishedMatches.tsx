import { FinishedMatchCard } from './FinishedMatchCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { getFinishedMatchesForHomepage } from '@/actions/match-actions';
import type { Prisma } from '@prisma/client';

type HomepageMatch = Prisma.PromiseReturnType<typeof getFinishedMatchesForHomepage>[number];

interface FinishedMatchesProps {
    finishedMatches: HomepageMatch[];
}

export function FinishedMatches({ finishedMatches }: FinishedMatchesProps) {

    if (finishedMatches.length === 0) {
        return (
            <Card className="h-full bg-card/80 backdrop-blur-sm shadow-lg border-border/20">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Resultados Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No hay partidos finalizados recientemente.</p>
                </CardContent>
            </Card>
        );
    }

    // The data fetching component limits to 6, so we show the latest 4 here.
    const latestMatches = finishedMatches.slice(0, 4);

    return (
        <Card className="h-full bg-card/80 backdrop-blur-sm shadow-lg border-border/20">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Resultados Recientes</CardTitle>
                <p className="text-sm text-muted-foreground">Revive los momentos de los últimos partidos finalizados.</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {latestMatches.map(match => (
                        <FinishedMatchCard key={match.id} match={match} />
                    ))}
                </div>
            </CardContent>
             {finishedMatches.length > 4 && (
                <CardContent className="pt-0">
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/partidos">Ver todos los resultados</Link>
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}
