
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
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

export function ClearLocalStorageButton() {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleClearLocalStorage = () => {
    setIsClearing(true);
    try {
      let clearedCount = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('futsal-match-state-')) {
          localStorage.removeItem(key);
          clearedCount++;
        }
      });

      toast({
        title: "Limpieza Completada",
        description: `Se han eliminado ${clearedCount} registros de partidos del almacenamiento local.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al limpiar",
        description: "No se pudo completar la limpieza del almacenamiento local.",
      });
      console.error("Error clearing localStorage:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isClearing}>
          <Trash2 className="mr-2 h-4 w-4" />
          {isClearing ? 'Limpiando...' : 'Limpiar Datos de Partidos Locales'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente todos los datos de partidos guardados en tu navegador
            (marcador, tiempo, eventos, etc.). Esta acción no se puede deshacer.
            Es útil si has recargado la base de datos y quieres evitar conflictos con datos antiguos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearLocalStorage}>
            Sí, limpiar datos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
