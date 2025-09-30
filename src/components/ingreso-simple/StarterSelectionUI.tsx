
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import type { Player, SelectedPlayer } from '@/types';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TshirtIcon } from '@/components/icons';
import { cn } from '@/lib/utils';


const PlayerButton = ({ player, isSelected, onToggle }: { player: Player, isSelected: boolean, onToggle: () => void }) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center gap-1 cursor-pointer group p-2 rounded-lg transition-colors",
                isSelected ? "bg-primary/10" : "hover:bg-muted/50"
            )}
            onClick={onToggle}
        >
             <div className="relative w-16 h-16 flex items-center justify-center">
                <TshirtIcon className={cn(
                    "w-14 h-14 transition-all duration-200 ease-in-out group-hover:scale-110",
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                )} />
                <span className="absolute text-white font-bold text-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    {player.number}
                </span>
            </div>
            <span className={cn(
                "mt-1 text-xs font-semibold text-center truncate w-20 transition-colors",
                isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}>
                {player.name}
            </span>
        </div>
    );
};

interface TeamColumnProps {
    teamId: 'A' | 'B';
    team: { id: number; name: string; players: Player[] } | null;
    activePlayers: number[];
    onPlayerToggle: (payload: SelectedPlayer) => void;
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
                    <PlayerButton
                        key={player.id}
                        player={player}
                        isSelected={activePlayers.includes(player.id)}
                        onToggle={() => onPlayerToggle({ teamId, playerId: player.id })}
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

export function StarterSelectionUI() {
    const { state, dispatch, handleSaveChanges } = useGame();
    const { toast } = useToast();
    const { teamA, teamB, activePlayersA, activePlayersB } = state;

    const handlePlayerToggle = (payload: SelectedPlayer) => {
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
        
        const newState = { ...state, status: 'LIVE' as const, isRunning: false };
        
        dispatch({ type: 'SET_STATUS', payload: 'LIVE' });

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
            <Button size="lg" onClick={handleConfirmStarters}>
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirmar Titulares e Iniciar Partido
            </Button>
        </div>
    );
}
