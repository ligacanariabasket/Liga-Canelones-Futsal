
import { getMatchById } from '@/actions/match-actions';
import { getPollByMatch } from '@/actions/poll-actions';
import { Header } from '@/components/layout/header';
import type { FullMatch } from '@/types';
import { notFound } from 'next/navigation';
import { MatchClientContent } from '@/components/partidos/MatchClientContent';
import { PollWithOptions } from '@/types/poll-types';

interface MatchPageProps {
  params: {
    id: string;
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
    const resolvedParams = await params;
    const matchId = parseInt(resolvedParams.id, 10);
    if (isNaN(matchId)) {
        notFound();
    }

    const initialMatch: FullMatch | undefined = await getMatchById(matchId);
    const poll = await getPollByMatch(matchId) as PollWithOptions | null;

    if (!initialMatch) {
        notFound();
    }
    
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main 
              className="container mx-auto flex flex-1 flex-col items-center p-4 md:p-8 pt-[var(--header-height)]"
              style={{ background: 'radial-gradient(circle at top, hsl(var(--card)), hsl(var(--background)))' }}
            >
                <div className="w-full text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">Marcador en Vivo</h1>
                    <p className="text-muted-foreground mt-2">Sigue toda la acción del partido minuto a minuto.</p>
                </div>

                <MatchClientContent initialMatch={initialMatch} poll={poll} />
                
                 <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SportsEvent',
                        'name': `Partido de Futsal: ${initialMatch.teamA.name} vs ${initialMatch.teamB.name}`,
                        'startDate': initialMatch?.scheduledTime,
                        'homeTeam': {
                            '@type': 'SportsTeam',
                            'name': initialMatch.teamA.name
                        },
                        'awayTeam': {
                            '@type': 'SportsTeam',
                            'name': initialMatch.teamB.name
                        },
                        'location': {
                            '@type': 'Place',
                            'name': 'Gimnasio Municipal de Canelones',
                            'address': 'Canelones, Uruguay'
                        },
                        'eventStatus': `https://schema.org/${initialMatch.status === 'LIVE' ? 'EventScheduled' : (initialMatch.status === 'FINISHED' ? 'EventCompleted' : 'EventScheduled')}`,
                        })
                    }}
                />
            </main>
        </div>
    );
}
