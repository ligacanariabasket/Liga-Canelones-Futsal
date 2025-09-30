
'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit } from 'lucide-react';
import { getChronicleByMatchId } from '@/actions/match-actions';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function MatchCard({ match }: { match: FullMatch }) {
    const [hasChronicle, setHasChronicle] = useState<boolean | null>(null);

    useEffect(() => {
        getChronicleByMatchId(match.id).then(chronicle => {
            setHasChronicle(!!chronicle);
        });
    }, [match.id]);

    if (hasChronicle === null) {
        return <Skeleton className="h-48 w-full" />
    }

    return (
        <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-primary/20">
            <CardHeader>
                <CardTitle className="truncate text-lg">{match.teamA.name} vs {match.teamB.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-around">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Image src={match.teamA.logoUrl || ''} alt={match.teamA.name} width={64} height={64} className="rounded-full aspect-square object-contain"/>
                    <span className="font-semibold text-sm w-24 truncate">{match.teamA.name}</span>
                </div>
                <span className="text-2xl font-bold text-primary">{match.scoreA} - {match.scoreB}</span>
                 <div className="flex flex-col items-center gap-2 text-center">
                    <Image src={match.teamB.logoUrl || ''} alt={match.teamB.name} width={64} height={64} className="rounded-full aspect-square object-contain"/>
                    <span className="font-semibold text-sm w-24 truncate">{match.teamB.name}</span>
                </div>
            </CardContent>
            <CardFooter className="p-2 bg-muted/50 grid grid-cols-2 gap-2">
                 <Button asChild className="w-full" variant="outline">
                    <Link href={`/gestion/cronicas/${match.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        {hasChronicle ? 'Ver' : 'Generar'} Crónica
                    </Link>
                </Button>
                 {hasChronicle && (
                     <Button asChild className="w-full">
                        <Link href={`/gestion/cronicas/${match.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Crónica
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

    
