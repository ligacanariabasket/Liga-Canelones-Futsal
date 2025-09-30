
'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, Clock, Tv, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getChronicleByMatchId } from '@/actions/match-actions';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function MatchCard({ match }: { match: FullMatch }) {
    const [hasChronicle, setHasChronicle] = useState(false);
    const scheduledDateTime = new Date(match.scheduledTime);
    const formattedDate = scheduledDateTime.toLocaleDateString('es-UY', {
        day: 'numeric',
        month: 'long',
    });
    const formattedTime = scheduledDateTime.toLocaleTimeString('es-UY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    useEffect(() => {
        if (match.status === 'FINISHED') {
        getChronicleByMatchId(match.id).then(chronicle => {
            setHasChronicle(!!chronicle);
        });
        }
    }, [match.id, match.status]);


    const getStatusInfo = () => {
        switch (match.status) {
            case 'LIVE':
                return { text: 'En Vivo', variant: 'destructive' as const, pulse: true };
            case 'FINISHED':
                return { text: 'Finalizado', variant: 'default' as const, pulse: false };
            case 'SCHEDULED':
            default:
                return { text: 'Programado', variant: 'secondary' as const, pulse: false };
        }
    };
    const statusInfo = getStatusInfo();
    
    const isFinished = match.status === 'FINISHED';
    const isTeamAWinner = isFinished && match.scoreA > match.scoreB;
    const isTeamBWinner = isFinished && match.scoreB > match.scoreA;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
         <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-primary/20 bg-card">
            <CardHeader className="p-4 bg-card-foreground/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold truncate text-card-foreground">
                        {`Jornada ${match.round}`}
                    </CardTitle>
                     <Badge variant={statusInfo.variant} className={statusInfo.pulse ? 'animate-pulse' : ''}>
                        {statusInfo.text}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-4">
                <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center gap-2 text-center w-24">
                        <Image
                            src={match.teamA.logoUrl || ''}
                            alt={`Logo de ${match.teamA.name}`}
                            width={64}
                            height={64}
                            className="rounded-full aspect-square object-contain"
                        />
                        <span className="font-semibold text-sm truncate w-full">{match.teamA.name}</span>
                    </div>

                    {match.status !== 'SCHEDULED' ? (
                        <div className="flex items-center gap-2 text-4xl font-black">
                           <span className={cn(isTeamAWinner ? 'text-green-400' : !isTeamBWinner && 'text-foreground', !isTeamAWinner && isTeamBWinner && 'text-destructive/80')}>{match.scoreA}</span>
                           <span className="text-muted-foreground">-</span>
                           <span className={cn(isTeamBWinner ? 'text-green-400' : !isTeamAWinner && 'text-foreground', !isTeamBWinner && isTeamAWinner && 'text-destructive/80')}>{match.scoreB}</span>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-muted-foreground">VS</span>
                    )}

                    <div className="flex flex-col items-center gap-2 text-center w-24">
                        <Image
                            src={match.teamB.logoUrl || ''}
                            alt={`Logo de ${match.teamB.name}`}
                            width={64}
                            height={64}
                            className="rounded-full aspect-square object-contain"
                        />
                        <span className="font-semibold text-sm truncate w-full">{match.teamB.name}</span>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground flex flex-col space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formattedTime} hs.</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-2 grid grid-cols-2 gap-2 bg-muted/50">
             {(match.status === 'FINISHED' || match.status === 'LIVE') && (
                <Button asChild size="sm" variant="outline">
                    <Link href={`/partidos/${match.id}/estadisticas`}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Estadísticas
                    </Link>
                </Button>
            )}
             {match.status === 'LIVE' && (
                <Button asChild size="sm" variant="destructive" className="text-white col-span-1 sm:col-span-1">
                     <Link href={`/partidos/${match.id}`}>
                        <Tv className="mr-2 h-4 w-4" />
                        Ver en Vivo
                    </Link>
                </Button>
             )}
              {match.status === 'FINISHED' && hasChronicle && (
                  <Button asChild size="sm" variant="outline">
                        <Link href={`/gestion/cronicas/${match.id}/ver`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Crónica
                        </Link>
                    </Button>
              )}
            </CardFooter>
        </Card>
        </motion.div>
    );
}

export default MatchCard;
