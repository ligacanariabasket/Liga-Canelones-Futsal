
'use client';

import { GameEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface GraphicalSummaryProps {
    match: {
        scoreA: number;
        scoreB: number;
        events: GameEvent[];
        teamA: { id: number; name: string; };
        teamB: { id: number; name: string; };
    };
}

const SimpleBarChart = ({ data, teamAColor, teamBColor }: { data: { name: string; teamA: number; teamB: number; teamAName: string; teamBName: string }[], teamAColor: string, teamBColor: string }) => (
    <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                    background: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                }}
            />
            <Bar dataKey="teamA" name={data[0]?.teamAName} stackId="a" fill={teamAColor} radius={[4, 0, 0, 4]} />
            <Bar dataKey="teamB" name={data[0]?.teamBName} stackId="a" fill={teamBColor} radius={[0, 4, 4, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

export function GraphicalSummary({ match }: GraphicalSummaryProps) {
    const { teamA, teamB, events, scoreA, scoreB } = match;

    const getStatCount = (teamId: number, eventType: string) => {
        return events.filter(e => e.teamId === teamId && e.type === eventType).length;
    };

    const chartData = [
        { 
            name: 'Goles', 
            teamA: scoreA, 
            teamB: scoreB,
            teamAName: teamA.name,
            teamBName: teamB.name
        },
        { 
            name: 'Tiros', 
            teamA: getStatCount(teamA.id, 'SHOT'), 
            teamB: getStatCount(teamB.id, 'SHOT'),
            teamAName: teamA.name,
            teamBName: teamB.name
        },
        { 
            name: 'Faltas', 
            teamA: getStatCount(teamA.id, 'FOUL'), 
            teamB: getStatCount(teamB.id, 'FOUL'),
            teamAName: teamA.name,
            teamBName: teamB.name
        },
    ];

    const teamAColor = "hsl(var(--primary))";
    const teamBColor = "hsl(var(--accent))";

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border text-foreground mt-8">
            <CardHeader>
                <CardTitle>Resumen Gráfico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {chartData.map(data => (
                    <div key={data.name}>
                        <h3 className="text-center font-semibold text-muted-foreground mb-2">{data.name}</h3>
                        <SimpleBarChart data={[data]} teamAColor={teamAColor} teamBColor={teamBColor} />
                         <div className="flex justify-between items-center text-foreground font-bold text-lg px-1 sm:px-2 -mt-4">
                            <span className="tabular-nums">{data.teamA}</span>
                            <span className="tabular-nums">{data.teamB}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
