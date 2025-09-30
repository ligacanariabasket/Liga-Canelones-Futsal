

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Hand, RefreshCw, Shield, Square, Timer, Target, ArrowLeft, ArrowRight, PlayCircle, Flag, CheckCircle } from 'lucide-react';
import type { GameEvent, GameEventType, Team } from '@/types';
import { cn } from '@/lib/utils';
import { animationVariants } from '@/lib/animations';
import Image from 'next/image';
import { FutsalBallIcon } from '@/components/icons';
import Link from 'next/link';

interface EventsListProps {
  events: GameEvent[];
  teamA: Team;
  teamB: Team;
}

const eventDisplayConfig: Record<GameEventType | 'MATCH_START' | 'PERIOD_START' | 'MATCH_END', { icon: React.ReactNode; label: string; className: string; iconBg: string }> = {
    GOAL: { icon: <FutsalBallIcon className="w-5 h-5" />, label: "Gol", className: "text-green-400 font-bold", iconBg: "bg-green-500/20" },
    ASSIST: { icon: <Hand className="w-5 h-5" />, label: "Asistencia", className: "text-blue-400", iconBg: "bg-blue-500/20" },
    FOUL: { icon: <Shield className="w-5 h-5" />, label: "Falta", className: "text-orange-400", iconBg: "bg-orange-500/20" },
    SHOT: { icon: <Target className="w-5 h-5" />, label: "Tiro", className: "text-gray-400", iconBg: "bg-gray-500/20" },
    YELLOW_CARD: { icon: <Square className="w-5 h-5 text-yellow-400 fill-current" />, label: "Amarilla", className: "text-yellow-400", iconBg: "bg-yellow-500/20" },
    RED_CARD: { icon: <Square className="w-5 h-5 text-red-500 fill-current" />, label: "Roja", className: "text-red-500 font-bold", iconBg: "bg-red-500/20" },
    TIMEOUT: { icon: <Timer className="w-5 h-5" />, label: "T. Muerto", className: "text-teal-400", iconBg: "bg-teal-500/20" },
    SUBSTITUTION: { icon: <RefreshCw className="w-5 h-5" />, label: "Cambio", className: "text-cyan-400", iconBg: "bg-cyan-500/20" },
    MATCH_START: { icon: <PlayCircle className="w-5 h-5" />, label: "Inicio del Partido", className: "text-white font-bold", iconBg: "bg-gray-500/20" },
    PERIOD_START: { icon: <Flag className="w-5 h-5" />, label: "Inicio 2º Tiempo", className: "text-white font-bold", iconBg: "bg-gray-500/20" },
    MATCH_END: { icon: <CheckCircle className="w-5 h-5" />, label: "Final del Partido", className: "text-white font-bold", iconBg: "bg-gray-500/20" },
};


const formatTimeFromTotalSeconds = (absoluteTimestamp: number, eventType: GameEvent['type']) => {
    if (eventType === 'MATCH_END') return { period: '', minute: "Final" };
    if (eventType === 'MATCH_START') return { period: '', minute: "Inicio" };
    if (eventType === 'PERIOD_START') return { period: '', minute: "2T" };

    const gameDurationPerPeriod = 1200; // 20 mins
    let secondsLeftInPeriod;
    let period;

    if (absoluteTimestamp > gameDurationPerPeriod) {
        period = 1;
        secondsLeftInPeriod = absoluteTimestamp - gameDurationPerPeriod;
    } else {
        period = 2;
        secondsLeftInPeriod = absoluteTimestamp;
    }
    
    // Calculate minute based on time elapsed in the period
    const timeElapsedInPeriod = gameDurationPerPeriod - secondsLeftInPeriod;
    const minuteInPeriod = Math.floor(timeElapsedInPeriod / 60);

    return { period: `${period}T`, minute: `${minuteInPeriod}'` };
}

const PlayerLink = ({ id, name }: { id: number | null, name: string }) => {
    if (!id) return <span className="font-semibold text-sm text-white truncate">{name}</span>;
    return (
        <Link href={`/jugadores/${id}`} className="font-semibold text-sm text-white truncate hover:underline hover:text-primary transition-colors">
            {name}
        </Link>
    );
};

const EventCard = ({ event, team, isTeamA }: { event: GameEvent, team: Team | null, isTeamA: boolean }) => {
    const config = eventDisplayConfig[event.type as keyof typeof eventDisplayConfig];
    if (!config || !team) return null;

    const renderEventContent = () => {
        if (event.type === 'SUBSTITUTION' && event.playerInName && event.playerInId) {
            return (
                <>
                    <p className="font-semibold text-sm text-white truncate">{config.label}</p>
                    <div className="flex flex-col gap-1 w-full text-xs mt-1">
                        <div className="flex items-center gap-2 text-green-400">
                            <ArrowLeft className="w-3 h-3 shrink-0" />
                            <Link href={`/jugadores/${event.playerInId}`} className="truncate flex-1 hover:underline">{event.playerInName} (Entra)</Link>
                        </div>
                        <div className="flex items-center gap-2 text-red-400">
                            <ArrowRight className="w-3 h-3 shrink-0" />
                            <Link href={`/jugadores/${event.playerId}`} className="truncate flex-1 hover:underline">{event.playerName} (Sale)</Link>
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <PlayerLink id={event.playerId} name={event.playerName || team?.name || ''} />
                <p className={cn("text-xs", config.className)}>{config.label}</p>
            </>
        );
    };

    return (
        <Card className={cn(
            "w-full bg-black/40 backdrop-blur-sm border p-0 shadow-md transition-colors",
            isTeamA ? 'border-primary/50 hover:border-primary' : 'border-accent/50 hover:border-accent'
        )}>
            <CardContent className="flex items-center gap-3 p-3">
                 <Link href={`/clubes/${team.slug}`} className={cn(
                    "flex-shrink-0 flex flex-col items-center group",
                    isTeamA ? 'order-1' : 'order-3'
                 )}>
                    {team.logoUrl && (
                        <Image
                            src={team.logoUrl}
                            alt={`${team.name} logo`}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain bg-white/10 rounded-full p-1 transition-transform group-hover:scale-110"
                        />
                    )}
                 </Link>
                <div className={cn("flex-1 min-w-0", isTeamA ? 'order-2 text-left' : 'order-2 text-right')}>
                    {renderEventContent()}
                </div>
            </CardContent>
        </Card>
    );
};

const StructuralEventCard = ({ event }: { event: GameEvent }) => {
    const config = eventDisplayConfig[event.type as keyof typeof eventDisplayConfig];
    if (!config) return null;

    return (
        <div className="text-center w-full">
            <h4 className={cn("font-bold text-sm", config.className)}>{config.label}</h4>
        </div>
    );
};

export function EventsList({ events, teamA, teamB }: EventsListProps) {
  if (events.length === 0) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardContent className="py-8 text-center text-white/70">
          No se registraron eventos para este partido.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full">
      {/* Central timeline bar */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white/10" aria-hidden="true"></div>

      <div className="relative flex flex-col items-center gap-y-6">
        {events.map((event, index) => {
          const config = eventDisplayConfig[event.type as keyof typeof eventDisplayConfig];
          if (!config) return null;

          const isStructural = ['MATCH_START', 'PERIOD_START', 'MATCH_END'].includes(event.type);
          const team = event.teamId === teamA.id ? teamA : event.teamId === teamB.id ? teamB : null;
          const isTeamA = event.teamId === teamA.id;
          const time = formatTimeFromTotalSeconds(event.timestamp, event.type);

          return (
            <motion.div 
              key={event.id || index} 
              className="relative z-10 w-full grid grid-cols-[1fr_auto_1fr] items-start gap-x-2 sm:gap-x-4"
              variants={animationVariants.slideInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
             >
                <div className={cn("pt-1 w-full", isTeamA && !isStructural ? 'col-start-1 text-right' : 'col-start-1 hidden')}>
                     {isTeamA && !isStructural && <EventCard event={event} team={team} isTeamA={isTeamA} />}
                </div>
                
                <div className="col-start-2 flex flex-col items-center">
                    <div className="relative grid h-10 w-10 place-items-center">
                        <div className={cn(
                            "relative z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white",
                            config.iconBg
                        )}>
                        {config.icon}
                        </div>
                    </div>
                     <div className="mt-1.5 font-mono text-xs text-white/80">
                       <span>{time.minute}</span>
                   </div>
                </div>

                 <div className={cn("pt-1 w-full", !isTeamA && !isStructural ? 'col-start-3 text-left' : 'col-start-3 hidden')}>
                     {!isTeamA && !isStructural && <EventCard event={event} team={team} isTeamA={isTeamA} />}
                </div>

                {isStructural && (
                    <div className="col-start-1 col-span-3 -mt-10 pt-1 w-full flex justify-center">
                         <StructuralEventCard event={event} />
                    </div>
                )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
