
'use client';

import { getAllMatches } from '@/actions/match-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { ResumenMatchCard } from '@/components/resumen/ResumenMatchCard';
import { useEffect, useState } from 'react';
import { FullMatch } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function MatchList({ matches }: { matches: FullMatch[] }) {
    if (matches.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos en este estado.</h3>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
                <ResumenMatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}


export default function ResumenSelectionPage() {
  const [allMatches, setAllMatches] = useState<FullMatch[]>([]);

  useEffect(() => {
    getAllMatches().then(matches => {
        setAllMatches(matches);
    });
  }, []);

  const scheduled = allMatches.filter(m => m.status === 'SCHEDULED');
  const live = allMatches.filter(m => m.status === 'LIVE');
  const finished = allMatches.filter(m => m.status === 'FINISHED');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Resumen de Partidos"
          description="Explora las estadísticas detalladas de los partidos."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
            <Tabs defaultValue="finished" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md">
                <TabsTrigger value="scheduled">Programados</TabsTrigger>
                <TabsTrigger value="live">En Vivo</TabsTrigger>
                <TabsTrigger value="finished">Finalizados</TabsTrigger>
            </TabsList>
            <TabsContent value="scheduled" className="mt-6">
                <MatchList matches={scheduled} />
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
