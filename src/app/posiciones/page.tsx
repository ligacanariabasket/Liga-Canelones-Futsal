
'use client';

import { getStandingsFromMatches } from '@/actions/season-actions';
import { getAggregatedPlayerStats } from '@/actions/player-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { StandingsTable } from '@/components/posiciones/StandingsTable';
import { PlayerRanking } from '@/components/jugadores/PlayerRanking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FullMatch, PlayerWithStats, SeasonTeamWithTeam } from '@/types';
import { useEffect, useState } from 'react';
import { ScheduleCalendar } from '@/components/posiciones/ScheduleCalendar';
import { getAllMatches } from '@/actions/match-actions';
import { Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


const TabSkeleton = () => <Skeleton className="w-full h-96 bg-muted rounded-lg" />;

export default function PosicionesPage() {
  const [standings, setStandings] = useState<SeasonTeamWithTeam[] | null>(null);
  const [players, setPlayers] = useState<PlayerWithStats[] | null>(null);
  const [matches, setMatches] = useState<FullMatch[] | null>(null);
  const [activeTab, setActiveTab] = useState('calendario');

  useEffect(() => {
    const fetchDataForTab = async () => {
      if (activeTab === 'clasificacion' && !standings) {
        setStandings(null); // Show skeleton
        const standingsData = await getStandingsFromMatches(1); 
        setStandings(standingsData as SeasonTeamWithTeam[]);
      } else if (activeTab === 'ranking' && !players) {
        setPlayers(null); // Show skeleton
        const aggregatedStats = await getAggregatedPlayerStats();
        setPlayers(aggregatedStats);
      } else if (activeTab === 'calendario' && !matches) {
        setMatches(null); // Show skeleton
        const matchesData = await getAllMatches();
        setMatches(matchesData as FullMatch[]);
      }
    };

    fetchDataForTab();
  }, [activeTab, standings, players, matches]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
            <div className="max-w-7xl mx-auto">
                  <div className="text-left mb-8">
                     <Trophy className="h-12 w-12 text-primary" />
                     <h1 className="text-4xl font-bold font-orbitron mt-4">Clasificación y Estadísticas</h1>
                     <p className="text-muted-foreground mt-2">Analiza el rendimiento de los equipos y jugadores de la liga.</p>
                 </div>
          
                <Tabs defaultValue="calendario" value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
                    <TabsList className="grid w-full grid-cols-3 mx-auto max-w-lg bg-muted/50">
                    <TabsTrigger value="calendario">Calendario</TabsTrigger>
                    <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
                    <TabsTrigger value="ranking">Ranking</TabsTrigger>
                    </TabsList>
                    <TabsContent value="calendario" className="mt-6">
                        {!matches ? <TabSkeleton /> : <ScheduleCalendar matches={matches} />}
                    </TabsContent>
                    <TabsContent value="clasificacion" className="mt-6">
                        {!standings ? <TabSkeleton /> : <StandingsTable standings={standings} />}
                    </TabsContent>
                    <TabsContent value="ranking" className="mt-6">
                        {!players ? <TabSkeleton /> : <PlayerRanking players={players} />}
                    </TabsContent>
                </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
