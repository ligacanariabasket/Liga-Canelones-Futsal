

'use client';

import type { FullMatch, MatchStatus } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Calendar, Clock, Edit, BarChart2, Users, CheckCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { updateMatchStatus } from '@/actions/match-actions';
import { useRouter } from 'next/navigation';


interface ControlMatchCardProps {
  match: FullMatch;
}

const statusVariantMap: Record<MatchStatus, 'default' | 'destructive' | 'secondary'> = {
  SCHEDULED: 'secondary',
  LIVE: 'destructive',
  FINISHED: 'default',
  SELECTING_STARTERS: 'secondary',
  POSTPONED: 'secondary',
  IN_PROGRESS: 'destructive'
};

const statusTextMap: Record<MatchStatus, string> = {
    SCHEDULED: 'Programado',
    LIVE: 'En Vivo',
    FINISHED: 'Finalizado',
    SELECTING_STARTERS: 'Def. Titulares',
    POSTPONED: 'Pospuesto',
    IN_PROGRESS: 'En Progreso'
};

export function ControlMatchCard({ match }: ControlMatchCardProps) {
    const scheduledDateTime = new Date(match.scheduledTime);
    const { toast } = useToast();
    const router = useRouter();
    const formattedDate = scheduledDateTime.toLocaleDateString('es-UY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const formattedTime = scheduledDateTime.toLocaleTimeString('es-UY', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });

  const handleFinishMatch = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await updateMatchStatus(match.id, 'FINISHED');
      toast({
        title: "Partido Finalizado",
        description: `El partido entre ${match.teamA.name} y ${match.teamB.name} ha sido marcado como finalizado.`,
      });
      router.refresh();
    } catch {
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo finalizar el partido.",
      });
    }
  }


  const renderActions = () => {
    const commonButtonClass = "w-full sm:w-auto";
    switch (match.status) {
      case 'SCHEDULED':
      case 'SELECTING_STARTERS':
        return (
          <>
            <Button variant="accent" size="sm" asChild className={commonButtonClass}>
               <Link href={`/controles/${match.id}`}>
                <Users className="mr-2 h-4 w-4" />
                Definir Titulares
              </Link>
            </Button>
          </>
        );
      case 'LIVE':
      case 'IN_PROGRESS':
        return (
          <>
             <Button variant="outline" size="sm" asChild className={commonButtonClass}>
              <Link href={`/cancha/${match.id}`}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Pizarra Táctica
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleFinishMatch}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar Partido
            </Button>
            <Button variant="accent" size="sm" className={`${commonButtonClass} animate-pulse`} asChild>
                <Link href={`/controles/${match.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Controlar (En Vivo)
                </Link>
            </Button>
          </>
        );
      case 'FINISHED':
        return (
          <Button variant="outline" size="sm" asChild className={commonButtonClass}>
            <Link href={`/partidos/${match.id}/estadisticas`}>
              <BarChart2 className="mr-2 h-4 w-4" />
              Estadísticas
            </Link>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-primary/20 bg-card">
      <CardHeader className="p-4 bg-card-foreground/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold truncate text-card-foreground">
            {match.teamA.name} vs {match.teamB.name}
          </CardTitle>
          <Badge variant={statusVariantMap[match.status]}>{statusTextMap[match.status]}</Badge>
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
          <span className="text-xl font-bold text-muted-foreground">VS</span>
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
            <span>{formattedTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-card-foreground/5" aria-label={`Acciones para el partido entre ${match.teamA.name} y ${match.teamB.name}`}>
        <div className="flex flex-wrap gap-2 w-full justify-end">
            {renderActions()}
        </div>
      </CardFooter>
    </Card>
  );
}
