
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Flag, CheckCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
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
import { Card, CardContent } from '../ui/card';

export function SimpleMatchControls() {
    const { state, dispatch, handleSaveChanges } = useGame();
    const { toast } = useToast();
    const router = useRouter();
    
    const handleSetPeriod = (period: number) => {
        dispatch({ type: 'SET_PERIOD', payload: period });
    };

    const handleResetMatch = () => {
        dispatch({ type: 'RESET_STATE' });
        toast({
            title: "Partido Reiniciado",
            description: "El estado del partido ha sido restablecido a sus valores iniciales."
        });
    }

    const handleFinishMatch = async () => {
        dispatch({ type: 'SET_STATUS', payload: 'FINISHED' });
        await handleSaveChanges({ ...state, status: 'FINISHED', isRunning: false, time: 0 });
        toast({
            title: "Partido Finalizado",
            description: "El partido ha sido marcado como finalizado y los datos han sido guardados."
        });
        router.push('/ingreso-simple');
        router.refresh();
    };

    return (
        <Card className="mb-8">
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
                     <div className="flex items-center gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Reiniciar partido?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción borrará todo el progreso (goles, faltas, etc.) y reiniciará el partido a su estado inicial. Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleResetMatch}>Sí, reiniciar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full sm:w-auto">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Finalizar Partido
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Confirmar finalización?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción marcará el partido como "Finalizado", detendrá el cronómetro y guardará el estado actual. ¿Estás seguro?
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleFinishMatch}>Sí, finalizar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
