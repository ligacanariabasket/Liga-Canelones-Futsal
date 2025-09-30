

'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Season, Team, FullMatch } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RoundBuilder, type Matchup } from './RoundBuilder';
import { createManualMatches } from '@/actions/match-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, PlusCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSeason, addTeamsToSeason } from '@/actions/season-actions';

type SeasonWithTeams = Season & { teams: { teamId: number }[] };

interface FixtureCreatorProps {
    seasons: SeasonWithTeams[];
    allTeams: Team[];
    allMatches: FullMatch[];
}

const NewSeasonForm = ({ onSeasonCreated }: { onSeasonCreated: (season: Season) => void }) => {
    const [name, setName] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!name || !year) {
            toast({ variant: 'destructive', title: 'Error', description: 'Por favor, completa todos los campos.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const newSeason = await createSeason(name, year);
            toast({ title: 'Temporada Creada', description: `La temporada "${newSeason.name}" ha sido creada.` });
            onSeasonCreated(newSeason);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo crear la temporada.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">Año</Label>
                <Input id="year" type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="col-span-3" />
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Guardar Temporada
                    </Button>
                </DialogClose>
            </DialogFooter>
        </div>
    )
}

export function FixtureCreator({ seasons: initialSeasons, allTeams, allMatches }: FixtureCreatorProps) {
    const [seasons, setSeasons] = useState<SeasonWithTeams[]>(initialSeasons);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
    const [participatingTeams, setParticipatingTeams] = useState<Team[]>([]);
    const [rounds, setRounds] = useState<Matchup[][]>([[]]);
    const [step, setStep] = useState<'season' | 'teams' | 'rounds'>('season');
    const [isSaving, setIsSaving] = useState(false);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const { toast } = useToast();
    const router = useRouter();

    const selectedSeason = useMemo(() => {
        return seasons.find(s => String(s.id) === selectedSeasonId);
    }, [seasons, selectedSeasonId]);

    const matchesForSeason = useMemo(() => {
        return selectedSeasonId ? allMatches.filter(m => String(m.seasonId) === selectedSeasonId) : [];
    }, [selectedSeasonId, allMatches]);

    useEffect(() => {
        if (step === 'teams' && selectedSeason) {
            const teamsInSeason = allTeams.filter(team =>
                selectedSeason.teams.some(st => st.teamId === team.id)
            );
            setParticipatingTeams(teamsInSeason);
        }
    }, [step, selectedSeason, allTeams]);

    useEffect(() => {
        if (step === 'rounds') {
            const numTeams = participatingTeams.length;
            const isEven = numTeams % 2 === 0;
            const numRounds = isEven ? numTeams - 1 : numTeams;
            const matchesPerRound = isEven ? numTeams / 2 : (numTeams - 1) / 2;

            const initialMatchups: Matchup[] = Array.from({ length: matchesPerRound }, () => ({ teamAId: null, teamBId: null, scheduledDate: null, scheduledTime: null }));
            const newRounds: Matchup[][] = Array.from({ length: numRounds }, () => [...initialMatchups]);
            
            matchesForSeason.forEach(match => {
                if (match.round && match.round <= newRounds.length) {
                    const roundIndex = match.round - 1;
                    const emptyMatchIndex = newRounds[roundIndex].findIndex(m => m.teamAId === null && m.teamBId === null);
                    
                    const scheduledTime = new Date(match.scheduledTime);
                    
                    const matchData: Matchup = {
                        teamAId: String(match.teamA.id),
                        teamBId: String(match.teamB.id),
                        scheduledDate: scheduledTime,
                        scheduledTime: scheduledTime.toTimeString().slice(0,5),
                    }

                    if (emptyMatchIndex !== -1) {
                         newRounds[roundIndex][emptyMatchIndex] = matchData;
                    } else {
                        newRounds[roundIndex].push(matchData);
                    }
                }
            });
            
            if (newRounds.length > 0) {
              setRounds(newRounds);
            }
        }
    }, [step, matchesForSeason, participatingTeams]);


    const handleTeamToggle = (teamId: number) => {
        setParticipatingTeams(prev => {
            const isSelected = prev.some(t => t.id === teamId);
            if (isSelected) {
                return prev.filter(t => t.id !== teamId);
            } else {
                const team = allTeams.find(t => t.id === teamId);
                return team ? [...prev, team] : prev;
            }
        });
    };
    
    const handleSaveTeams = async () => {
        if (!selectedSeasonId || participatingTeams.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Debes seleccionar una temporada y al menos un equipo.',
            });
            return;
        }
        setIsSaving(true);
        try {
            await addTeamsToSeason(parseInt(selectedSeasonId), participatingTeams.map(t => t.id));
            toast({
                title: 'Equipos Guardados',
                description: 'Los equipos han sido añadidos a la temporada.',
            });
            router.refresh();
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "No se pudo guardar los equipos.";
             toast({
                variant: "destructive",
                title: "Error al guardar",
                description: errorMessage,
            })
        } finally {
            setIsSaving(false);
        }
    }


    const handleConfirmTeams = () => {
        if (participatingTeams.length < 2) {
            toast({
                variant: 'destructive',
                title: 'Equipos insuficientes',
                description: 'Debes seleccionar al menos 2 equipos.',
            });
            return;
        }
        
        setStep('rounds');
    };

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
        if (!selectedSeasonId) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se ha seleccionado una temporada.' });
            return false;
        }
        const roundData = rounds[roundIndex];
        const matchesToCreate = processMatchups(roundData, roundIndex + 1);

        if (matchesToCreate.length === 0) {
            toast({ variant: 'destructive', title: 'Fecha Vacía', description: 'No hay partidos completos para guardar en esta fecha.' });
            return false;
        }

        try {
            await createManualMatches(parseInt(selectedSeasonId), matchesToCreate);
            toast({ title: 'Fecha Guardada', description: `Se han guardado ${matchesToCreate.length} partidos para la fecha ${roundIndex + 1}.` });
            return true;
        } catch {
            toast({ variant: 'destructive', title: 'Error al Guardar', description: 'No se pudo guardar la fecha.' });
            return false;
        }
    };

    const handleSaveRounds = async () => {
        if (!selectedSeasonId || rounds.flat().length === 0) {
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

            await createManualMatches(parseInt(selectedSeasonId), matchesToCreate);
            
            toast({
                title: '¡Fixture Guardado!',
                description: `Se han guardado ${matchesToCreate.length} partidos.`,
            });
            router.push(`/gestion/partidos?seasonId=${selectedSeasonId}`);

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
    
    const handleSeasonCreated = (newSeason: Season) => {
        const newSeasonWithTeams = { ...newSeason, teams: [] };
        setSeasons(prev => [...prev, newSeasonWithTeams]);
        setSelectedSeasonId(String(newSeason.id));
        setStep('teams');
    }

    return (
        <div className="space-y-8">
            {/* Step 1: Season Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Paso 1: Selecciona o Crea una Temporada</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Select onValueChange={(value) => {
                        setSelectedSeasonId(value);
                        setStep('teams');
                        setCurrentRoundIndex(0);
                    }} value={selectedSeasonId}>
                        <SelectTrigger className="max-w-md flex-grow">
                            <SelectValue placeholder="Elige una temporada..." />
                        </SelectTrigger>
                        <SelectContent>
                            {seasons.map(season => (
                                <SelectItem key={season.id} value={String(season.id)}>
                                    {season.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Dialog>
                        <DialogTrigger asChild>
                             <Button variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Crear Temporada
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Crear Nueva Temporada</DialogTitle>
                            </DialogHeader>
                            <NewSeasonForm onSeasonCreated={handleSeasonCreated} />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Step 2: Team Selection */}
            {step !== 'season' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Paso 2: Selecciona los Equipos Participantes</CardTitle>
                        <CardDescription>Estos equipos estarán disponibles para armar las fechas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-64 border rounded-md">
                            <div className="p-4">
                                <div className="flex items-center space-x-2 pb-2 mb-2 border-b">
                                    <Checkbox
                                        id="select-all"
                                        checked={participatingTeams.length === allTeams.length && allTeams.length > 0}
                                        onCheckedChange={(checked) => {
                                            setParticipatingTeams(checked ? allTeams : [])
                                        }}
                                        disabled={step === 'rounds'}
                                    />
                                    <label
                                        htmlFor="select-all"
                                        className="text-sm font-medium leading-none"
                                    >
                                        Seleccionar todos
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {allTeams.map(team => (
                                        <div key={team.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`team-${team.id}`}
                                                checked={participatingTeams.some(t => t.id === team.id)}
                                                onCheckedChange={() => handleTeamToggle(team.id)}
                                                disabled={step === 'rounds'}
                                            />
                                            <label htmlFor={`team-${team.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {team.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>
                        {step === 'teams' && (
                             <div className="flex gap-4 mt-4">
                                <Button onClick={handleSaveTeams} disabled={isSaving || participatingTeams.length === 0} variant="outline">
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                                    Guardar Equipos
                                </Button>
                                <Button onClick={handleConfirmTeams}>
                                    Confirmar y Crear Fechas
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Round Builder */}
            {step === 'rounds' && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Paso 3: Arma las Fechas</CardTitle>
                        <div className="flex items-center justify-between">
                            <CardDescription>Configura los partidos para cada fecha del torneo.</CardDescription>
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
                            roundData={rounds[currentRoundIndex]}
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
                                Guardar Fixture Completo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
