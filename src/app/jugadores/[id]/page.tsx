
import { getPlayerById } from '@/actions/player-actions';
import { notFound } from 'next/navigation';
import { PlayerProfileClient } from '@/components/jugadores/perfil/PlayerProfileClient';
import type { Team, GameEvent, Player } from '@/types';

interface PlayerPageProps {
    params: {
        id: string;
    };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const playerId = parseInt(params.id, 10);
    if (isNaN(playerId)) {
        notFound();
    }

    const player = await getPlayerById(playerId);

    if (!player) {
        notFound();
    }
    
    return <PlayerProfileClient player={player as Player & { team: Team, gameEvents: GameEvent[] }} />;
}
