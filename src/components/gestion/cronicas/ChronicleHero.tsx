'use client';

import type { FullMatch } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChronicleHeroProps {
    match: FullMatch;
    title: string;
}

const TeamDisplay = ({ team }: { team: FullMatch['teamA'] }) => (
    <div className="flex flex-col items-center gap-4">
         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
             <Image
                src={team.logoUrl || ''}
                alt={`Logo de ${team.name}`}
                width={128}
                height={128}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
         </motion.div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-center w-full truncate">{team.name}</h2>
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
                    "text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white tabular-nums",
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

export function ChronicleHero({ match, title }: ChronicleHeroProps) {
  const router = useRouter();
  const { teamA, teamB, scoreA, scoreB, status } = match;

  const isFinished = status === 'FINISHED';
  const isTeamAWinner = isFinished && scoreA > scoreB;
  const isTeamBWinner = isFinished && scoreB > scoreA;
  const isDraw = isFinished && scoreA === scoreB;

  const renderStatus = () => {
    switch(status) {
        case 'LIVE':
            return <div className="text-center"><div className="text-sm md:text-lg font-semibold tracking-widest text-destructive animate-pulse">EN VIVO</div></div>;
        case 'FINISHED':
             return <div className="text-sm md:text-lg font-semibold tracking-widest text-muted-foreground">FINAL</div>;
        default:
             return <div className="text-sm md:text-lg font-semibold tracking-widest text-muted-foreground">PROGRAMADO</div>;
    }
  }

  return (
    <section className="relative bg-secondary/20 py-12 md:py-16 text-foreground overflow-hidden">
         <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-secondary/20"></div>

        <div className="absolute inset-x-0 top-0 z-20 h-16 flex items-center">
            <div className="container mx-auto">
                 <Button onClick={() => router.back()} variant="outline" className="bg-background/20 backdrop-blur-sm hover:bg-background/50 text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Crónicas
                </Button>
            </div>
        </div>

        <motion.div 
            className="relative container mx-auto px-4 text-center pt-8"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
        >
            <div className="grid grid-cols-3 items-center gap-2 md:gap-4">
                <TeamDisplay team={teamA} />

                <div className="flex flex-col items-center justify-center gap-2 md:gap-4 text-center">
                    {renderStatus()}
                     <motion.div className="grid grid-cols-2 gap-1 md:gap-2 w-full max-w-[200px]" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 }}}}>
                       <ScoreBox score={scoreA} isWinner={isTeamAWinner} isLoser={isTeamBWinner} isDraw={isDraw} />
                       <ScoreBox score={scoreB} isWinner={isTeamBWinner} isLoser={isTeamAWinner} isDraw={isDraw} />
                    </motion.div>
                </div>

                <TeamDisplay team={teamB} />
            </div>
            
            <h1 className="mt-8 text-2xl md:text-4xl font-bold font-orbitron">{title}</h1>
        </motion.div>
    </section>
  );
}
