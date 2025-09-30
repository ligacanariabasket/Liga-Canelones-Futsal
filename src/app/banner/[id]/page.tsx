
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getMatchById } from '@/actions/match-actions';
import { ScoreboardHeader } from '@/components/banner/ScoreboardHeader';
import type { FullMatch, MatchStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLiveMatchState } from '@/hooks/useLiveMatchState';

function getPeriodLabel(status: MatchStatus, period: number): string {
    switch (status) {
        case 'FINISHED':
            return 'FINAL';
        case 'SCHEDULED':
            return 'PROGRAMADO';
        case 'LIVE':
            if (period === 2) return 'PERÍODO 2';
            return 'PERÍODO 1';
        default:
            return 'PERÍODO 1';
    }
}

function BannerPageSkeleton() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
            <Skeleton className="h-[200px] w-full max-w-6xl" />
        </div>
    )
}

export default function BannerPage() {
    const params = useParams();
    const matchId = parseInt(params.id as string, 10);
    
    const [initialMatch, setInitialMatch] = useState<FullMatch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (matchId && !isNaN(matchId)) {
            getMatchById(matchId).then(data => {
                if (data) {
                    setInitialMatch(data);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [matchId]);

    const liveState = useLiveMatchState(matchId, initialMatch);

    if (loading) {
        return <BannerPageSkeleton />;
    }

    if (!liveState) {
        notFound();
    }
    
    const {teamA, teamB, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB, period, time, status} = liveState;

    if(!teamA || !teamB) {
        return <BannerPageSkeleton />;
    }

    return (
        // Contenedor principal para centrar el Scoreboard en toda la pantalla
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-8">
            <ScoreboardHeader
                team1Name={teamA.name}
                team1Logo={teamA.logoUrl || ''}
                score1={scoreA}
                fouls1={foulsA} 
                timeouts1={timeoutsA}
                team2Name={teamB.name}
                team2Logo={teamB.logoUrl || ''}
                score2={scoreB}
                fouls2={foulsB}
                timeouts2={timeoutsB}
                timeLeft={time}
                period={getPeriodLabel(status, period)}
            />
        </div>
    );
}
