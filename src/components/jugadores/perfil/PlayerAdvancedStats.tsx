
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Player, GameEvent } from '@/types';
import { useMemo } from 'react';
import { Footprints, Goal, Shield } from 'lucide-react';
import { StatCard } from '@/components/partidos/estadisticas/StatCard';

interface PlayerAdvancedStatsProps {
    player: Player & { gameEvents: GameEvent[] };
}

export function PlayerAdvancedStats({ player }: PlayerAdvancedStatsProps) {
    const stats = useMemo(() => {
        const shots = player.gameEvents.filter(e => e.type === 'SHOT' || e.type === 'GOAL').length;
        const goals = player.gameEvents.filter(e => e.type === 'GOAL').length;
        const fouls = player.gameEvents.filter(e => e.type === 'FOUL').length;
        const yellowCards = player.gameEvents.filter(e => e.type === 'YELLOW_CARD').length;
        const redCards = player.gameEvents.filter(e => e.type === 'RED_CARD').length;
        const totalCards = yellowCards + redCards;

        const matchesPlayed = new Set(player.gameEvents.map(e => e.matchId)).size;

        return {
            shots,
            goals,
            shotEffectiveness: shots > 0 ? (goals / shots) * 100 : 0,
            matchesPlayed,
            fouls,
            cardsPerFoul: fouls > 0 ? totalCards / fouls : 0,
        };
    }, [player]);

    const effectivenessData = [
        { name: 'Efectividad', Goles: stats.goals, Tiros: stats.shots - stats.goals }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Efectividad de Tiro</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-3xl font-bold mb-2">
                        {stats.shotEffectiveness.toFixed(1)}%
                    </p>
                    <ResponsiveContainer width="100%" height={80}>
                        <BarChart layout="vertical" data={effectivenessData} stackOffset="expand">
                             <XAxis type="number" hide />
                             <YAxis type="category" dataKey="name" hide />
                             <Tooltip 
                                formatter={(value, name) => [`${value} ${name}`, '']}
                                contentStyle={{
                                    background: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: 'var(--radius)'
                                }}
                             />
                             <Bar dataKey="Goles" stackId="a" fill="hsl(var(--primary))" radius={[4, 0, 0, 4]} />
                             <Bar dataKey="Tiros" stackId="a" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>{stats.goals} Goles</span>
                        <span>{stats.shots} Tiros Totales</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                 <StatCard 
                    title="Partidos Jugados"
                    value={stats.matchesPlayed}
                    icon={<Footprints className="h-5 w-5 text-muted-foreground" />}
                 />
                 <StatCard 
                    title="Faltas Cometidas"
                    value={stats.fouls}
                    icon={<Shield className="h-5 w-5 text-muted-foreground" />}
                 />
                 <StatCard 
                    title="Prom. Tarjetas / Falta"
                    value={stats.cardsPerFoul.toFixed(2)}
                    description="Tarjetas por cada falta cometida."
                    icon={<Goal className="h-5 w-5 text-muted-foreground" />}
                 />
            </div>
        </div>
    );
}
