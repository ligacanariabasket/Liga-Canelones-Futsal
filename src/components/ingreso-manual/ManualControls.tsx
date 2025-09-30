
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Flag, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

export function ManualControls() {
    const { state, dispatch } = useGame();
    
    const handleSetPeriod = (period: number) => {
        dispatch({ type: 'SET_PERIOD', payload: period });
    };

    const handleClearMatch = () => {
        if (state.matchId) {
            localStorage.removeItem(`futsal-match-state-${state.matchId}`);
            window.location.reload();
        }
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                        <Button 
                            variant={state.period === 1 ? 'default' : 'outline'}
                            onClick={() => handleSetPeriod(1)}
                            disabled={state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS'}
                            className="w-full"
                        >
                            <Flag className="mr-2 h-4 w-4" />
                            1er Tiempo
                        </Button>
                        <Button
                            variant={state.period === 2 ? 'default' : 'outline'}
                            onClick={() => handleSetPeriod(2)}
                            disabled={state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS'}
                            className="w-full"
                        >
                            <Flag className="mr-2 h-4 w-4" />
                            2do Tiempo
                        </Button>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Limpiar Partido
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción limpiará todos los datos de este partido guardados localmente (marcador, eventos, etc.) y recargará la página.
                                No afectará los datos guardados en la base de datos hasta que guardes los cambios.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearMatch}>Sí, limpiar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
