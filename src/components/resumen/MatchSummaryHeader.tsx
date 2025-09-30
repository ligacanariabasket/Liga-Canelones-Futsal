
'use client';

import type { MatchStats } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MatchSummaryHeaderProps {
  match: MatchStats;
}

const formatTime = (seconds: number) => {
    const flooredSeconds = Math.floor(seconds);
    const minutes = Math.floor(flooredSeconds / 60);
    const remainingSeconds = flooredSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const getPeriodLabel = (period: number): string => {
    if (period === 2) return 'PERÍODO 2';
    return 'PERÍODO 1';
};

const TeamDisplay = ({ team }: { team: MatchStats['teamA'] }) => (
    <div className="flex flex-col items-center gap-2">
        <Link href={`/clubes/${team.slug}`} className="group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 <Image
                    src={team.logoUrl || ''}
                    alt={`Logo de ${team.name}`}
                    width={128}
                    height={128}
                    className="w-20 h-20 md:w-24 md:h-24 object-contain transition-transform group-hover:scale-110"
                />
            </motion.div>
        </Link>
        <h2 className="text-base md:text-xl font-bold uppercase text-center w-full">{team.name}</h2>
    </div>
);

const ScoreBox = ({ score, isWinner, isLoser, isDraw }: { score: number, isWinner: boolean, isLoser: boolean, isDraw: boolean }) => {
    const boxVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 20 }
        }
    };
    
    return (
        <motion.div 
            className={cn(
                "rounded-lg p-2 sm:p-4 aspect-square flex items-center justify-center transition-colors shadow-inner",
                isWinner && "bg-green-500/20",
                isLoser && "bg-destructive/10",
                isDraw && "bg-gray-500/20"
            )}
            variants={boxVariants}
            whileHover={{ scale: 1.05 }}
        >
             <motion.span 
                className={cn(
                    "text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white tabular-nums",
                     isWinner && "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]",
                     isLoser && "text-destructive/70",
                     isDraw && "text-gray-300"
                )}
                animate={isWinner ? { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } } : {}}
             >
                {score}
            </motion.span>
        </motion.div>
    );
};

export function MatchSummaryHeader({ match }: MatchSummaryHeaderProps) {
    const { teamA, teamB, scoreA, scoreB, status, period, time, scheduledTime } = match;

    const isFinished = status === 'FINISHED';
    const isTeamAWinner = isFinished && (scoreA ?? 0) > (scoreB ?? 0);
    const isTeamBWinner = isFinished && (scoreB ?? 0) > (scoreA ?? 0);
    const isDraw = isFinished && scoreA === scoreB;

    const renderMatchStatus = () => {
        switch (status) {
            case 'LIVE':
                return (
                    <div className="flex flex-col items-center">
                        <Badge variant="destructive" className="animate-pulse text-sm mb-2">
                            EN VIVO
                        </Badge>
                        <div className="font-mono text-xl md:text-2xl font-bold text-white">
                            {formatTime(time ?? 0)} - {getPeriodLabel(period ?? 1)}
                        </div>
                    </div>
                );
            case 'FINISHED':
                 return <div className="text-sm md:text-lg font-semibold text-white/80 tracking-widest">FINAL</div>;
            case 'SCHEDULED':
                 return (
                    <div className="text-sm md:text-base font-semibold text-white/80 tracking-wider text-center">
                        <p>{new Date(scheduledTime).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })}</p>
                        <p>{new Date(scheduledTime).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}hs</p>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <motion.div 
            className="relative text-white bg-black/30 rounded-lg backdrop-blur-sm p-4 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
        >
             <div className="absolute inset-0 flex">
                <div className="w-1/2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
                <div className="w-1/2 bg-gradient-to-l from-accent/20 via-accent/10 to-transparent"></div>
            </div>
            {/* Mobile Layout */}
            <div className="relative md:hidden flex flex-col items-center gap-4">
                 <div className="h-10 flex items-center justify-center">{renderMatchStatus()}</div>
                 <div className="w-full flex items-center justify-around">
                     <TeamDisplay team={teamA} />
                      <motion.div className="grid grid-cols-2 gap-2" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 }}}}>
                           <ScoreBox score={scoreA ?? 0} isWinner={isTeamAWinner} isLoser={isTeamBWinner} isDraw={isDraw} />
                           <ScoreBox score={scoreB ?? 0} isWinner={isTeamBWinner} isLoser={isTeamAWinner} isDraw={isDraw} />
                       </motion.div>
                     <TeamDisplay team={teamB} />
                 </div>
            </div>
            {/* Desktop Layout */}
            <div className="relative hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                <TeamDisplay team={teamA} />

                <div className="flex flex-col items-center justify-center px-1">
                    <div className="h-12 flex items-center justify-center">
                        {renderMatchStatus()}
                    </div>
                    <motion.div className="grid grid-cols-2 gap-1 md:gap-2 w-full max-w-[200px]" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 }}}}>
                       <ScoreBox score={scoreA ?? 0} isWinner={isTeamAWinner} isLoser={isTeamBWinner} isDraw={isDraw} />
                       <ScoreBox score={scoreB ?? 0} isWinner={isTeamBWinner} isLoser={isTeamAWinner} isDraw={isDraw} />
                    </motion.div>
                </div>

                <TeamDisplay team={teamB} />
            </div>
        </motion.div>
    );
}
