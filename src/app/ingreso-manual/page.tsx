
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import type { FullMatch } from '@/types';
import { getAllMatches } from '@/actions/match-actions';
import { getAllSeasonsWithTeams } from '@/actions/season-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MatchList } from '@/components/ingreso-manual/MatchList';
import { MatchSelectionSkeleton } from '@/components/ingreso-manual/MatchSelectionSkeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';
import type { Season } from '@prisma/client';

type SeasonWithTeams = Season & { teams: { teamId: number }[] };


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

export default function IngresoManualPage() {
  const [allMatches, setAllMatches] = useState<FullMatch[]>([]);
  const [seasons, setSeasons] = useState<SeasonWithTeams[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');

  useEffect(() => {
    async function loadData() {
        setLoading(true);
        const [matchesData, seasonsData] = await Promise.all([
            getAllMatches(),
            getAllSeasonsWithTeams() as Promise<SeasonWithTeams[]>
        ]);
        setAllMatches(matchesData);
        setSeasons(seasonsData);
        if (seasonsData.length > 0) {
            setSelectedSeasonId(String(seasonsData[0].id));
        }
        setLoading(false);
    }
    loadData();
  }, []);

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    setSelectedRound('all');
  };

  const filteredBySeason = useMemo(() => {
    if (!selectedSeasonId) return [];
    return allMatches.filter(m => String(m.seasonId) === selectedSeasonId);
  }, [allMatches, selectedSeasonId]);
  
  const filteredByRound = useMemo(() => {
    if (selectedRound === 'all') return filteredBySeason;
    return filteredBySeason.filter(m => m.round === selectedRound);
  }, [filteredBySeason, selectedRound]);

  const scheduled = useMemo(() => filteredByRound.filter(m => m.status === 'SCHEDULED'), [filteredByRound]);
  const live = useMemo(() => filteredByRound.filter(m => m.status === 'LIVE'), [filteredByRound]);
  const finished = useMemo(() => filteredByRound.filter(m => m.status === 'FINISHED'), [filteredByRound]);

  const availableRounds = useMemo(() => {
    const rounds = new Set(filteredBySeason.map(m => m.round).filter((r): r is number => r !== null));
    return Array.from(rounds).sort((a,b) => a - b);
  }, [filteredBySeason]);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Ingreso Manual de Datos"
          description="Herramientas para el ingreso manual de datos de partidos."
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
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <label htmlFor="season-select" className="text-sm font-medium shrink-0">
                                    Filtrar por Temporada:
                                </label>
                                <Select onValueChange={handleSeasonChange} value={selectedSeasonId}>
                                    <SelectTrigger id="season-select" className="w-full max-w-xs">
                                        <SelectValue placeholder="Seleccione una temporada" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons.map(season => (
                                            <SelectItem key={season.id} value={String(season.id)}>
                                                {season.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <RoundFilter 
                                rounds={availableRounds}
                                selectedRound={selectedRound}
                                onSelectRound={setSelectedRound}
                            />
                            
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
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
