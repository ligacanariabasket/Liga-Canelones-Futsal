

'use client';

import type { FullMatch, Team } from '@/types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from '../ui/badge';
import { FutsalBallIcon } from '../icons';

interface ScheduleCalendarProps {
  matches: FullMatch[];
}

const groupMatchesByDate = (matches: FullMatch[]) => {
  return matches.reduce((acc, match) => {
    const date = new Date(match.scheduledTime);
    const dateString = date.toLocaleDateString('es-UY', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
    
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(match);
    return acc;
  }, {} as Record<string, FullMatch[]>);
};

export function ScheduleCalendar({ matches }: ScheduleCalendarProps) {
  const matchesByRound = useMemo(() => {
    return matches.reduce((acc, match) => {
      const round = match.round || 0;
      if (!acc[round]) {
        acc[round] = [];
      }
      acc[round].push(match);
      return acc;
    }, {} as Record<number, FullMatch[]>);
  }, [matches]);

  const rounds = useMemo(() => Object.keys(matchesByRound).map(Number).sort((a, b) => a - b), [matchesByRound]);
  const [selectedRound, setSelectedRound] = useState(rounds.length > 0 ? rounds[0] : null);

  const displayedMatches = selectedRound ? matchesByRound[selectedRound] : [];
  const matchesByDate = groupMatchesByDate(displayedMatches);

  if (rounds.length === 0) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">No hay partidos en el calendario.</CardContent></Card>;
  }

  return (
    <div>
      <Carousel
        opts={{ align: "start", containScroll: "trimSnaps" }}
        className="w-full max-w-sm sm:max-w-md mx-auto mb-8"
      >
        <CarouselContent className="-ml-2">
          {rounds.map(round => (
            <CarouselItem key={round} className="pl-2 basis-auto">
              <Button
                variant={selectedRound === round ? 'default' : 'outline'}
                onClick={() => setSelectedRound(round)}
                className="w-full"
              >
                Jornada {round}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      
      <div className="space-y-4">
        {Object.entries(matchesByDate).map(([date, dateMatches]) => (
          <div key={date}>
            <h3 className="bg-muted/50 px-4 py-2 text-sm font-bold text-center uppercase tracking-wider text-muted-foreground rounded-t-lg border-x border-t">
              {date}
            </h3>
            <div className="flex flex-col border rounded-b-lg">
              {dateMatches.map((match, index) => (
                <MatchItem key={match.id} match={match} isLast={index === dateMatches.length - 1} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function MatchItem({ match, isLast }: { match: FullMatch, isLast: boolean }) {
  const { teamA, teamB, status, scoreA, scoreB, scheduledTime } = match;
  const date = new Date(scheduledTime);

  const renderScoreOrTime = () => {
    switch (status) {
      case 'FINISHED':
        return (
          <div className="text-2xl font-bold tabular-nums flex items-center justify-center gap-x-2">
            <span className={cn((scoreA ?? 0) > (scoreB ?? 0) && 'text-green-500')}>{scoreA}</span>
            <span>-</span>
            <span className={cn((scoreB ?? 0) > (scoreA ?? 0) && 'text-green-500')}>{scoreB}</span>
          </div>
        );
      case 'LIVE':
        return (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold tabular-nums">{scoreA} - {scoreB}</div>
            <Badge variant="destructive" className="mt-1 animate-pulse">EN VIVO</Badge>
          </div>
        );
      case 'SCHEDULED':
      default:
        return (
          <>
            <FutsalBallIcon className="w-6 h-6 text-muted-foreground mb-1" />
            <div className="text-2xl font-bold font-orbitron">
              {date.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
             <Link href={`/partidos/${match.id}`} className="text-xs font-semibold text-primary hover:underline mt-1">
                VER PREVIA
            </Link>
          </>
        );
    }
  };

  return (
    <div className={cn("p-4 group", !isLast && "border-b")}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <TeamDisplay team={teamA} alignment="left" />
        <div className="text-muted-foreground font-bold text-center flex flex-col items-center">
          {renderScoreOrTime()}
        </div>
        <TeamDisplay team={teamB} alignment="right" />
      </div>
    </div>
  );
}

function TeamDisplay({ team, alignment }: { team: Team, alignment: 'left' | 'right' }) {
  return (
    <Link href={`/clubes/${team.slug}`} className={cn(
      "flex flex-row items-center gap-2 group/team",
      alignment === 'right' ? 'justify-end flex-row-reverse' : 'justify-start'
    )}>
      <Image
        src={team.logoUrl || '/logofu.svg'}
        alt={`Logo de ${team.name}`}
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10 aspect-square object-contain transition-transform group-hover/team:scale-110"
      />
      <span className={cn(
        "font-bold text-sm text-center sm:text-base text-foreground group-hover/team:text-primary transition-colors w-20 sm:w-auto",
        alignment === 'left' ? 'sm:text-left' : 'sm:text-right',
      )}>
        {team.name}
      </span>
    </Link>
  );
}
