
'use client';

import { useState } from 'react';
import type { Season, Team } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateFixtureForSeasonAction } from '@/actions/genkit-actions';
import { CalendarCheck, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface FixtureGenerationProps {
  isDisabled: boolean;
  season: Season | null;
  selectedTeams: Team[];
}

export function FixtureGeneration({ isDisabled, season, selectedTeams }: FixtureGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerateFixture = async () => {
    if (!season) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se ha seleccionado una temporada.' });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateFixtureForSeasonAction({
        seasonId: season.id,
        teams: selectedTeams.map(({ id, name }) => ({ id, name })),
      });
      
      toast({
        title: '¡Fixture Generado!',
        description: `Se han creado ${result.matchCount} partidos para la temporada.`,
      });
      router.push(`/gestion/partidos?seasonId=${season.id}`);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al generar el fixture',
        description: error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">Paso 3: Generar Calendario</h3>
        <p className="text-sm text-muted-foreground mb-4">
            Crea automáticamente el calendario de partidos de ida y vuelta para todos los equipos seleccionados.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button disabled={isDisabled || isGenerating} variant="accent">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck className="mr-2 h-4 w-4" />}
                {isGenerating ? 'Generando...' : 'Generar Fixture Automáticamente'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Confirmar Generación de Fixture?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción creará todos los partidos para la temporada. Este proceso no se puede deshacer fácilmente.
                Asegúrate de que la lista de equipos es la definitiva.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerateFixture}>Confirmar y Generar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
