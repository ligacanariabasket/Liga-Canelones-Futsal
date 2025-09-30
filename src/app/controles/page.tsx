

'use client';

import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ControlMatchCard } from '@/components/controles/ControlMatchCard';
import { MatchListSkeleton } from '@/components/controles/MatchListSkeleton';
import { useToast } from '@/hooks/use-toast';
import { getAllMatches } from '@/actions/match-actions';
import { ClearLocalStorageButton } from '@/components/gestion/ClearLocalStorageButton';
import type { FullMatch, MatchStatus } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { ClearLiveEventsButton } from '@/components/gestion/ClearLiveEventsButton';

const RoundFilter = ({ rounds, selectedRound, onSelectRound }: { rounds: number[], selectedRound: number | 'all', onSelectRound: (round: number | 'all') => void }) => {
    if (rounds.length <= 1) return null;

    return (
        <Carousel
            opts={{ align: "start", containScroll: "trimSnaps" }}
            className="w-full max-w-lg mx-auto my-6"
        >
            <CarouselContent className="-ml-2">
                 <CarouselItem className="pl-2 basis-auto">
                    <Button
                        variant={selectedRound === 'all' ? 'default' : 'outline'}
                        onClick={() => onSelectRound('all')}
                        size="sm"
                    >
                        Todas las Jornadas
                    </Button>
                </CarouselItem>
                {rounds.map(round => (
                    <CarouselItem key={round} className="pl-2 basis-auto">
                    <Button
                        variant={selectedRound === round ? 'default' : 'outline'}
                        onClick={() => onSelectRound(round)}
                        className="w-full"
                        size="sm"
                    >
                        Jornada {round}
                    </Button>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
      </Carousel>
    )
}


export default function ControlesPage() {
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MatchStatus | 'ALL'>('SCHEDULED');
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      setError(null);
      try {
        const fetchedMatches = await getAllMatches();
        setMatches(fetchedMatches);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar los partidos.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error de Carga',
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [toast]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as MatchStatus);
    setSelectedRound('all');
  }

  const matchesForTab = useMemo(() => {
      return matches.filter((m) => activeTab === 'ALL' || m.status === activeTab)
  }, [matches, activeTab]);

  const availableRounds = useMemo(() => {
    const rounds = new Set(matchesForTab.map(m => m.round).filter((r): r is number => r !== null));
    return Array.from(rounds).sort((a,b) => a - b);
  }, [matchesForTab]);

  const filteredMatches = useMemo(() => {
      if (selectedRound === 'all') {
          return matchesForTab;
      }
      return matchesForTab.filter(m => m.round === selectedRound);
  }, [matchesForTab, selectedRound]);


  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Header />
      <main className="container mx-auto py-8 px-4 pt-[var(--header-height)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary mb-4 sm:mb-0">
            Control de Partidos
            </h1>
            <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            aria-label="Filtrar partidos por estado"
            className="w-full sm:w-auto"
            >
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="SCHEDULED" role="tab">
                Programados
                </TabsTrigger>
                <TabsTrigger value="LIVE" role="tab">
                En Vivo
                </TabsTrigger>
                <TabsTrigger value="FINISHED" role="tab">
                Finalizados
                </TabsTrigger>
            </TabsList>
            </Tabs>
        </div>

        {loading ? (
          <MatchListSkeleton />
        ) : error ? (
          <div className="flex justify-center items-center h-40 text-center text-red-500 bg-red-500/10 rounded-lg">
            <p>Error: {error}</p>
          </div>
        ) : (
          <>
            <RoundFilter
                rounds={availableRounds}
                selectedRound={selectedRound}
                onSelectRound={setSelectedRound}
            />
            {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMatches.map((match) => (
                <ControlMatchCard key={match.id} match={match} />
                ))}
            </div>
            ) : (
            <div className="flex justify-center items-center h-40 text-center text-muted-foreground bg-secondary/50 rounded-lg">
                <p>No hay partidos para los filtros seleccionados.</p>
            </div>
            )}
          </>
        )}

        <Card className="mt-12 border-destructive/50 bg-destructive/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Acciones de Administrador
                </CardTitle>
                <CardDescription>
                    Estas acciones son permanentes y deben usarse con precaución.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                <ClearLocalStorageButton />
                <ClearLiveEventsButton />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
