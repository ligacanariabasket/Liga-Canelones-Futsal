
'use client';

import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import type { FullMatch } from '@/types';
import { getAllMatches } from '@/actions/match-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MatchSelectionSkeleton } from '@/components/ingreso-manual/MatchSelectionSkeleton';
import { SimpleMatchCard } from '@/components/ingreso-simple/SimpleMatchCard';

function MatchList({ matches }: { matches: FullMatch[] }) {
    if (matches.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos en este estado.</h3>
                <p className="mt-2 text-sm text-muted-foreground">No hay partidos disponibles para la carga de datos.</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {matches.map(match => (
                <SimpleMatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}

export default function IngresoSimplePage() {
  const [allMatches, setAllMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        setLoading(true);
        const matchesData = await getAllMatches();
        setAllMatches(matchesData);
        setLoading(false);
    }
    loadData();
  }, []);

  const scheduled = useMemo(() => allMatches.filter(m => m.status === 'SCHEDULED'), [allMatches]);
  const live = useMemo(() => allMatches.filter(m => m.status === 'LIVE'), [allMatches]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Ingreso Simple de Datos"
          description="Una interfaz rápida y sencilla para el registro de eventos en vivo."
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            <Card className="max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PenSquare className="h-5 w-5 text-primary" />
                        <span>Selección de Partido</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     {loading ? (
                        <MatchSelectionSkeleton />
                    ) : (
                        <Tabs defaultValue="live" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mx-auto max-w-sm">
                                <TabsTrigger value="live">En Vivo</TabsTrigger>
                                <TabsTrigger value="scheduled">Programados</TabsTrigger>
                            </TabsList>
                            <TabsContent value="live" className="mt-6">
                                <MatchList matches={live} />
                            </TabsContent>
                            <TabsContent value="scheduled" className="mt-6">
                                <MatchList matches={scheduled} />
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
