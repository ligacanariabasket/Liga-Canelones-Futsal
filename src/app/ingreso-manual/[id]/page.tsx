
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMatchById } from '@/actions/match-actions';
import type { FullMatch } from '@/types';
import { notFound, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreboardManual } from '@/components/ingreso-manual/ScoreboardManual';
import { ManualEntryForm } from '@/components/ingreso-manual/ManualEntryForm';
import { GameProvider } from '@/contexts/GameProvider';
import { ManualEntryActions } from '@/components/ingreso-manual/ManualEntryActions';
import { ManualControls } from '@/components/ingreso-manual/ManualControls';


function ManualEntrySkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-96" />
        </div>
    )
}

function PageContent({ match }: { match: FullMatch }) {
    return (
        <GameProvider match={match}>
             <div className="max-w-4xl mx-auto">
                <Button asChild variant="outline" className="mb-8">
                    <Link href="/ingreso-manual">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a la selección de partidos
                    </Link>
                </Button>
                
                <ScoreboardManual />

                <div className="mt-8">
                    <ManualEntryForm match={match} />
                </div>
                
                <div className="mt-8">
                    <ManualControls />
                </div>
                 <ManualEntryActions />
            </div>
        </GameProvider>
    )
}

export default function IngresoManualPartidoPage() {
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
                        <ManualEntrySkeleton />
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!match) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <PageContent match={match} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
