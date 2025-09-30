

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { MatchStats } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ScoreSummaryProps {
  match: MatchStats;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const getPeriodLabel = (period: number): string => {
    if (period === 2) return 'PERÍODO 2';
    return 'PERÍODO 1';
};

const TeamDisplay = ({ team }: { team: MatchStats['teamA'] }) => (
    <div className="flex flex-col items-center gap-4">
        <Link href={`/clubes/${team.slug}`} className="group">
            <Image
                src={team.logoUrl || ''}
                alt={`Logo de ${team.name}`}
                width={128}
                height={128}
                className="w-24 h-24 md:w-32 md:h-32 object-contain transition-transform group-hover:scale-105"
            />
        </Link>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-center w-full truncate">{team.name}</h2>
    </div>
);

const ScoreBox = ({ score }: { score: number }) => (
    <div className="bg-muted/80 rounded-lg p-2 sm:p-4 aspect-square flex items-center justify-center">
        <span className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white tabular-nums">{score}</span>
    </div>
);

export function ScoreSummary({ match }: ScoreSummaryProps) {
  const { teamA, teamB, scoreA, scoreB, status, period, time } = match;

  const renderStatus = () => {
    switch(status) {
        case 'LIVE':
            return (
                <div className="text-center">
                    <Badge variant="destructive" className="animate-pulse text-sm mb-2">
                        EN VIVO
                    </Badge>
                    <p className="text-xs md:text-sm font-semibold tracking-widest">{formatTime(time ?? 0)} - {getPeriodLabel(period ?? 1)}</p>
                </div>
            );
        case 'FINISHED':
             return <p className="text-sm md:text-lg font-semibold tracking-widest">FINAL</p>;
        default:
             return <p className="text-sm md:text-lg font-semibold tracking-widest">PROGRAMADO</p>;
    }
  }

  return (
    <Card className="w-full shadow-lg bg-black/20 backdrop-blur-sm border-white/10 text-white overflow-hidden">
      <CardContent className="p-4 md:p-8">
        <div className="grid grid-cols-3 items-center gap-2 md:gap-4">
            {/* Team A */}
            <TeamDisplay team={teamA} />

            {/* Score & Status */}
            <div className="flex flex-col items-center justify-center gap-2 md:gap-4 text-center">
                {renderStatus()}
                <div className="grid grid-cols-2 gap-1 md:gap-2 w-full max-w-[200px]">
                    <ScoreBox score={scoreA ?? 0} />
                    <ScoreBox score={scoreB ?? 0} />
                </div>
            </div>

            {/* Team B */}
            <TeamDisplay team={teamB} />
        </div>
      </CardContent>
    </Card>
  );
}
