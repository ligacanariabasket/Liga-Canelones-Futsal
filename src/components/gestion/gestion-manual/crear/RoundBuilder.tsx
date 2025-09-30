
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import type { Team } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Save, Loader2, CalendarIcon, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Label } from '@/components/ui/label';

export type Matchup = {
    teamAId: string | null;
    teamBId: string | null;
    scheduledDate: Date | null;
    scheduledTime: string | null;
};

interface RoundBuilderProps {
    teams: Team[];
    roundData: Matchup[];
    roundIndex: number;
    onRoundChange: (round: Matchup[]) => void;
    onSaveRound: (roundIndex: number) => Promise<boolean>;
}

export function RoundBuilder({ teams, roundData, roundIndex, onRoundChange, onSaveRound }: RoundBuilderProps) {
    const [round, setRound] = useState<Matchup[]>(roundData);
    const [isSaving, setIsSaving] = useState(false);
    const [generalDate, setGeneralDate] = useState<Date | undefined>(new Date());
    const [generalHour, setGeneralHour] = useState('19');
    const [generalMinute, setGeneralMinute] = useState('00');
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        setRound(roundData);
    }, [roundData]);

    const updateRound = (newRound: Matchup[]) => {
        setRound(newRound);
        onRoundChange(newRound);
    };

    const addMatchup = () => {
        const newRound = [...round, { teamAId: null, teamBId: null, scheduledDate: null, scheduledTime: null }];
        updateRound(newRound);
    };

    const updateMatchupField = (matchIndex: number, field: keyof Matchup, value: string | Date | null) => {
        const newRound = [...round];
        newRound[matchIndex] = {
            ...newRound[matchIndex],
            [field]: value,
        };
        updateRound(newRound);
    };
    
    const applyGeneralDateTime = () => {
        if (!generalDate) {
            toast({ variant: 'destructive', title: 'Error', description: 'Por favor, establece una fecha general.' });
            return;
        }
        const generalTimeString = `${generalHour}:${generalMinute}`;
        const newRound = round.map(match => ({
            ...match,
            scheduledDate: generalDate,
            scheduledTime: generalTimeString,
        }));
        updateRound(newRound);
        toast({ title: 'Fecha Aplicada', description: 'La fecha y hora generales se han aplicado a todos los partidos de la jornada.' });
    };

    const removeMatchup = (matchIndex: number) => {
        const newRound = round.filter((_, index) => index !== matchIndex);
        updateRound(newRound);
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        await onSaveRound(roundIndex);
        setIsSaving(false);
    }

     const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result;
                if (typeof content !== 'string') throw new Error("File content is not a string");
                
                const parsedContent = JSON.parse(content);
                let matchups: any[] = [];
                
                if (Array.isArray(parsedContent)) {
                    matchups = parsedContent;
                } else if (parsedContent && Array.isArray(parsedContent.matches)) {
                    matchups = parsedContent.matches;
                } else {
                    throw new Error("El JSON debe ser un array o un objeto con una propiedad 'matches' que sea un array.");
                }

                 const newRound = matchups.reduce((acc: Matchup[], match: any) => {
                    const teamAId = match.local?.id ?? match.teamAId;
                    const teamBId = match.visitor?.id ?? match.teamBId;

                    if (!teamAId || !teamBId) {
                        console.warn("Skipping invalid matchup:", match);
                        return acc;
                    }
                    const scheduledDateTime = match.scheduledTime ? new Date(match.scheduledTime) : null;
                    acc.push({
                        teamAId: String(teamAId),
                        teamBId: String(teamBId),
                        scheduledDate: scheduledDateTime,
                        scheduledTime: scheduledDateTime ? scheduledDateTime.toTimeString().slice(0,5) : null
                    });
                    return acc;
                }, []);
                
                updateRound(newRound);
                toast({ title: 'Archivo Cargado', description: `Se han cargado ${newRound.length} partidos para la fecha.` });

            } catch (error) {
                console.error("Error parsing JSON:", error);
                toast({ variant: 'destructive', title: 'Error de archivo', description: 'El archivo JSON no es válido o tiene un formato incorrecto.' });
            }
        };
        reader.readAsText(file);

        if(event.target) event.target.value = '';
    };
    
    const usedTeamIds = new Set(round.flatMap(m => [m.teamAId, m.teamBId]).filter(Boolean));
    const availableTeams = teams.filter(t => !usedTeamIds.has(String(t.id)));

    return (
        <Card className="bg-muted/50">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Partidos de la Fecha {roundIndex + 1}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                           <Upload className="mr-2 h-4 w-4" />
                           Cargar Fecha (JSON)
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />

                        <Button variant="outline" size="sm" onClick={handleSaveClick} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                            {isSaving ? 'Guardando...' : 'Guardar Fecha'}
                        </Button>
                    </div>
                </div>
                 <CardDescription className="pt-4">
                     Establece una fecha y hora para todos los partidos de la jornada o personaliza cada uno individualmente.
                 </CardDescription>
                 <div className="flex flex-wrap items-end gap-2 pt-2">
                     <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium">Fecha General</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {generalDate ? format(generalDate, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={generalDate} onSelect={setGeneralDate} initialFocus /></PopoverContent>
                        </Popover>
                    </div>
                     <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium">Hora General</Label>
                        <div className="flex items-center gap-1">
                            <Select value={generalHour} onValueChange={setGeneralHour}>
                                <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <span className="font-bold">:</span>
                             <Select value={generalMinute} onValueChange={setGeneralMinute}>
                                <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['00', '15', '30', '45'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <Button onClick={applyGeneralDateTime}>Aplicar a todos</Button>
                 </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {round.map((match, matchIndex) => {
                    const teamA = teams.find(t => String(t.id) === match.teamAId);
                    const teamB = teams.find(t => String(t.id) === match.teamBId);
                    
                    const availableForA = [...availableTeams];
                    if (teamA) availableForA.push(teamA);
                    const availableForB = [...availableTeams];
                    if (teamB) availableForB.push(teamB);
                    
                    const [currentHour, currentMinute] = match.scheduledTime?.split(':') || ['', ''];

                    return (
                        <div key={matchIndex} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-lg border bg-background">
                            <div className="flex-grow grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                <Select value={match.teamAId || ''} onValueChange={(id) => updateMatchupField(matchIndex, 'teamAId', id)}>
                                    <SelectTrigger><SelectValue placeholder="Equipo Local" /></SelectTrigger>
                                    <SelectContent>
                                        {availableForA.sort((a,b) => a.name.localeCompare(b.name)).map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <span className="font-bold text-muted-foreground">vs</span>
                                <Select value={match.teamBId || ''} onValueChange={(id) => updateMatchupField(matchIndex, 'teamBId', id)}>
                                    <SelectTrigger><SelectValue placeholder="Equipo Visitante" /></SelectTrigger>
                                    <SelectContent>
                                        {availableForB.sort((a,b) => a.name.localeCompare(b.name)).map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="flex items-center gap-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                            <CalendarIcon className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar 
                                            mode="single"
                                            selected={match.scheduledDate || undefined}
                                            onSelect={(date) => updateMatchupField(matchIndex, 'scheduledDate', date || null)}
                                        />
                                    </PopoverContent>
                                </Popover>
                                
                               <div className="flex items-center gap-1">
                                    <Select 
                                        value={currentHour} 
                                        onValueChange={(h) => updateMatchupField(matchIndex, 'scheduledTime', `${h}:${currentMinute}`)}
                                    >
                                        <SelectTrigger className="w-[70px] h-8 text-xs"><SelectValue placeholder="HH" /></SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <span className="font-bold text-muted-foreground">:</span>
                                    <Select 
                                        value={currentMinute}
                                        onValueChange={(m) => updateMatchupField(matchIndex, 'scheduledTime', `${currentHour}:${m}`)}
                                    >
                                        <SelectTrigger className="w-[70px] h-8 text-xs"><SelectValue placeholder="MM" /></SelectTrigger>
                                        <SelectContent>
                                            {['00', '15', '30', '45'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button variant="ghost" size="icon" onClick={() => removeMatchup(matchIndex)}>
                                    <Trash2 className="h-4 w-4 text-destructive/70" />
                                </Button>
                             </div>
                        </div>
                    );
                })}
                 <Button variant="outline" onClick={addMatchup} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Partido
                </Button>
            </CardContent>
        </Card>
    );
}

    

    