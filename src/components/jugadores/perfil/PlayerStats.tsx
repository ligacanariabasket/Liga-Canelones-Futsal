
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GameEvent, Player } from '@/types';
import { useMemo } from 'react';


interface PlayerStatsProps {
    player: Player & { gameEvents: GameEvent[] };
}

const StatRow = ({ label, value }: { label: string; value: string | number; }) => (
    <div className="flex items-baseline justify-between px-6 py-4">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-primary tabular-nums">
            {value}
        </p>
    </div>
);

export function PlayerStats({ player }: PlayerStatsProps) {
    const stats = useMemo(() => {
        const events = player.gameEvents || [];
        return {
            matchesPlayed: new Set(events.map(e => e.matchId)).size,
            goals: events.filter(e => e.type === 'GOAL').length,
            assists: events.filter(e => e.type === 'ASSIST').length,
            shots: events.filter(e => e.type === 'SHOT' || e.type === 'GOAL').length,
            fouls: events.filter(e => e.type === 'FOUL').length,
            // Minutes played would require playerMatchStats, which is not available here.
            // Hardcoding for now, can be improved later.
            minutesPlayed: new Set(events.map(e => e.matchId)).size * 30, // Approximation
        }
    }, [player.gameEvents]);

    const displayStats = [
        { label: 'Partidos Jugados', value: stats.matchesPlayed },
        { label: 'Minutos Jugados', value: stats.minutesPlayed },
        { label: 'Goles', value: stats.goals },
        { label: 'Asistencias', value: stats.assists },
        { label: 'Remates', value: stats.shots },
        { label: 'Faltas', value: stats.fouls },
    ];
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Estadísticas Destacadas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y">
                {displayStats.map(stat => (
                     <StatRow key={stat.label} label={stat.label} value={stat.value} />
                ))}
            </CardContent>
        </Card>
    )
}
