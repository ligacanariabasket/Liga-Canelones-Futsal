
'use client';

import { useState, useMemo } from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import type { FullMatch } from '@/types';
import type { Season, SeasonTeam } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';

type SeasonWithTeams = Season & { teams: SeasonTeam[] };

interface MatchManagementTableProps {
    matches: FullMatch[];
    seasons: SeasonWithTeams[];
}

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

export function MatchManagementTable({ matches: initialMatches, seasons: initialSeasons }: MatchManagementTableProps) {
    const [matchesForSeason] = useState<FullMatch[]>(initialMatches);
    const [seasons] = useState<SeasonWithTeams[]>(initialSeasons);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>(initialSeasons.length > 0 ? String(initialSeasons[0].id) : '');
    const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
    const [loading] = useState(false);

    const filteredBySeason = useMemo(() => {
        if (!selectedSeasonId) return [];
        return matchesForSeason.filter(match => String(match.seasonId) === selectedSeasonId);
    }, [matchesForSeason, selectedSeasonId]);
    
    const availableRounds = useMemo(() => {
        const rounds = new Set(filteredBySeason.map(m => m.round).filter((r): r is number => r !== null));
        return Array.from(rounds).sort((a,b) => a - b);
    }, [filteredBySeason]);

    const filteredMatches = useMemo(() => {
        if (selectedRound === 'all') {
            return filteredBySeason;
        }
        return filteredBySeason.filter(m => m.round === selectedRound);
    }, [filteredBySeason, selectedRound]);

    const handleSeasonChange = (seasonId: string) => {
        setSelectedSeasonId(seasonId);
        setSelectedRound('all');
    }

    if (loading) {
        return <Skeleton className="h-[500px] w-full" />
    }

    return (
        <div id="match-list" className="space-y-4">
             <div className="flex items-center gap-4">
                <label htmlFor="season-select" className="text-sm font-medium">
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

            <DataTable columns={columns} data={filteredMatches} />
        </div>
    );
}
