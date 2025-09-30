
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getMatchById } from '@/actions/match-actions';
import type { FullMatch, GameState, Player } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GameProvider, useGame } from '@/contexts/GameProvider';
import { Header } from '@/components/layout/header';
import { ScoreboardManual } from '@/components/ingreso-manual/ScoreboardManual';
import { SimpleEntryUI } from '@/components/ingreso-simple/SimpleEntryUI';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PlayerActionPanel } from '@/components/ingreso-simple/PlayerActionPanel';
import { StarterSelectionUI } from '@/components/ingreso-simple/StarterSelectionUI';
import { SimpleMatchControls } from '@/components/ingreso-simple/SimpleMatchControls';
import { EventLog } from '@/components/ingreso-simple/EventLog';


function SimpleEntrySkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-48" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
            </div>
        </div>
    )
}

function PageContent({ liveState }: { liveState: GameState }) {
    const [selectedPlayer, setSelectedPlayer] = useState<(Player & { teamSide: 'A' | 'B' }) | null>(null);

    const isStarterSelection = liveState.status === 'SCHEDULED' || liveState.status === 'SELECTING_STARTERS';

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <Button asChild variant="outline" className="mb-8">
                <Link href="/ingreso-simple">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a la selección
                </Link>
            </Button>
            
            <ScoreboardManual />

            <div className="mt-8">
                {isStarterSelection ? (
                    <StarterSelectionUI />
                ) : (
                    <>
                        <SimpleMatchControls />
                        <SimpleEntryUI selectedPlayer={selectedPlayer} onPlayerSelect={setSelectedPlayer} />
                        <EventLog />
                    </>
                )}
            </div>
            {!isStarterSelection && (
                 <PlayerActionPanel 
                    selectedPlayer={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                />
            )}
        </div>
    )
}

function GamePageWrapper() {
    const { state } = useGame();
    if (!state.matchId) {
        return <SimpleEntrySkeleton />;
    }
    return <PageContent liveState={state} />
}

export default function IngresoSimplePartidoPage() {
    const params = useParams();
    const matchId = parseInt(params.id as string, 10);
    const [match, setMatch] = useState<FullMatch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isNaN(matchId)) {
            setLoading(false);
            return;
        }

        getMatchById(matchId).then(data => {
            if (data) {
                setMatch(data);
            }
            setLoading(false);
        });

    }, [matchId]);

    if (loading) {
        return (
             <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-1 pt-[var(--header-height)]">
                    <div className="container mx-auto p-4 py-8 md:p-8">
                        <SimpleEntrySkeleton />
                    </div>
                </main>
            </div>
        )
    }

    if (!match) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background pb-32">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <GameProvider match={match}>
                        <GamePageWrapper />
                    </GameProvider>
                </div>
            </main>
        </div>
    );
}
