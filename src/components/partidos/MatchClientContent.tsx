
'use client';

import { ScoreboardHeader } from '@/components/banner/ScoreboardHeader';
import type { FullMatch, MatchStatus } from '@/types';
import { useLiveMatchState } from '@/hooks/useLiveMatchState';
import { PlayByPlayFeed } from '@/components/partidos/PlayByPlayFeed';
import { Skeleton } from '../ui/skeleton';
import { MatchPoll } from './MatchPoll';
import { PollWithOptions } from '@/types/poll-types';

function getPeriodLabel(status: MatchStatus, period: number | undefined): string {
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

function MatchPageSkeleton() {
    return (
        <div className="w-full max-w-6xl">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full mt-8" />
        </div>
    )
}

export function MatchClientContent({ initialMatch, poll }: { initialMatch: FullMatch, poll: PollWithOptions | null }) {
    const liveState = useLiveMatchState(initialMatch.id, initialMatch);

    if (!liveState) {
        return <MatchPageSkeleton />;
    }
    
    const {teamA, teamB, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB, period, time, status, events} = liveState;

    if(!teamA || !teamB) {
        return <MatchPageSkeleton />;
    }


    return (
        <>
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

            <div className="mt-8 w-full max-w-4xl">
                <PlayByPlayFeed 
                    events={events} 
                    teamA={teamA} 
                    teamB={teamB} 
                    period={period}
                    status={status}
                />
            </div>

            <MatchPoll poll={poll} />
        </>
    );
}
