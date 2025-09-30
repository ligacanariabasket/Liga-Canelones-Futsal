

'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { JerseyButton } from './JerseyButton';
import type { Player, SelectedPlayer } from '@/types';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ActionMenu } from '@/components/controles/ActionMenu';


const PlayerButton = ({ player, teamId }: { player: Player, teamId: 'A' | 'B'}) => {
    const { state, dispatch } = useGame();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handlePlayerSelect = () => {
        const payload: SelectedPlayer = { teamId, playerId: player.id };
        dispatch({ type: 'SELECT_PLAYER', payload });
        setIsMenuOpen(true);
    };

    return (
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
                <div onClick={handlePlayerSelect}>
                    <JerseyButton
                        jerseyNumber={player.number}
                        playerName={player.name}
                        isSelected={state.selectedPlayer?.playerId === player.id}
                        variant={teamId === 'A' ? 'accent-blue' : 'accent-red'}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 bg-gray-900/80 border-gray-700 text-white backdrop-blur-md">
                 <ActionMenu player={player} onAction={() => setIsMenuOpen(false)} />
            </PopoverContent>
        </Popover>
    );
};


const PlayerList = ({ teamId }: { teamId: 'A' | 'B' }) => {
    const { state, dispatch } = useGame();
    const team = teamId === 'A' ? state.teamA : state.teamB;
    const { substitutionState, status } = state;
    const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;

    if (!team) return null;
    
    const playersWithStatus = team.players.map(p => ({ ...p, isActive: activePlayers.includes(p.id) }));
    const starters = playersWithStatus.filter(p => p.isActive);
    const substitutes = playersWithStatus.filter(p => !p.isActive);
    
    const isSelectionMode = status === 'SELECTING_STARTERS';

    const goalkeeper = starters.find(p => p.position === 'GOLERO');
    const fieldPlayers = starters.filter(p => p.position !== 'GOLERO');

    return (
        <div className="flex-1 flex flex-col">
             <CardHeader className="p-4 flex-row items-center justify-between">
                 <CardTitle className={cn("text-center text-xl font-bold", teamId === 'A' ? 'text-blue-400' : 'text-red-400' )}>{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-2 flex flex-col items-center gap-4 overflow-y-auto">
                 { isSelectionMode ? (
                    <div className="flex flex-wrap items-start justify-center gap-4">
                        {team.players.map(player => (
                           <JerseyButton
                                key={player.id}
                                jerseyNumber={player.number}
                                playerName={player.name}
                                isSelected={activePlayers.includes(player.id)}
                                onClick={() => dispatch({ type: 'TOGGLE_ACTIVE_PLAYER', payload: { teamId, playerId: player.id } })}
                                variant={activePlayers.includes(player.id) ? (teamId === 'A' ? 'accent-blue' : 'accent-red') : 'outline'}
                            />
                        ))}
                    </div>
                 ) : (
                    <>
                    <div className="w-full flex flex-col items-center gap-4 md:gap-6">
                        <div className="flex justify-center w-full">
                          {goalkeeper && (
                             <PlayerButton player={goalkeeper} teamId={teamId} />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-6">
                          {fieldPlayers.map(player => (
                             <PlayerButton key={player.id} player={player} teamId={teamId} />
                          ))}
                        </div>
                        
                        {starters.length === 0 && <p className="text-xs text-muted-foreground p-4 text-center">No hay titulares.</p>}
                         {!goalkeeper && starters.length > 0 && <p className="text-xs text-muted-foreground p-4 text-center">Sin golero titular.</p>}
                    </div>
                    
                    {substitutionState && substitutionState.playerOut.teamId === teamId && (
                        <div className="w-full mt-4">
                            <Separator className="my-2" />
                            <h3 className="px-2 mb-2 text-sm font-semibold text-blue-500 animate-pulse">Seleccione jugador entrante</h3>
                            <div className="flex flex-col items-center justify-start gap-4">
                                {substitutes.length > 0 ? substitutes.map(p => (
                                     <JerseyButton
                                        key={p.id}
                                        jerseyNumber={p.number}
                                        playerName={p.name}
                                        isSelected={false}
                                        onClick={() => dispatch({ type: 'COMPLETE_SUBSTITUTION', payload: { playerInId: p.id }})}
                                        variant="outline"
                                    />
                                )) : <p className="text-xs text-muted-foreground p-4 text-center">No hay suplentes disponibles.</p>}
                            </div>
                        </div>
                    )}
                    </>
                 )}
            </CardContent>
        </div>
    )
}


export function CombinedTeamPanel() {
  return (
    <Card className="h-full flex flex-col">
        <div className="flex-grow flex flex-row">
            <div className={cn("flex-1", 'bg-blue-900/10')}>
                <PlayerList teamId="A" />
            </div>
            <Separator orientation="vertical" className="mx-0" />
            <div className={cn("flex-1", 'bg-red-900/10')}>
                <PlayerList teamId="B" />
            </div>
        </div>
    </Card>
  );
}
