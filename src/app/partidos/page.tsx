
'use client';
import { getAllMatches } from '@/actions/match-actions';
import { Header } from '@/components/layout/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MatchCard from '@/components/partidos/MatchCard';
import type { FullMatch } from '@/types';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState, useMemo } from 'react';
import { ScheduleCalendar } from '@/components/posiciones/ScheduleCalendar';
import { Skeleton } from '@/components/ui/skeleton';

function MatchList({ matches }: { matches: FullMatch[] }) {
    if (matches.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos en este estado.</h3>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
                <MatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}

const TabSkeleton = () => (
    <div className="space-y-8">
        <div className="flex justify-center">
            <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    </div>
)


export default function PartidosPage() {
  const [allMatches, setAllMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMatches().then(data => {
        setAllMatches(data);
        setLoading(false);
    });
  }, []);

  const scheduled = useMemo(() => allMatches.filter(m => m.status === 'SCHEDULED'), [allMatches]);
  const live = useMemo(() => allMatches.filter(m => m.status === 'LIVE'), [allMatches]);
  const finished = useMemo(() => allMatches.filter(m => m.status === 'FINISHED'), [allMatches]);
  

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Calendario de Partidos"
          description="Consulta los próximos encuentros, los resultados de partidos finalizados y sigue la acción en vivo."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
            <Tabs defaultValue="live" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-auto max-w-lg">
                <TabsTrigger value="scheduled">Programados</TabsTrigger>
                <TabsTrigger value="live">En Vivo</TabsTrigger>
                <TabsTrigger value="finished">Finalizados</TabsTrigger>
            </TabsList>
            <TabsContent value="scheduled" className="mt-6">
                {loading ? <TabSkeleton /> : <ScheduleCalendar matches={scheduled} />}
            </TabsContent>
            <TabsContent value="live" className="mt-6">
                <MatchList matches={live} />
            </TabsContent>
            <TabsContent value="finished" className="mt-6">
                <MatchList matches={finished} />
            </TabsContent>
            </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
