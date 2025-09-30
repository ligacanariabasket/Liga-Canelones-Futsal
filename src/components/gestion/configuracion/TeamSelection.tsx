
'use client';

import { useState } from 'react';
import type { Team, Season } from '@/types';
import { Button } from '@/components/ui/button';
import { TeamSelectItem } from './TeamSelectItem';
import { DroppableTeamList } from './DroppableTeamList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createSeasonAndTeamsAction } from '@/actions/genkit-actions';

interface TeamSelectionProps {
  allTeams: Team[];
  isDisabled: boolean;
  season: Season | null;
  onTeamsConfirmed: (teams: Team[]) => void;
}

export function TeamSelection({ allTeams, isDisabled, season, onTeamsConfirmed }: TeamSelectionProps) {
  const [availableTeams, setAvailableTeams] = useState(allTeams);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const handleSelectTeam = (team: Team) => {
    setAvailableTeams(prev => prev.filter(t => t.id !== team.id));
    setSelectedTeams(prev => [...prev, team].sort((a,b) => a.name.localeCompare(b.name)));
  };

  const handleRemoveTeam = (team: Team) => {
    setSelectedTeams(prev => prev.filter(t => t.id !== team.id));
    setAvailableTeams(prev => [...prev, team].sort((a,b) => a.name.localeCompare(b.name)));
  };

  const handleContinue = () => {
    if (selectedTeams.length < 2) {
      toast({
        variant: 'destructive',
        title: 'Equipos insuficientes',
        description: 'Debes seleccionar al menos 2 equipos para continuar.',
      });
      return;
    }
    onTeamsConfirmed(selectedTeams);
  };
  
  const handleSaveWithoutFixture = async () => {
      if (!season || selectedTeams.length < 2) {
          toast({ variant: 'destructive', title: 'Error', description: 'Asegúrate de haber creado una temporada y seleccionado al menos 2 equipos.' });
          return;
      }
      try {
          await createSeasonAndTeamsAction({
              seasonId: season.id,
              teams: selectedTeams.map(({id, name}) => ({id, name})),
          });
          toast({
              title: 'Temporada Guardada',
              description: 'Los equipos han sido guardados. Puedes generar el fixture más tarde.',
          });
          router.push(`/gestion/partidos?seasonId=${season.id}`);
      } catch {
           toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar los equipos.' });
      }
  }


  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Equipos Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
             <ScrollArea className="h-full">
                <div className="space-y-1 pr-4">
                    {availableTeams.map(team => (
                        <TeamSelectItem
                        key={team.id}
                        team={team}
                        onSelect={() => handleSelectTeam(team)}
                        isSelected={false}
                        />
                    ))}
                </div>
             </ScrollArea>
          </CardContent>
        </Card>
        <DroppableTeamList teams={selectedTeams} onRemoveTeam={handleRemoveTeam} />
      </div>
      <div className="flex justify-end gap-4">
         <Button variant="outline" onClick={handleSaveWithoutFixture} disabled={isDisabled || selectedTeams.length < 2}>
            <Save className="mr-2 h-4 w-4" />
            Guardar sin Fixture
        </Button>
        <Button onClick={handleContinue} disabled={isDisabled || selectedTeams.length < 2}>
            Continuar a Generar Fixture
            <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
