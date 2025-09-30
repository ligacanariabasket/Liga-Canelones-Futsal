
'use client';

import * as React from "react";
import { useGame } from '@/contexts/GameProvider';
import type { Player } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from "@/components/ui/button";
import { ActionMenu } from "./ActionMenu";
import { cn } from "@/lib/utils";

interface PlayerColumnProps {
    teamId: 'A' | 'B';
}

const PlayerButton = ({ player, teamId }: { player: Player, teamId: 'A' | 'B'}) => {
    const { dispatch } = useGame();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    
    const handlePlayerSelect = () => {
        dispatch({ type: 'SELECT_PLAYER', payload: { teamId, playerId: player.id } });
        setIsMenuOpen(true);
    };

    return (
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                    <Button 
                        variant={teamId === 'A' ? 'accent-blue' : 'accent-red'}
                        className="w-16 h-16 rounded-full text-xl font-bold flex items-center justify-center p-0"
                        onClick={handlePlayerSelect}
                    >
                        {player.number}
                    </Button>
                    <span className="text-xs font-semibold text-white/80 w-20 text-center truncate hidden md:block">{player.name}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 bg-gray-900/80 border-gray-700 text-white backdrop-blur-md">
                 <ActionMenu player={player} onAction={() => setIsMenuOpen(false)} />
            </PopoverContent>
        </Popover>
    );
};

export function PlayerColumn({ teamId }: PlayerColumnProps) {
    const { state } = useGame();
    const team = teamId === 'A' ? state.teamA : state.teamB;
    const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;

    const sortedActivePlayers = React.useMemo(() => {
        if (!team) return [];
        return team.players
            .filter(p => activePlayers.includes(p.id))
            .sort((a, b) => {
                if (a.position === 'GOLERO' && b.position !== 'GOLERO') return -1;
                if (a.position !== 'GOLERO' && b.position === 'GOLERO') return 1;
                return 0; // Maintain original order for others
            });
    }, [team, activePlayers]);

    if (!team) {
        return null;
    }
    
    const goalkeeper = sortedActivePlayers.find(p => p.position === 'GOLERO');
    const fieldPlayers = sortedActivePlayers.filter(p => p.position !== 'GOLERO');

    return (
        <Card className={cn(
            "h-full flex flex-col border-2",
            teamId === 'A' ? 'border-blue-500/50 bg-blue-900/20' : 'border-red-500/50 bg-red-900/20'
        )}>
            <CardContent className="flex-grow p-2 md:p-4 flex flex-col justify-center items-center gap-4">
                
                {/* Goalkeeper Row */}
                <div className="flex justify-center w-full">
                    {goalkeeper && <PlayerButton player={goalkeeper} teamId={teamId} />}
                </div>

                {/* Field Players Rows */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-6">
                    {fieldPlayers.map(player => (
                        <PlayerButton key={player.id} player={player} teamId={teamId} />
                    ))}
                </div>

            </CardContent>
        </Card>
    )
}
