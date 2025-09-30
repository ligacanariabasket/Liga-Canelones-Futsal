

'use client';

import * as React from 'react';
import type { GameEvent, Team } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ShotMapProps {
  events: GameEvent[];
  teamA: Team;
  teamB: Team;
  backgroundImageUrl?: string;
}

const formatTimeFromTimestamp = (absoluteTimestamp: number, eventType: GameEvent['type']) => {
    if (eventType === 'MATCH_END') return "Final";
    if (eventType === 'MATCH_START') return "Inicio";
    if (eventType === 'PERIOD_START') return "2T Inicio";

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
    
    const timeElapsedInPeriod = gameDurationPerPeriod - secondsLeftInPeriod;
    const minuteInPeriod = Math.floor(timeElapsedInPeriod / 60);

    return `${period}T ${minuteInPeriod}'`;
};

export function ShotMap({ events, teamA, teamB, backgroundImageUrl }: ShotMapProps) {
  const shotEvents = events.filter(
    (event) => (event.type === 'GOAL' || event.type === 'SHOT') && event.x != null && event.y != null
  );

  if (shotEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Tiros</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay datos de tiros para mostrar para la selección actual.</p>
        </CardContent>
      </Card>
    );
  }

  const getTeamColor = (teamId: number) => {
    if (teamId === teamA.id) return 'bg-blue-500';
    if (teamId === teamB.id) return 'bg-red-500';
    return 'bg-gray-500';
  };
  
  const getTeamLogo = (teamId: number) => {
    if (teamId === teamA.id) return teamA.logoUrl;
    if (teamId === teamB.id) return teamB.logoUrl;
    return '';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Tiros</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div 
            className={cn(
                "relative w-full aspect-[2/1] bg-contain bg-center bg-no-repeat rounded-md",
                !backgroundImageUrl && "bg-gray-800"
            )}
            style={{ backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none' }}
            >
            {shotEvents.map((event, index) => (
                <Tooltip key={`${event.id}-${index}`}>
                    <TooltipTrigger asChild>
                         <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.05 }}
                            className={cn(
                                `absolute w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white/50 shadow-lg cursor-pointer`,
                                getTeamColor(event.teamId!)
                            )}
                            style={{
                                left: `${event.x!}%`,
                                top: `${event.y!}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                            >
                            {event.type === 'GOAL' ? (
                                <Goal className="w-4 h-4" />
                            ) : (
                                <Footprints className="w-4 h-4" />
                            )}
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex items-center gap-2">
                             <Image 
                                src={getTeamLogo(event.teamId!) || ''} 
                                alt={event.teamName || 'team logo'} 
                                width={24} 
                                height={24}
                                className="w-6 h-6 rounded-full bg-muted p-0.5"
                            />
                            <div>
                                <p className="font-bold">{event.playerName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {event.type === 'GOAL' ? 'Gol' : 'Tiro'} • {formatTimeFromTimestamp(event.timestamp, event.type)}
                                </p>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            ))}
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
