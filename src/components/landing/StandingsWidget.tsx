
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { SeasonTeam, Team } from '@/types';

interface StandingsWidgetProps {
  standings: (SeasonTeam & { team: Team })[];
  loading: boolean;
}

const TeamRow = ({ team, position, pts, pg }: { team: Team, position: number, pts: number, pg: number }) => (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-2 border-b border-border/20 last:border-none">
        <div className="flex items-center gap-3 font-semibold text-muted-foreground w-12">
            <div className="w-1 h-5 bg-primary/50 rounded-full"></div>
            <span className="text-foreground">{position}</span>
        </div>
        <div className="flex items-center gap-3">
            <Image src={team.logoUrl!} alt={team.name} width={28} height={28} className="w-7 h-7 object-contain" />
            <span className="font-bold text-foreground truncate">{team.name}</span>
        </div>
        <div className="flex items-center gap-4 justify-self-end">
            <span className="text-muted-foreground w-6 text-center">{pg}</span>
            <span className="font-bold text-primary w-6 text-center">{pts}</span>
        </div>
    </div>
);

const StandingsSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({length: 5}).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-6 w-12 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-md" />
          <div className="flex items-center gap-4 ml-auto">
            <Skeleton className="h-5 w-6 rounded-md" />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StandingsWidget({ standings, loading }: StandingsWidgetProps) {
  const topTeams = standings.slice(0, 5);

  return (
    <Card className="h-full bg-card/80 backdrop-blur-sm shadow-lg flex flex-col border-border/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">ASÍ ESTÁ LA TABLA</CardTitle>
        <p className="text-sm text-muted-foreground">LIGA CANARIA FUTSAL</p>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 text-xs font-semibold text-muted-foreground px-2 mb-2">
            <span className="w-12">POS.</span>
            <span>EQUIPO</span>
            <div className="flex gap-4 justify-self-end">
                <span className="w-6 text-center">PJ</span>
                <span className="w-6 text-center">PTS</span>
            </div>
        </div>
        {loading ? <StandingsSkeleton /> : topTeams.map((teamData, index) => (
          <TeamRow 
            key={teamData.team.id}
            team={teamData.team}
            position={index + 1}
            pts={teamData.points}
            pg={teamData.played}
          />
        ))}
      </CardContent>
      <CardFooter className="p-4 mt-auto">
        <Button asChild variant="link" className="text-primary p-0 h-auto">
            <Link href="/posiciones">
                VER TABLA COMPLETA
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
