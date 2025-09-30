
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Player, PlayerPositionType } from '@/types';
import { Button } from '../ui/button';
import { TshirtIcon } from '@/components/icons';

interface PlayerButtonProps {
    player: Player;
    teamId: 'A' | 'B';
    isSelected: boolean;
    onClick: () => void;
}

const PlayerButton = ({ player, teamId, isSelected, onClick }: PlayerButtonProps) => (
    <Button
        variant="outline"
        className={cn(
            "h-full w-full p-1 flex flex-col items-center justify-center gap-1 aspect-square",
            isSelected ? "ring-2 ring-primary bg-primary/10" : (teamId === 'A' ? 'hover:bg-blue-900/20' : 'hover:bg-red-900/20')
        )}
        onClick={onClick}
    >
        <div className="relative w-12 h-12 flex items-center justify-center">
            <TshirtIcon className={cn("w-12 h-12", teamId === 'A' ? 'text-blue-500' : 'text-red-500')} />
            <span className="absolute text-white font-bold text-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{player.number}</span>
        </div>
        <span className="text-xs font-semibold text-center truncate w-full">{player.name}</span>
    </Button>
);


const PlayerGrid = ({ players, teamId, onPlayerSelect, selectedPlayer }: { players: Player[], teamId: 'A' | 'B', onPlayerSelect: (player: Player & { teamSide: 'A' | 'B' }) => void, selectedPlayer: (Player & { teamSide: 'A' | 'B'}) | null }) => (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {players.map(player => (
            <PlayerButton
                key={player.id}
                player={player}
                teamId={teamId}
                isSelected={selectedPlayer?.id === player.id}
                onClick={() => onPlayerSelect({ ...player, teamSide: teamId })}
            />
        ))}
    </div>
);

const SubstitutesPanel = ({ teamId, substitutes }: { teamId: 'A' | 'B'; substitutes: Player[] }) => {
    const { dispatch } = useGame();
    return (
        <div>
            <h4 className="font-semibold text-lg text-center my-2 text-primary">Seleccionar Entrante</h4>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {substitutes.map(player => (
                    <Button
                        key={player.id}
                        variant="outline"
                        className="h-20"
                        onClick={() => dispatch({ type: 'COMPLETE_SUBSTITUTION', payload: { playerInId: player.id }})}
                    >
                       <div className="flex flex-col items-center">
                            <span className="font-bold text-xl">{player.number}</span>
                            <span className="text-xs truncate">{player.name}</span>
                       </div>
                    </Button>
                ))}
            </div>
             <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full"
                onClick={() => dispatch({ type: 'CANCEL_SUBSTITUTION' })}
            >
                Cancelar Sustitución
            </Button>
        </div>
    )
}

interface SimpleEntryUIProps {
    selectedPlayer: (Player & { teamSide: 'A' | 'B' }) | null;
    onPlayerSelect: (player: (Player & { teamSide: 'A' | 'B' }) | null) => void;
}

const positionOrder: PlayerPositionType[] = ["GOLERO", "DEFENSA", "ALA", "PIVOT"];

const sortPlayersByPosition = (players: Player[]): Player[] => {
    return [...players].sort((a, b) => {
        const posAIndex = positionOrder.indexOf(a.position);
        const posBIndex = positionOrder.indexOf(b.position);
        return posAIndex - posBIndex;
    });
};

export function SimpleEntryUI({ selectedPlayer, onPlayerSelect }: SimpleEntryUIProps) {
    const { state } = useGame();
    const { teamA, teamB, activePlayersA, activePlayersB, substitutionState } = state;

    if (!teamA || !teamB) {
        return null; // or a loading skeleton
    }

    const startersA = sortPlayersByPosition(teamA.players.filter(p => activePlayersA.includes(p.id)));
    const substitutesA = sortPlayersByPosition(teamA.players.filter(p => !activePlayersA.includes(p.id)));

    const startersB = sortPlayersByPosition(teamB.players.filter(p => activePlayersB.includes(p.id)));
    const substitutesB = sortPlayersByPosition(teamB.players.filter(p => !activePlayersB.includes(p.id)));

    const handlePlayerSelect = (player: Player & { teamSide: 'A' | 'B' }) => {
        if (selectedPlayer?.id === player.id) {
            onPlayerSelect(null); // Deselect if clicking the same player
        } else {
            onPlayerSelect(player);
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className={cn("transition-all duration-300", substitutionState && substitutionState.playerOut.teamId !== 'A' && 'opacity-30')}>
                <CardHeader>
                    <CardTitle className="text-blue-400">{teamA.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-muted-foreground mb-2">Titulares</h3>
                        <PlayerGrid players={startersA} teamId="A" onPlayerSelect={handlePlayerSelect} selectedPlayer={selectedPlayer} />
                    </div>
                    {substitutionState && substitutionState.playerOut.teamId === 'A' ? (
                        <SubstitutesPanel teamId="A" substitutes={substitutesA} />
                    ) : (
                        <div>
                            <h3 className="font-semibold text-muted-foreground mb-2">Suplentes</h3>
                            <PlayerGrid players={substitutesA} teamId="A" onPlayerSelect={handlePlayerSelect} selectedPlayer={selectedPlayer} />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className={cn("transition-all duration-300", substitutionState && substitutionState.playerOut.teamId !== 'B' && 'opacity-30')}>
                <CardHeader>
                    <CardTitle className="text-red-400">{teamB.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-muted-foreground mb-2">Titulares</h3>
                        <PlayerGrid players={startersB} teamId="B" onPlayerSelect={handlePlayerSelect} selectedPlayer={selectedPlayer} />
                    </div>
                     {substitutionState && substitutionState.playerOut.teamId === 'B' ? (
                        <SubstitutesPanel teamId="B" substitutes={substitutesB} />
                    ) : (
                        <div>
                            <h3 className="font-semibold text-muted-foreground mb-2">Suplentes</h3>
                             <PlayerGrid players={substitutesB} teamId="B" onPlayerSelect={handlePlayerSelect} selectedPlayer={selectedPlayer} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
