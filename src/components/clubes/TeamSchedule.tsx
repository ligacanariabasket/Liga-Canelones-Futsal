
import type { FullMatch } from '@/types';
import { CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';

interface TeamScheduleProps {
    matches: FullMatch[];
}

// Helper to group matches by date string
const groupMatchesByDate = (matches: FullMatch[]) => {
    return matches.reduce((acc, match) => {
        const date = new Date(match.scheduledTime);
        const dateString = date.toLocaleDateString('es-UY', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        if (!acc[dateString]) {
            acc[dateString] = [];
        }
        acc[dateString].push(match);
        return acc;
    }, {} as Record<string, FullMatch[]>);
};

export function TeamSchedule({ matches }: TeamScheduleProps) {
    if (!matches || !matches.length) {
        return (
            <CardContent className="p-6 text-center text-muted-foreground">
                No hay partidos programados.
            </CardContent>
        );
    }

    const groupedMatches = groupMatchesByDate(matches);
    
    return (
        <CardContent className="p-0">
            <div className="divide-y divide-border">
                {Object.entries(groupedMatches).map(([date, dateMatches]) => (
                    <Fragment key={date}>
                        <h3 className="bg-muted/50 px-4 py-2 text-sm font-semibold text-center uppercase tracking-wider text-muted-foreground">
                            {date}
                        </h3>
                        <div className="divide-y divide-border">
                            {dateMatches.map(match => (
                                <MatchItem key={match.id} match={match} />
                            ))}
                        </div>
                    </Fragment>
                ))}
            </div>
        </CardContent>
    );
}

function MatchItem({ match }: { match: FullMatch }) {
    const { teamA, teamB, scoreA, scoreB, status, scheduledTime } = match;
    const date = new Date(scheduledTime);

    const renderScoreOrTime = () => {
        switch(status) {
            case 'FINISHED':
                return (
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">FINAL</p>
                        <p className="text-3xl font-bold tabular-nums">{scoreA} - {scoreB}</p>
                        <Link href={`/resumen/${match.id}`} className="text-xs font-semibold text-primary hover:underline">
                            RESUMEN
                        </Link>
                    </div>
                );
            case 'LIVE':
                 return (
                    <div className="text-center">
                        <p className="text-xs font-semibold text-destructive animate-pulse">EN VIVO</p>
                        <p className="text-3xl font-bold tabular-nums">{scoreA} - {scoreB}</p>
                        <Link href={`/partidos/${match.id}`} className="text-xs font-semibold text-primary hover:underline">
                            SEGUIR
                        </Link>
                    </div>
                );
            case 'SCHEDULED':
            default:
                return (
                    <div className="text-center">
                        <p className="text-lg font-bold">{date.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-xs text-muted-foreground">hs.</p>
                        <Link href={`/partidos/${match.id}`} className="text-xs font-semibold text-primary hover:underline">
                            VER PREVIA
                        </Link>
                    </div>
                );
        }
    }

    return (
         <div className="p-4 hover:bg-muted/50">
            <div className="grid grid-cols-3 items-center gap-4">
                <TeamDisplay team={teamA} alignment="right" />
                {renderScoreOrTime()}
                <TeamDisplay team={teamB} alignment="left" />
            </div>
        </div>
    )
}

function TeamDisplay({ team, alignment = "right" }: { team: FullMatch['teamA'], alignment?: "left" | "right" }) {
    return (
        <div className={cn(
            "flex flex-col items-center gap-2 text-center",
            alignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
        )}>
            <Image
                src={team.logoUrl || '/logofu.svg'}
                alt={`Logo de ${team.name}`}
                width={56}
                height={56}
                className="w-14 h-14 aspect-square object-contain"
            />
            <span className={cn(
                "font-semibold text-sm md:text-base text-foreground",
                 alignment === 'right' ? 'md:text-right' : 'md:text-left'
            )}>
                {team.name}
            </span>
        </div>
    )
}
