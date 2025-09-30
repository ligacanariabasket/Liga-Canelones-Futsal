
'use client';

import * as React from "react";
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import type { GameEvent, GameEventType, Player } from '@/types';
import { Goal, Shield, Hand, Footprints, Square, RefreshCw, Timer, X, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { CourtMapModal } from '../controles/CourtMapModal';

interface PlayerActionPanelProps {
  selectedPlayer: (Player & { teamSide: 'A' | 'B' }) | null;
  onClose: () => void;
}

const actionButtons: { type: GameEventType; label: string; icon: React.ReactNode; className?: string }[] = [
  { type: 'GOAL', label: 'Gol', icon: <Goal />, className: 'bg-green-600 hover:bg-green-700 text-white' },
  { type: 'ASSIST', label: 'Asistencia', icon: <Hand /> },
  { type: 'SHOT', label: 'Tiro', icon: <Footprints /> },
  { type: 'FOUL', label: 'Falta', icon: <Shield />, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { type: 'YELLOW_CARD', label: 'Amarilla', icon: <Square className="text-yellow-400 fill-current" />, className: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' },
  { type: 'RED_CARD', label: 'Roja', icon: <Square className="text-red-500 fill-current" />, className: 'bg-red-500/20 text-red-400 hover:bg-red-500/30' },
  { type: 'SUBSTITUTION', label: 'Cambio', icon: <RefreshCw />, className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { type: 'TIMEOUT', label: 'T. Muerto', icon: <Timer />, className: 'bg-teal-600 hover:bg-teal-700 text-white' },
];

const formatTimestamp = (timestamp: number) => {
    const gameDurationPerPeriod = 1200;
    if (timestamp > gameDurationPerPeriod) {
        // First period
        const secondsIntoPeriod = timestamp - gameDurationPerPeriod;
        const minutes = 20 - Math.floor(secondsIntoPeriod / 60);
        return `1T ${minutes}'`;
    } else {
        // Second period
        const minutes = 20 - Math.floor(timestamp / 60);
        return `2T ${minutes}'`;
    }
};

export function PlayerActionPanel({ selectedPlayer, onClose }: PlayerActionPanelProps) {
  const { state, dispatch, handleCreateGameEvent } = useGame();
  const { toast } = useToast();
  const [selectedEventType, setSelectedEventType] = React.useState<GameEventType | null>(null);
  const [eventTime, setEventTime] = React.useState(state.time);
  const [isCourtMapModalOpen, setIsCourtMapModalOpen] = React.useState(false);
  const [stagedEvent, setStagedEvent] = React.useState<Omit<GameEvent, 'id' | 'matchId'> | null>(null);


  React.useEffect(() => {
    setSelectedEventType(null);
    setEventTime(state.time);
  }, [selectedPlayer, state.time]);

  const handleActionSelect = (type: GameEventType) => {
    if (!selectedPlayer) return;

    if (type === 'SUBSTITUTION') {
      dispatch({
        type: 'INITIATE_SUBSTITUTION',
        payload: { playerOut: { playerId: selectedPlayer.id, teamId: selectedPlayer.teamSide } }
      });
      onClose();
    } else {
      setSelectedEventType(type);
    }
  };
  
  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTimeChange = (delta: number) => {
    setEventTime(prev => Math.max(0, Math.min(1200, prev + delta)));
  };

  const createEvent = (type: GameEventType, time: number, coords?: { x: number; y: number }) => {
    if (!selectedPlayer) return;

    const team = selectedPlayer.teamSide === 'A' ? state.teamA : state.teamB;
    if (!team) return;

    const absoluteTimestamp = state.period === 1 ? 1200 + time : time;

    const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
      type: type,
      teamId: team.id,
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      teamName: team.name,
      timestamp: absoluteTimestamp,
      playerInId: null,
      playerInName: null,
      x: coords?.x || null,
      y: coords?.y || null,
    };
    
    return newEvent;
  }

  const handleAddEvent = () => {
    if (!selectedEventType) return;

    const newEvent = createEvent(selectedEventType, eventTime);
    if (!newEvent) return;
    
    if (selectedEventType === 'GOAL' || selectedEventType === 'SHOT') {
        setStagedEvent(newEvent);
        setIsCourtMapModalOpen(true);
    } else {
        dispatch({ type: 'ADD_EVENT', payload: { event: newEvent } });
        handleCreateGameEvent(newEvent);
        toast({
            title: "Evento Registrado",
            description: `${selectedEventType} para ${selectedPlayer?.name}.`
        });
        setSelectedEventType(null);
    }
  };
  
  const handleSelectCoordinates = (coords: { x: number; y: number }) => {
    if (stagedEvent) {
      const eventWithCoords = { ...stagedEvent, x: coords.x, y: coords.y };
      dispatch({ type: 'ADD_EVENT', payload: { event: eventWithCoords } });
      handleCreateGameEvent(eventWithCoords);
      toast({
        title: "Evento Registrado",
        description: `${stagedEvent.type} para ${selectedPlayer?.name} con ubicación.`
      });
      setStagedEvent(null);
      setSelectedEventType(null);
      onClose();
    }
    setIsCourtMapModalOpen(false);
  };

  const playerEvents = React.useMemo(() => {
    if (!selectedPlayer) return [];
    return state.events.filter(e => e.playerId === selectedPlayer.id).sort((a,b) => b.timestamp - a.timestamp);
  }, [state.events, selectedPlayer]);

  return (
    <>
      <CourtMapModal
        isOpen={isCourtMapModalOpen}
        onClose={() => setIsCourtMapModalOpen(false)}
        onSelectCoordinates={handleSelectCoordinates}
        teamSide={selectedPlayer?.teamSide || 'A'}
      />
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t shadow-2xl p-4"
          >
            <div className="container mx-auto max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <Image 
                      src={selectedPlayer.avatarUrl || '/avatar/1.png'} 
                      alt={selectedPlayer.name} 
                      width={40} 
                      height={40} 
                      className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                      <h3 className="font-bold text-lg">{selectedPlayer.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedPlayer.position}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  {selectedEventType ? (
                      <div className="space-y-4">
                          <Label className="text-center block">Tiempo del Evento (en el período)</Label>
                          <div className="flex items-center justify-center gap-2">
                              <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleTimeChange(-30)}>
                                  <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                  type="text"
                                  value={formatTime(eventTime)}
                                  readOnly
                                  className="w-24 text-center text-lg font-mono"
                              />
                              <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleTimeChange(30)}>
                                  <Plus className="h-4 w-4" />
                              </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" onClick={() => setSelectedEventType(null)}>Cancelar</Button>
                              <Button onClick={handleAddEvent}>Añadir Evento</Button>
                          </div>
                      </div>
                  ) : (
                      <div className="grid grid-cols-4 gap-2">
                      {actionButtons.map(action => (
                          <motion.div key={action.type} whileTap={{ scale: 0.95 }}>
                          <Button
                              size="sm"
                              className={cn("w-full flex-col h-16", action.className)}
                              onClick={() => handleActionSelect(action.type)}
                          >
                              {React.cloneElement(action.icon as React.ReactElement, { className: 'h-5 w-5 mb-1' })}
                              <span className="text-xs">{action.label}</span>
                          </Button>
                          </motion.div>
                      ))}
                      </div>
                  )}
                </div>
                <div>
                    <h4 className="font-semibold text-center mb-2">Eventos Registrados</h4>
                    <ScrollArea className="h-48 border rounded-md p-2 bg-muted/30">
                      {playerEvents.length > 0 ? (
                        <ul className="space-y-2">
                          {playerEvents.map((event, index) => (
                            <li key={index} className="text-sm flex justify-between items-center bg-background/50 p-2 rounded">
                                  <span>{event.type}</span>
                                  <span className="font-mono text-muted-foreground">{formatTimestamp(event.timestamp)}</span>
                              </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Sin eventos para este jugador.
                        </div>
                      )}
                    </ScrollArea>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
