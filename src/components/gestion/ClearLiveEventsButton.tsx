
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DatabaseZap } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { clearLiveMatchEvents } from '@/actions/match-actions';

export function ClearLiveEventsButton() {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const { count } = await clearLiveMatchEvents();
      toast({
        title: "Limpieza Completada",
        description: count > 0 
            ? `Se han eliminado ${count} eventos y reiniciado los jugadores activos para los partidos en vivo.`
            : "No había eventos de partidos en vivo para eliminar.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al limpiar",
        description: error instanceof Error ? error.message : "No se pudo completar la limpieza de la base de datos.",
      });
      console.error("Error clearing live events:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isClearing}>
          <DatabaseZap className="mr-2 h-4 w-4" />
          {isClearing ? 'Limpiando...' : 'Reiniciar Partidos (En Vivo)'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará de la base de datos todos los eventos (goles, faltas, etc.) de los partidos marcados como &quot;En Vivo&quot;.
            También **reiniciará la selección de jugadores activos** y devolverá los partidos al estado &quot;Programado&quot;.
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleClear}>
            Sí, reiniciar partidos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
