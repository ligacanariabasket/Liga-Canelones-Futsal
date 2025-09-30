
import type { Player, Team } from '@/types';
import { CardContent } from '../ui/card';
import { PlayerInfoCard } from './PlayerInfoCard';

interface TeamPlayersProps {
    team: Team;
}

const positionTranslations: { [key: string]: string } = {
    GOLERO: 'Porteros',
    DEFENSA: 'Defensas',
    ALA: 'Alas',
    PIVOT: 'Pivots',
};

const orderedPositions = ['GOLERO', 'DEFENSA', 'ALA', 'PIVOT'];

export function TeamPlayers({ team }: TeamPlayersProps) {
    const groupedPlayers = (team.players || []).reduce((acc, player) => {
        const position = player.position || 'Unknown';
        if (!acc[position]) {
            acc[position] = [];
        }
        acc[position].push(player);
        return acc;
    }, {} as Record<string, Player[]>);

    return (
        <CardContent className="p-0">
            <div className="space-y-6">
                {orderedPositions.map(position => (
                    groupedPlayers[position] && (
                        <div key={position}>
                            <h3 className="bg-muted/50 px-4 py-2 text-sm font-semibold text-muted-foreground sticky top-0 z-10">
                                {positionTranslations[position] || position}
                            </h3>
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {groupedPlayers[position].map(player => (
                                    <PlayerInfoCard key={player.id} player={player} team={team} />
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </CardContent>
    );
}
