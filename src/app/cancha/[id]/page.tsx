

'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getMatchById } from '@/actions/match-actions';
import type { FullMatch } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GameProvider } from '@/contexts/GameProvider';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TacticalHeader } from '@/components/cancha/TacticalHeader';
import { TacticalActions } from '@/components/cancha/TacticalActions';
import { PlayerColumn } from '@/components/cancha/PlayerColumn';


function TacticalBoardSkeleton() {
    return (
        <div className="flex flex-col h-screen w-screen bg-gray-800 text-white">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-12" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                </div>
            </div>

            {/* Board Skeleton */}
            <div className="flex-grow flex items-center justify-center p-4 relative">
                <Skeleton className="w-full h-full max-w-4xl max-h-[70vh]"/>
            </div>
        </div>
    );
}


export default function TacticalBoardPage() {
    const params = useParams();
    const matchId = params.id as string;
    
    const [match, setMatch] = useState<FullMatch | null>(null);
    const [loading, setLoading] = useState(true);
    const [visiblePanel, setVisiblePanel] = useState<'A' | 'B' | null>(null);

    const handleTogglePanel = (panel: 'A' | 'B') => {
        setVisiblePanel(current => (current === panel ? null : panel));
    };

    useEffect(() => {
        if (matchId) {
            const numericId = parseInt(matchId, 10);
            if (isNaN(numericId)) {
                setLoading(false);
                return;
            }
            getMatchById(numericId).then(data => {
                if (data) {
                    setMatch(data as FullMatch);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [matchId]);
    
    if (loading) {
        return <TacticalBoardSkeleton />;
    }

    if (!match) {
        return notFound();
    }
    
    return (
        <GameProvider match={match}>
            <DndProvider backend={HTML5Backend}>
                <div className="relative h-dvh w-screen bg-gray-900 text-white flex flex-col overflow-hidden">
                    <header className="flex-shrink-0 z-20">
                        <TacticalHeader match={match} />
                    </header>
                    
                    <main className="flex-1 container mx-auto p-4 md:p-8 grid grid-cols-2 gap-4 md:gap-8">
                        <PlayerColumn teamId="A" />
                        <PlayerColumn teamId="B" />
                    </main>

                     <footer className="flex-shrink-0 z-20">
                        <TacticalActions onTogglePanel={handleTogglePanel} visiblePanel={visiblePanel} />
                    </footer>

                </div>
            </DndProvider>
        </GameProvider>
    );
}
