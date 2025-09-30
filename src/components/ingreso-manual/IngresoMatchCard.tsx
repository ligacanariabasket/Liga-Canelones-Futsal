
'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function IngresoMatchCard({ match }: { match: FullMatch }) {
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
                <span className="text-2xl font-bold text-muted-foreground">VS</span>
                 <div className="flex flex-col items-center gap-2 text-center">
                    <Image src={match.teamB.logoUrl || ''} alt={match.teamB.name} width={64} height={64} className="rounded-full aspect-square object-contain"/>
                    <span className="font-semibold text-sm w-24 truncate">{match.teamB.name}</span>
                </div>
            </CardContent>
            <CardFooter className="p-2 bg-muted/50">
                <Button asChild className="w-full">
                    <Link href={`/ingreso-manual/${match.id}`}>
                        Ingresar Datos
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
