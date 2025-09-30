
'use client';

import { SeasonTeamWithTeam } from '@/types';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import Link from 'next/link';

interface StandingsTableProps {
  standings: SeasonTeamWithTeam[];
}

const STAT_COLUMNS = ['PJ', 'G', 'E', 'P', 'GF', 'GC', 'DG'];

const renderTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
        case 'up':
            return <ArrowUp className="h-4 w-4 text-green-500" />;
        case 'down':
            return <ArrowDown className="h-4 w-4 text-red-500" />;
        default:
            return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
}

const MatchResultIndicator = ({ result }: { result: 'W' | 'D' | 'L' | 'N' }) => {
    const baseClasses = "h-2.5 w-2.5 rounded-full";
    const variantClasses = {
        W: "bg-green-500",
        D: "bg-gray-400",
        L: "bg-red-500",
        N: "bg-gray-200 dark:bg-gray-700",
    };
    return <div className={cn(baseClasses, variantClasses[result])}></div>
}

const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-2">
        <div className={cn("h-2.5 w-2.5 rounded-full", color)}></div>
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
)

export function StandingsTable({ standings }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
        <Card>
            <div className="p-8 text-center text-muted-foreground">
                No hay datos de clasificación disponibles para esta temporada.
            </div>
        </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader>
          <CardTitle>Tabla de Posiciones</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
            <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                <TableHead className="w-12 text-center font-bold">#</TableHead>
                <TableHead className="font-bold min-w-[200px]">Equipo</TableHead>
                <TableHead className="w-16 text-center font-bold text-primary">Pts</TableHead>
                {STAT_COLUMNS.map(col => (
                    <TableHead key={col} className="w-12 text-center font-bold text-muted-foreground hidden lg:table-cell">{col}</TableHead>
                ))}
                <TableHead className="w-28 text-center font-bold text-muted-foreground hidden lg:table-cell">Resultados</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {standings.map((entry, index) => {
                const teamSlug = entry.team.slug || entry.team.name.toLowerCase().replace(/\s+/g, '-');
                // Mock trend data - only show if matches have been played
                const trend: 'up' | 'down' | 'same' = index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'same';
                const hasPlayed = entry.played > 0;

                return (
                <TableRow key={entry.teamId} className="hover:bg-muted/30">
                    <TableCell className="font-bold text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                            {hasPlayed ? renderTrendIcon(trend) : <Minus className="h-4 w-4 text-muted-foreground" />}
                            <span>{entry.position}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                    <Link href={`/clubes/${teamSlug}`} className="flex items-center gap-3 group">
                        <Image
                        src={entry.team.logoUrl || '/logofu.svg'}
                        alt={`Logo de ${entry.team.name}`}
                        width={28}
                        height={28}
                        className="aspect-square object-contain transition-transform group-hover:scale-110"
                        />
                        <span className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{entry.team.name}</span>
                    </Link>
                    </TableCell>
                    <TableCell className="text-center font-bold text-lg text-primary tabular-nums">{entry.points}</TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums hidden lg:table-cell">{entry.played}</TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums hidden lg:table-cell">{entry.wins}</TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums hidden lg:table-cell">{entry.draws}</TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums hidden lg:table-cell">{entry.losses}</TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums hidden lg:table-cell">{entry.goalsFor}</TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums hidden lg:table-cell">{entry.goalsAgainst}</TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums hidden lg:table-cell">{entry.goalDifference}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-1">
                            {(entry.recentResults || []).slice(0, 5).map((result: 'W' | 'D' | 'L', i: number) => (
                                <MatchResultIndicator key={i} result={result} />
                            ))}
                        </div>
                    </TableCell>
                </TableRow>
                )})}
            </TableBody>
            </Table>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex flex-wrap gap-x-4 gap-y-2">
          <LegendItem color="bg-green-500" label="Victoria" />
          <LegendItem color="bg-gray-400" label="Empate" />
          <LegendItem color="bg-red-500" label="Derrota" />
      </CardFooter>
    </Card>
  );
}
