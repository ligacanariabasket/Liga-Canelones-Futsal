
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag, Save, Minus, Plus, Users, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


interface TacticalActionsProps {
  onTogglePanel: (panel: 'A' | 'B') => void;
  visiblePanel: 'A' | 'B' | null;
}


export function TacticalActions({ onTogglePanel, visiblePanel }: TacticalActionsProps) {
  const { state, dispatch, handleSaveChanges } = useGame();
  const router = useRouter();

  const handlePeriodChange = (delta: number) => {
    const newPeriod = Math.max(1, state.period + delta);
    dispatch({ type: 'SET_PERIOD', payload: newPeriod });
  };
    
  const handleFinishMatch = async () => {
    dispatch({ type: 'SET_STATUS', payload: 'FINISHED' });
    await handleSaveChanges({ ...state, status: 'FINISHED' });
    router.push('/cancha');
    router.refresh();
  }

  const isMatchLive = state.status === 'LIVE';

  return (
    <footer className="flex-shrink-0 border-t border-gray-700 bg-gray-800/50 p-2 backdrop-blur-sm">
        <div className="mx-auto flex w-full flex-row items-center justify-between gap-2">
            
            {/* Team A Panel Toggle */}
            <div className="hidden md:flex items-center justify-start gap-2 w-32">
              <Button
                  size="lg"
                  variant={visiblePanel === 'A' ? 'accent-blue' : 'outline'}
                  className={cn(
                    "w-full",
                    visiblePanel !== 'A' && "border-blue-500 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300"
                  )}
                  onClick={() => onTogglePanel('A')}
              >
                  <Users className="mr-2 h-5 w-5"/> {state.teamA?.name.substring(0,3)}
              </Button>
            </div>
            
            {/* Center Controls */}
            <div className="flex-grow flex justify-center">
                {/* Desktop Controls */}
                 <div className="hidden md:flex flex-row items-center justify-center gap-2">
                    <Button
                        size="lg"
                        onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
                        aria-label={state.isRunning ? "Pausar tiempo" : "Iniciar tiempo"}
                        className={cn(
                            "w-32",
                            state.isRunning ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
                        )}
                        disabled={!isMatchLive}
                    >
                        {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                        {state.isRunning ? 'Pausar' : 'Iniciar'}
                    </Button>
                    <Button variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })} size="lg" className="border-gray-600 bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white" disabled={!isMatchLive}>
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Reiniciar
                    </Button>
                     <div className="flex items-center justify-center gap-1 rounded-lg bg-gray-900/70 p-1 shadow-lg">
                        <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white" disabled={!isMatchLive}><Minus className="h-4 w-4" /></Button>
                        <div className="flex items-center gap-2 text-white px-2">
                            <Flag className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold whitespace-nowrap">P: {state.period}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white" disabled={!isMatchLive}><Plus className="h-4 w-4" /></Button>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="md:hidden w-full flex flex-col gap-2 items-center">
                    <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                        <Button size="lg" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} className={cn(state.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700')} disabled={!isMatchLive}>
                            {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                            {state.isRunning ? 'Pausar' : 'Iniciar'}
                        </Button>
                        <Button variant="destructive" onClick={handleFinishMatch} size="lg" disabled={!isMatchLive}>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Finalizar
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                        <Button size="lg" variant={visiblePanel === 'A' ? 'accent-blue' : 'outline'} onClick={() => onTogglePanel('A')}
                            className={cn(
                                visiblePanel !== 'A' && "border-blue-500 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300"
                            )}>
                           <Users className="mr-2 h-4 w-4"/> {state.teamA?.name.substring(0,3)}
                        </Button>
                        <div className="flex items-center justify-around gap-1 rounded-lg bg-gray-900/70 shadow-lg col-span-1">
                            <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} className="text-white h-8 w-8 hover:bg-gray-600/50" disabled={!isMatchLive}><Minus className="h-4 w-4"/></Button>
                            <span className="font-semibold text-white">P:{state.period}</span>
                            <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} className="text-white h-8 w-8 hover:bg-gray-600/50" disabled={!isMatchLive}><Plus className="h-4 w-4"/></Button>
                        </div>
                         <Button size="lg" variant={visiblePanel === 'B' ? 'accent-red' : 'outline'} onClick={() => onTogglePanel('B')}
                            className={cn(
                                visiblePanel !== 'B' && "border-red-500 text-red-400 hover:bg-red-900/50 hover:text-red-300"
                            )}>
                           <Users className="mr-2 h-4 w-4"/> {state.teamB?.name.substring(0,3)}
                        </Button>
                    </div>
                </div>
            </div>
            
             {/* Right Side Controls */}
            <div className="hidden md:flex items-center justify-end gap-2">
                 <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => handleSaveChanges()}
                    className="w-32" 
                    disabled={!isMatchLive}
                >
                    <Save className="mr-2 h-5 w-5" />
                    Guardar
                </Button>
                 <Button 
                    size="lg"
                    variant={visiblePanel === 'B' ? 'accent-red' : 'outline'}
                    className={cn(
                        "w-32",
                        visiblePanel !== 'B' && "border-red-500 text-red-400 hover:bg-red-900/50 hover:text-red-300"
                    )}
                    onClick={() => onTogglePanel('B')}
                >
                    <Users className="mr-2 h-5 w-5"/> {state.teamB?.name.substring(0,3)}
                </Button>
            </div>
        </div>
    </footer>
  );
}
