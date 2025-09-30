

'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Season, Team, FullMatch } from '@/types';
import { Button } from '@/components/ui/button';
import { RoundBuilder, type Matchup } from '../crear/RoundBuilder';
import { createManualMatches } from '@/actions/match-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type SeasonWithTeams = Season & { teams: { teamId: number }[] };

interface FixtureEditorProps {
    season: SeasonWithTeams;
    allTeams: Team[];
    allMatches: FullMatch[];
}

export function FixtureEditor({ season, allTeams, allMatches }: FixtureEditorProps) {
    const [participatingTeams, setParticipatingTeams] = useState<Team[]>([]);
    const [rounds, setRounds] = useState<Matchup[][]>([[]]);
    const [isSaving, setIsSaving] = useState(false);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const { toast } = useToast();
    const router = useRouter();

    const matchesForSeason = useMemo(() => {
        return allMatches.filter(m => m.seasonId === season.id);
    }, [season, allMatches]);

    useEffect(() => {
        const teamsInSeason = allTeams.filter(team =>
            season.teams.some(st => st.teamId === team.id)
        );
        setParticipatingTeams(teamsInSeason);

        const numTeams = teamsInSeason.length;
        const isEven = numTeams % 2 === 0;
        const numRounds = isEven ? numTeams - 1 : numTeams;
        const matchesPerRound = isEven ? numTeams / 2 : (numTeams - 1) / 2;
        
        const initialMatchups: Matchup[] = Array.from({ length: matchesPerRound }, () => ({ teamAId: null, teamBId: null, scheduledDate: null, scheduledTime: null }));
        const newRounds: Matchup[][] = Array.from({ length: numRounds > 0 ? numRounds : 1 }, () => [...initialMatchups]);
        
        matchesForSeason.forEach(match => {
            if (match.round && match.round <= newRounds.length) {
                const roundIndex = match.round - 1;
                
                const scheduledTime = new Date(match.scheduledTime);
                const matchData: Matchup = {
                    teamAId: String(match.teamA.id),
                    teamBId: String(match.teamB.id),
                    scheduledDate: scheduledTime,
                    scheduledTime: scheduledTime.toTimeString().slice(0,5),
                };

                const emptyMatchIndex = newRounds[roundIndex].findIndex(m => m.teamAId === null && m.teamBId === null);
                if (emptyMatchIndex !== -1) {
                     newRounds[roundIndex][emptyMatchIndex] = matchData;
                } else {
                    newRounds[roundIndex].push(matchData);
                }
            }
        });
        
        if (newRounds.length > 0) {
          setRounds(newRounds);
        } else {
          setRounds([[]]);
        }

    }, [season, allTeams, matchesForSeason]);

    const processMatchups = (matchups: Matchup[], round: number) => {
        return matchups
            .filter(match => match.teamAId && match.teamBId)
            .map(match => {
                let scheduledTime = new Date();
                if (match.scheduledDate) {
                    scheduledTime = new Date(match.scheduledDate);
                    if (match.scheduledTime) {
                        const [hours, minutes] = match.scheduledTime.split(':').map(Number);
                        scheduledTime.setHours(hours, minutes);
                    }
                }
                return {
                    teamAId: parseInt(match.teamAId!),
                    teamBId: parseInt(match.teamBId!),
                    round,
                    scheduledTime,
                };
            });
    }

     const handleSaveRound = async (roundIndex: number) => {
        const roundData = rounds[roundIndex];
        const matchesToCreate = processMatchups(roundData, roundIndex + 1);

        if (matchesToCreate.length === 0) {
            toast({ variant: 'destructive', title: 'Fecha Vacía', description: 'No hay partidos completos para guardar en esta fecha.' });
            return false;
        }

        try {
            await createManualMatches(season.id, matchesToCreate);
            toast({ title: 'Fecha Guardada', description: `Se han guardado ${matchesToCreate.length} partidos para la fecha ${roundIndex + 1}.` });
            router.refresh();
            return true;
        } catch {
            toast({ variant: 'destructive', title: 'Error al Guardar', description: 'No se pudo guardar la fecha.' });
            return false;
        }
    };

    const handleSaveRounds = async () => {
        if (rounds.flat().length === 0) {
            toast({
                variant: 'destructive',
                title: 'Datos incompletos',
                description: 'No hay rondas o partidos para guardar.',
            });
            return;
        }

        setIsSaving(true);
        try {
            const matchesToCreate = rounds.flatMap((round, roundIndex) => processMatchups(round, roundIndex + 1));
            
            if (matchesToCreate.length === 0) {
                toast({ variant: 'destructive', title: 'Fixture Vacío', description: 'No hay partidos completos en ninguna fecha para guardar.' });
                setIsSaving(false);
                return;
            }

            await createManualMatches(season.id, matchesToCreate);
            
            toast({
                title: '¡Fixture Actualizado!',
                description: `Se han guardado ${matchesToCreate.length} partidos.`,
            });
            router.push(`/gestion/partidos?seasonId=${season.id}`);

        } catch {
             toast({
                variant: 'destructive',
                title: 'Error al guardar',
                description: 'No se pudo guardar el fixture en la base de datos.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Editor de Fechas</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setCurrentRoundIndex(p => Math.max(0, p - 1))} disabled={currentRoundIndex === 0}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                            Fecha {currentRoundIndex + 1} de {rounds.length}
                        </span>
                        <Button variant="outline" size="icon" onClick={() => setCurrentRoundIndex(p => Math.min(rounds.length - 1, p + 1))} disabled={currentRoundIndex === rounds.length - 1}>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <RoundBuilder
                    teams={participatingTeams}
                    roundData={rounds[currentRoundIndex] || []}
                    roundIndex={currentRoundIndex}
                    onRoundChange={(updatedRound) => {
                        const newRounds = [...rounds];
                        newRounds[currentRoundIndex] = updatedRound;
                        setRounds(newRounds);
                    }}
                    onSaveRound={handleSaveRound}
                />
                <Separator />
                <div className="flex justify-end">
                    <Button onClick={handleSaveRounds} disabled={isSaving} size="lg">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Guardar Todos los Cambios
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
