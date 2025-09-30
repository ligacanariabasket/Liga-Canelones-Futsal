

'use client';

import type { Player, Team } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface MatchPlayersProps {
    match: {
        teamA: Team;
        teamB: Team;
    }
}

const PlayerRow = ({ player }: { player: Player }) => (
    <Link href={`/jugadores/${player.id}`} className="block group">
        <div className="flex items-center gap-4 p-2 rounded-lg transition-colors hover:bg-muted/50">
            <Image 
                src={player.avatarUrl || '/avatar/1.png'} 
                alt={player.name} 
                width={40} 
                height={40} 
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-grow">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{player.name}</p>
                <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
            <div className="text-xl font-black text-muted-foreground/50">
                {player.number}
            </div>
        </div>
    </Link>
);


const TeamPlayerList = ({ team, title }: { team: Team, title: string }) => (
    <div>
        <h3 className="text-lg font-bold text-center mb-4 text-primary">{title}</h3>
        <div className="space-y-2">
            {team.players.map(player => (
                <PlayerRow key={player.id} player={player} />
            ))}
        </div>
    </div>
)

export function MatchPlayers({ match }: MatchPlayersProps) {
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border text-foreground mt-8">
            <CardHeader>
                <CardTitle>Alineaciones</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <TeamPlayerList team={match.teamA} title={match.teamA.name} />
                    <TeamPlayerList team={match.teamB} title={match.teamB.name} />
                </div>
            </CardContent>
        </Card>
    );
}
