

'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag, Save, CheckCircle, Minus, Plus, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '../ui/label';


const formatTime = (seconds: number) => {
    const flooredSeconds = Math.floor(seconds);
    const minutes = Math.floor(flooredSeconds / 60);
    const remainingSeconds = flooredSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function ControlsPanel() {
  const { state, dispatch, handleSaveChanges } = useGame();
  const { toast } = useToast();
  const router = useRouter();
  const [newMinutes, setNewMinutes] = useState(Math.floor(state.time / 60));
  const [newSeconds, setNewSeconds] = useState(state.time % 60);

  const handlePeriodChange = (delta: number) => {
    const newPeriod = Math.max(1, state.period + delta);
    dispatch({ type: 'SET_PERIOD', payload: newPeriod });
  };
    
  const handleFinishMatch = async () => {
    dispatch({ type: 'SET_STATUS', payload: 'FINISHED' });
    await handleSaveChanges({ ...state, status: 'FINISHED', isRunning: false, time: 0 });
    toast({
        title: "Partido Finalizado",
        description: "El partido ha sido marcado como finalizado y los datos han sido guardados."
    });
    router.push('/controles');
    router.refresh();
  }
  
  const handleSaveAndExit = async () => {
    await handleSaveChanges();
     toast({
        title: "Cambios Guardados",
        description: "El estado actual del partido ha sido guardado.",
    });
    router.push('/controles');
    router.refresh();
  }

  const handleTimeChange = () => {
    const totalSeconds = (newMinutes * 60) + newSeconds;
    dispatch({ type: 'SET_TIME', payload: totalSeconds });
  };
  
  const isMatchLive = state.status === 'LIVE';

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md flex flex-col h-full p-2 sm:p-4 gap-4">

      <div className="hidden md:flex flex-col flex-grow items-center justify-around gap-4 pt-6 overflow-y-auto">
          <h2 className="text-center text-primary font-bold">Controles del Juego</h2>
          <div className="text-center">
              <p className="text-sm text-muted-foreground">Tiempo de Juego</p>
                <Dialog>
                    <DialogTrigger asChild>
                        <p className="text-6xl font-mono font-bold text-foreground cursor-pointer hover:text-primary transition-colors" aria-live="polite">{formatTime(state.time)}</p>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Editar Tiempo</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div>
                                <Label htmlFor="minutes-panel" className="text-right">Minutos</Label>
                                <Input
                                    id="minutes-panel"
                                    type="number"
                                    value={newMinutes}
                                    onChange={(e) => setNewMinutes(Math.max(0, parseInt(e.target.value, 10)))}
                                    className="col-span-3"
                                />
                            </div>
                            <div>
                                <Label htmlFor="seconds-panel" className="text-right">Segundos</Label>
                                <Input
                                    id="seconds-panel"
                                    type="number"
                                    value={newSeconds}
                                    onChange={(e) => setNewSeconds(Math.max(0, Math.min(59, parseInt(e.target.value, 10))))}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" onClick={handleTimeChange}>Guardar Cambios</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
          </div>
          <div className="flex items-center gap-4">
              <Button size="lg" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} aria-label={state.isRunning ? "Pausar tiempo" : "Iniciar tiempo"}>
                  {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                  {state.isRunning ? 'Pausar' : 'Iniciar'}
              </Button>
              <Button size="lg" variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })} aria-label="Reiniciar tiempo">
                  <RotateCcw className="mr-2 h-5 w-5"/>
                  Reiniciar
              </Button>
          </div>
          <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período"><Minus className="h-4 w-4" /></Button>
              <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold text-lg">Período: {state.period}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex w-full justify-around pt-4 border-t">
              <div className="text-center">
                  <p className="text-sm font-semibold">{state.teamA?.name}</p>
                  <Button size="sm" variant="outline" className="mt-1" disabled={state.timeoutsA <= 0} onClick={() => {}}>
                      <Timer className="mr-2 h-4 w-4" /> T. Muerto ({state.timeoutsA})
                  </Button>
              </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">{state.teamB?.name}</p>
                    <Button size="sm" variant="outline" className="mt-1" disabled={state.timeoutsB <= 0} onClick={() => {}}>
                      <Timer className="mr-2 h-4 w-4" /> T. Muerto ({state.timeoutsB})
                  </Button>
              </div>
          </div>
          <Button variant="destructive" onClick={handleSaveAndExit} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Guardar y Salir
          </Button>
      </div>

        <div className="md:hidden w-full flex flex-col gap-2 items-center">
            <div className="grid grid-cols-2 gap-2 w-full">
                <Button size="lg" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} className={state.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} disabled={!isMatchLive}>
                    {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                    {state.isRunning ? 'Pausar' : 'Iniciar'}
                </Button>
                <Button variant="destructive" onClick={handleFinishMatch} size="lg" disabled={!isMatchLive}>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Finalizar
                </Button>
            </div>
             <div className="grid grid-cols-2 gap-2 w-full">
                 <div className="flex items-center justify-around gap-1 rounded-lg bg-muted/80 shadow-inner col-span-1 p-1">
                    <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} className="text-foreground h-8 w-8 hover:bg-background/50" disabled={!isMatchLive}><Minus className="h-4 w-4"/></Button>
                    <span className="font-semibold text-foreground text-sm">P:{state.period}</span>
                    <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} className="text-foreground h-8 w-8 hover:bg-background/50" disabled={!isMatchLive}><Plus className="h-4 w-4"/></Button>
                </div>
                 <Button variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })} size="lg" className="border-border bg-muted/80 text-foreground hover:bg-background/50" disabled={!isMatchLive}>
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reiniciar
                </Button>
            </div>
             <Button variant="secondary" onClick={handleSaveAndExit} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
            </Button>
        </div>

    </div>
  );
}
