
import { notFound, redirect } from 'next/navigation';
import { getMatchStats } from '@/actions/match-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EventsList } from '@/components/partidos/estadisticas/EventsList';
import type { Metadata } from 'next';
import { ScoreSummary } from '@/components/partidos/estadisticas/ScoreSummary';
import { MatchSummaryStats } from '@/components/resumen/MatchSummaryStats';
import type { GameEvent } from '@/types';
import { ShotMap } from '@/components/partidos/estadisticas/ShotMap';


interface EstadisticasPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EstadisticasPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) {
    return { title: 'Estadísticas no encontradas' };
  }
  const match = await getMatchStats(id);

  if (!match) {
    return {
      title: 'Estadísticas no encontradas',
    };
  }

  const title = `Estadísticas: ${match.teamA.name} vs ${match.teamB.name}`;
  const description = `Estadísticas completas y resumen del partido de futsal entre ${match.teamA.name} y ${match.teamB.name}, resultado final ${match.scoreA} - ${match.scoreB}.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

export default async function EstadisticasPage({ params }: EstadisticasPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) {
      notFound();
  }
  const match = await getMatchStats(id);

  if (!match) {
    notFound();
  }
  
  if (match.status === 'SCHEDULED') {
      redirect('/partidos');
  }

  // Add structural events to the timeline
  const allEvents: GameEvent[] = [...(match.events || [])];
  
  allEvents.push({ id: -1, matchId: match.id, type: 'MATCH_START', timestamp: 1200 * 2, teamId: 0, playerId: null, teamName: '', playerName: '', playerInId: null, playerInName: null, x: null, y: null });
  if (match.status !== 'FINISHED' || match.period === 2) {
    const hasSecondPeriodEvents = match.events.some(e => e.timestamp <= 1200);
    if(hasSecondPeriodEvents || match.status === 'FINISHED')
      allEvents.push({ id: -2, matchId: match.id, type: 'PERIOD_START', timestamp: 1200, teamId: 0, playerId: null, teamName: '', playerName: '', playerInId: null, playerInName: null, x: null, y: null });
  }
  if (match.status === 'FINISHED') {
      allEvents.push({ id: -3, matchId: match.id, type: 'MATCH_END', timestamp: 0, teamId: 0, playerId: null, teamName: '', playerName: '', playerInId: null, playerInName: null, x: null, y: null });
  }

  allEvents.sort((a, b) => b.timestamp - a.timestamp);
  

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main 
        className="flex-1 pt-[var(--header-height)]"
        style={{ background: 'radial-gradient(circle at top, hsl(var(--card)), hsl(var(--background)))' }}
      >
        <div className="bg-transparent min-h-full">
            <div className="container mx-auto px-2 sm:px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <ScoreSummary match={match} />
                    <MatchSummaryStats match={match} />

                    <section className="mt-8 md:mt-12">
                      <ShotMap events={match.events} teamA={match.teamA} teamB={match.teamB} />
                    </section>

                    <section className="mt-8 md:mt-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">Línea de Tiempo</h2>
                        <EventsList 
                          events={allEvents} 
                          teamA={match.teamA}
                          teamB={match.teamB}
                        />
                    </section>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
