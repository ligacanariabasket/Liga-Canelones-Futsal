

'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { JerseyButton } from './JerseyButton';
import type { Player } from '@/types';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamColumnProps {
    teamId: 'A' | 'B';
    team: { id: number; name: string; players: Player[] } | null;
    activePlayers: number[];
    onPlayerToggle: (payload: { teamId: 'A' | 'B'; playerId: number; }) => void;
}

function TeamColumn({ team, teamId, activePlayers, onPlayerToggle }: TeamColumnProps) {
    if (!team) return null;

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-center text-primary">{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-start justify-center gap-4">
                {team.players.map(player => (
                    <JerseyButton
                        key={player.id}
                        jerseyNumber={player.number}
                        playerName={player.name}
                        isSelected={activePlayers.includes(player.id)}
                        onClick={() => onPlayerToggle({ teamId, playerId: player.id })}
                    />
                ))}
            </CardContent>
            <CardFooter className="justify-center font-semibold">
                <Users className="mr-2 h-4 w-4" />
                <span>{activePlayers.length} / 5 seleccionados</span>
            </CardFooter>
        </Card>
    );
}

export function StarterSelection() {
    const { state, dispatch, handleSaveChanges } = useGame();
    const { toast } = useToast();
    const { teamA, teamB, activePlayersA, activePlayersB } = state;

    const handlePlayerToggle = (payload: { teamId: 'A' | 'B'; playerId: number; }) => {
        dispatch({ type: 'TOGGLE_ACTIVE_PLAYER', payload });
    };

    const handleConfirmStarters = async () => {
        if (activePlayersA.length !== 5 || activePlayersB.length !== 5) {
            toast({
                variant: 'destructive',
                title: 'Error de Selección',
                description: 'Cada equipo debe tener exactamente 5 titulares seleccionados.',
            });
            return;
        }
        
        // Create a new state object for the update
        const newState = { ...state, status: 'LIVE' as const, isRunning: false };
        
        // Dispatch the status change locally
        dispatch({ type: 'SET_STATUS', payload: 'LIVE' });

        // Save the entire new state to the database
        await handleSaveChanges(newState);
        
        toast({
            title: '¡A Jugar!',
            description: 'Los titulares han sido confirmados y el partido está listo para comenzar.',
        });
    };
    
    return (
        <div className="flex flex-col gap-6 items-center">
             <div className="text-center">
                <h1 className="text-2xl font-bold text-primary">Definir Titulares</h1>
                <p className="text-muted-foreground">Selecciona 5 jugadores de cada equipo para iniciar el partido.</p>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-6">
                <TeamColumn teamId="A" team={teamA} activePlayers={activePlayersA} onPlayerToggle={handlePlayerToggle} />
                <TeamColumn teamId="B" team={teamB} activePlayers={activePlayersB} onPlayerToggle={handlePlayerToggle} />
            </div>
            <Button size="lg" onClick={handleConfirmStarters} variant="accent">
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirmar Titulares e Iniciar Partido
            </Button>
        </div>
    );
}
