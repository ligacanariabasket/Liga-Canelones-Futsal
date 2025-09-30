

'use client';

import type { FullMatch, GameEvent, GameEventType, Player, Team } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Hand, RefreshCw, Shield, Square, Timer, Goal, Footprints, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { TshirtIcon } from '@/components/icons';


interface ManualEntryFormProps {
  match: FullMatch;
}

const actionButtons: { type: GameEventType; label: string; icon: React.ReactNode; className?: string }[] = [
  { type: 'GOAL', label: 'Gol', icon: <Goal />, className: 'bg-green-600 hover:bg-green-700 text-white' },
  { type: 'ASSIST', label: 'Asistencia', icon: <Hand /> },
  { type: 'SHOT', label: 'Tiro', icon: <Footprints /> },
  { type: 'FOUL', label: 'Falta', icon: <Shield />, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { type: 'YELLOW_CARD', label: 'Amarilla', icon: <Square className="text-yellow-400 fill-current" />, className: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' },
  { type: 'RED_CARD', label: 'Roja', icon: <Square className="text-red-500 fill-current" />, className: 'bg-red-500/20 text-red-400 hover:bg-red-500/30' },
  { type: 'SUBSTITUTION', label: 'Cambio', icon: <RefreshCw />, className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { type: 'TIMEOUT', label: 'T. Muerto', icon: <Timer />, className: 'bg-teal-600 hover:bg-teal-700 text-white' },
];


const EventCreationForm = ({ player, teamId, onEventCreated, initialTime }: { player: Player; teamId: 'A' | 'B', onEventCreated: (time: number) => void; initialTime: number }) => {
    const { state, dispatch } = useGame();
    const [eventType, setEventType] = useState<GameEventType | null>(null);
    const { toast } = useToast();
    const [timeValue, setTimeValue] = useState(initialTime);

    useEffect(() => {
        setTimeValue(initialTime);
    }, [initialTime]);


    const handleTimeChange = (delta: number) => {
        setTimeValue(prev => Math.max(0, Math.min(1200, prev + delta)));
    };

    const handleAddEvent = () => {
        if (!eventType) {
            toast({ variant: 'destructive', title: "Faltan datos", description: "Por favor, seleccione un tipo de evento."});
            return;
        }

        const team = teamId === 'A' ? state.teamA : state.teamB;
        if (!team) return;

        if (eventType === 'SUBSTITUTION') {
            dispatch({ type: 'INITIATE_SUBSTITUTION', payload: { playerOut: { playerId: player.id, teamId: teamId } } });
            onEventCreated(timeValue);
            return;
        }

        // Calculate absolute timestamp based on period
        const absoluteTimestamp = state.period === 1
            ? timeValue + 1200
            : timeValue;

        const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
            type: eventType,
            teamId: team.id,
            playerId: player.id,
            playerName: player.name,
            teamName: team.name,
            timestamp: absoluteTimestamp,
            playerInId: null,
            playerInName: null,
            x: null,
            y: null,
        };

        dispatch({ type: 'ADD_EVENT', payload: { event: newEvent } });
        // Server action is not called from here in manual mode, only on final save.

        toast({
            title: "Evento Registrado Localmente",
            description: `${eventType} para ${player.name}.`
        });
        
        onEventCreated(timeValue);
    };
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                 <div className="text-center">
                    <h3 className="font-bold">Registrar Evento</h3>
                    <p className="text-sm text-muted-foreground">
                        Para: {player.name}
                    </p>
                </div>
                
                 <div className="grid grid-cols-4 gap-2">
                    {actionButtons.map(action => (
                        <motion.div key={action.type} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant={eventType === action.type ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                                "w-full flex-col h-16",
                                eventType !== action.type && action.className
                            )}
                            onClick={() => setEventType(action.type)}
                        >
                            {React.cloneElement(action.icon as React.ReactElement, { className: 'h-5 w-5 mb-1' })}
                            <span className="text-xs">{action.label}</span>
                        </Button>
                        </motion.div>
                    ))}
                </div>

                <div>
                    <Label htmlFor={`time-${player.id}`} className="mb-2 block text-center">Tiempo del Evento (MM:SS del período)</Label>
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleTimeChange(-30)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            id={`time-${player.id}`}
                            type="text"
                            value={formatTime(timeValue)}
                            readOnly
                            className="w-24 text-center text-lg font-mono"
                        />
                         <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleTimeChange(30)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Button onClick={handleAddEvent} disabled={!eventType} className="w-full">
                    Añadir Evento
                </Button>
            </CardContent>
        </Card>
    )
}


const PlayerButton = ({ player, team, onSelect, isSelected, isActive, className, onEventCreated, initialTime }: { player: Player, team: Team, onSelect: () => void, isSelected: boolean, isActive: boolean, className?: string, onEventCreated: (time: number) => void, initialTime: number }) => {
    const { state } = useGame();
    const [popoverOpen, setPopoverOpen] = useState(false);
    
    const isSelectionMode = state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS';
    const teamId = team.id === state.teamA?.id ? 'A' : 'B';

    const buttonContent = (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <TshirtIcon className={cn("w-16 h-16 transition-all duration-200 ease-in-out group-hover:scale-110", teamId === 'A' ? 'text-blue-500' : 'text-red-500')} />
            {isActive && !isSelectionMode && (
                <div className="absolute top-1 right-1 bg-black/50 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
                    T
                </div>
            )}
            <span className="absolute text-white font-bold text-lg md:text-2xl select-none transition-all duration-200 ease-in-out group-hover:scale-110 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                {player.number}
            </span>
        </div>
    );
    

    if(isSelectionMode) {
        return (
             <Button
                variant="outline"
                className={cn(
                    "aspect-square h-full w-full text-lg font-bold transition-all duration-200 ease-in-out rounded-none text-foreground/80 border-border/30 hover:bg-muted/50",
                    isSelected && 'ring-2 ring-offset-2 ring-primary ring-offset-background',
                    className
                )}
                onClick={onSelect}
            >
                {buttonContent}
            </Button>
        )
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "aspect-square h-full w-full text-lg font-bold transition-all duration-200 ease-in-out rounded-none text-foreground/80 border-border/30 hover:bg-muted/50",
                        isSelected && 'ring-2 ring-offset-2 ring-primary ring-offset-background',
                        isActive && !isSelected && 'bg-primary/10',
                        className
                    )}
                    onClick={onSelect}
                >
                    {buttonContent}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <EventCreationForm 
                    player={player} 
                    teamId={teamId}
                    onEventCreated={(time) => {
                        onEventCreated(time);
                        setPopoverOpen(false);
                    }}
                    initialTime={initialTime}
                />
            </PopoverContent>
        </Popover>
    );
};

const TeamPlayerGrid = ({ teamId, team, onPlayerSelect, selectedPlayerId, onEventCreated, lastEventTime }: { teamId: 'A' | 'B', team: FullMatch['teamA'], onPlayerSelect: (teamId: 'A' | 'B', playerId: number) => void, selectedPlayerId: number | null, onEventCreated: (time: number) => void, lastEventTime: number }) => {
    const { state, dispatch } = useGame();
    const { status, substitutionState } = state;
    const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;

    if (!team) return null;
    
    const positionOrder: Player['position'][] = ["GOLERO", "DEFENSA", "ALA", "PIVOT"];

    const sortedPlayers = [...team.players].sort((a, b) => {
        const posA = positionOrder.indexOf(a.position);
        const posB = positionOrder.indexOf(b.position);
        
        if (posA === -1) return 1;
        if (posB === -1) return -1;

        if (posA !== posB) {
            return posA - posB;
        }
        return a.number - b.number;
    });

    const isSelectionMode = status === 'SCHEDULED' || status === 'SELECTING_STARTERS';
    
    const starters = sortedPlayers.filter(p => activePlayers.includes(p.id));
    const substitutes = sortedPlayers.filter(p => !activePlayers.includes(p.id));
    
    const displayPlayers = isSelectionMode ? sortedPlayers : [...starters, ...substitutes];

    const handleSubstituteClick = (playerInId: number) => {
        dispatch({ type: 'COMPLETE_SUBSTITUTION', payload: { playerInId } });
    }

    if (substitutionState && substitutionState.playerOut.teamId === teamId) {
        return (
            <Card className="flex-1 overflow-hidden bg-blue-900/10">
                <CardContent className="p-4 h-full">
                     <h3 className="text-center font-bold text-primary mb-2">Seleccionar Suplente</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-0 h-full">
                        {substitutes.map(player => (
                           <Button
                                key={player.id}
                                variant="outline"
                                className="aspect-square h-full w-full text-lg font-bold"
                                onClick={() => handleSubstituteClick(player.id)}
                            >
                                {player.number}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn(
            "flex-1 overflow-hidden flex flex-col",
            teamId === 'A' ? 'bg-blue-900/10' : 'bg-red-900/10'
        )}>
            <CardContent className="flex-grow flex flex-col gap-0 p-0 h-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-4 gap-0 p-0 h-full flex-grow overflow-y-auto">
                    {displayPlayers.map((player) => (
                        <PlayerButton
                            key={player.id}
                            player={player}
                            team={team}
                            onSelect={() => onPlayerSelect(teamId, player.id)}
                            isSelected={selectedPlayerId === player.id || (isSelectionMode && activePlayers.includes(player.id))}
                            isActive={activePlayers.includes(player.id)}
                            onEventCreated={onEventCreated}
                            initialTime={lastEventTime}
                            className={!isSelectionMode && !activePlayers.includes(player.id) ? 'opacity-50' : ''}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const StarterSelectionActions = () => {
    const { state, dispatch } = useGame();
    const { toast } = useToast();

    const handleConfirmStarters = () => {
        if (state.activePlayersA.length > 5 || state.activePlayersB.length > 5) {
            toast({ variant: 'destructive', title: "Error", description: "No puede haber más de 5 jugadores por equipo."});
            return;
        }
         if (state.activePlayersA.length < 5 || state.activePlayersB.length < 5) {
            toast({ variant: 'destructive', title: "Error", description: "Debe seleccionar 5 jugadores por equipo."});
            return;
        }
        dispatch({ type: 'SET_STATUS', payload: 'LIVE' });
        toast({ title: "Titulares Confirmados", description: "El partido está listo para comenzar."});
    };

    return (
        <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Selecciona 5 jugadores por equipo para definir los titulares.</p>
            <Button onClick={handleConfirmStarters}>Confirmar Titulares e Iniciar</Button>
        </div>
    )
}

export function ManualEntryForm({ match }: ManualEntryFormProps) {
    const { state, dispatch } = useGame();
    const { selectedPlayer: selectedPlayerData, substitutionState } = state;
    const [lastEventTime, setLastEventTime] = useState(state.time);

    const storageKey = `futsal-last-event-time-${match.id}`;

    useEffect(() => {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) {
            setLastEventTime(parseInt(savedTime, 10));
        } else {
            setLastEventTime(state.time);
        }
    }, [storageKey, state.time]);

    const handlePlayerSelect = (teamId: 'A' | 'B', playerId: number) => {
        if (state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') {
             dispatch({ type: 'TOGGLE_ACTIVE_PLAYER', payload: { teamId, playerId } });
        } else {
            if (substitutionState) {
                dispatch({ type: 'CANCEL_SUBSTITUTION' });
            }

            if (selectedPlayerData?.playerId === playerId) {
                dispatch({ type: 'SELECT_PLAYER', payload: null });
            } else {
                dispatch({ type: 'SELECT_PLAYER', payload: { teamId, playerId } });
            }
        }
    }

    const handleEventCreated = (time: number) => {
        setLastEventTime(time);
        localStorage.setItem(storageKey, String(time));
    };
    
    return (
        <div className="space-y-6">
             <div className="grid grid-cols-2 gap-2">
                <TeamPlayerGrid 
                    teamId="A" 
                    team={match.teamA} 
                    onPlayerSelect={handlePlayerSelect} 
                    selectedPlayerId={selectedPlayerData?.playerId || null}
                    onEventCreated={handleEventCreated}
                    lastEventTime={lastEventTime}
                />
                <TeamPlayerGrid 
                    teamId="B" 
                    team={match.teamB} 
                    onPlayerSelect={handlePlayerSelect} 
                    selectedPlayerId={selectedPlayerData?.playerId || null} 
                    onEventCreated={handleEventCreated}
                    lastEventTime={lastEventTime}
                />
            </div>
            {(state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') && (
                <StarterSelectionActions />
            )}
        </div>
    );
}
