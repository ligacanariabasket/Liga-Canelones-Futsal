
'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const TeamRow = ({ team, score }: { team: FullMatch['teamA'], score: number }) => (
    <div className="flex items-center justify-between w-full py-2">
        <div className="flex items-center gap-4">
            <Image
                src={team.logoUrl || ''}
                alt={`Logo de ${team.name}`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full aspect-square object-contain"
            />
            <span className="font-bold text-lg md:text-xl text-foreground uppercase">{team.name}</span>
        </div>
        <div className="bg-muted px-4 py-1 rounded-md">
            <span className="font-bold text-xl md:text-2xl text-foreground tabular-nums">{score}</span>
        </div>
    </div>
);


interface LiveMatchCardProps {
  match: FullMatch;
}

export function LiveMatchCard({ match }: LiveMatchCardProps) {
  
  const getPeriodLabel = () => {
    if (match.period === 2) return '2T';
    return '1T';
  }

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="h-full">
      <Link href={`/partidos/${match.id}`} className="block group h-full">
        <Card className="overflow-hidden shadow-lg h-full flex flex-col bg-card border-border hover:border-primary/50">
            <CardContent className="p-4 flex-grow flex flex-col justify-center">
               <TeamRow team={match.teamA} score={match.scoreA} />
               <div className="border-b my-1 border-border/50"></div>
               <TeamRow team={match.teamB} score={match.scoreB} />
            </CardContent>
            <CardFooter className="p-0">
                <div className="w-full bg-slate-800 text-white flex justify-between items-center px-4 py-2">
                    <span className="font-semibold text-sm">{formatDate(match.scheduledTime)}</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{getPeriodLabel()}</span>
                        <span className="font-orbitron text-lg font-bold text-primary animate-pulse">{formatTime(match.time)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
