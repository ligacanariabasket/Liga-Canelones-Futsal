
'use client';

import * as React from "react";
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import type { GameEvent, GameEventType, Player } from '@/types';
import { Goal, Shield, Hand, Footprints, Square, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { CourtMapModal } from '../controles/CourtMapModal';
import { useState } from 'react';

interface ActionMenuProps {
  player: Player;
  onAction: () => void;
}

const actionButtons: { type: GameEventType; label: string; icon: React.ReactNode; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent" | null | undefined, className?: string }[] = [
  { type: 'GOAL', label: 'Gol', icon: <Goal />, variant: 'accent', className: 'bg-green-600 hover:bg-green-700 text-white' },
  { type: 'ASSIST', label: 'Asistencia', icon: <Hand />, variant: 'outline', className: 'border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white' },
  { type: 'SHOT', label: 'Tiro', icon: <Footprints />, variant: 'outline', className: 'border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white' },
  { type: 'FOUL', label: 'Falta', icon: <Shield />, variant: 'accent', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { type: 'YELLOW_CARD', label: 'Amarilla', icon: <Square />, variant: 'accent', className: 'bg-yellow-400 text-black hover:bg-yellow-500'},
  { type: 'RED_CARD', label: 'Roja', icon: <Square />, variant: 'destructive'},
  { type: 'SUBSTITUTION', label: 'Cambio', icon: <RefreshCw />, variant: 'accent', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
];

export function ActionMenu({ player, onAction }: ActionMenuProps) {
  const { state, dispatch, handleCreateGameEvent } = useGame();
  const { toast } = useToast();
  const [isCourtMapModalOpen, setIsCourtMapModalOpen] = useState(false);
  const [eventTypeToRegister, setEventTypeToRegister] = useState<GameEventType | null>(null);
  
  const teamSide = state.teamA?.players.some(p => p.id === player.id) ? 'A' : 'B';

  const handleActionClick = (type: GameEventType) => {
    if (type === 'GOAL' || type === 'SHOT') {
        setEventTypeToRegister(type);
        setIsCourtMapModalOpen(true);
    } else if (type === 'SUBSTITUTION') {
        const teamId = state.teamA?.players.some(p => p.id === player.id) ? 'A' : 'B';
        dispatch({
            type: 'INITIATE_SUBSTITUTION',
            payload: {
                playerOut: {
                    playerId: player.id,
                    teamId: teamId
                }
            }
        });
        onAction();
    } else {
        createEvent(type);
        onAction();
    }
  };

  const createEvent = (type: GameEventType, coords?: { x: number, y: number }) => {
    const teamId = state.teamA?.players.some(p => p.id === player.id) ? state.teamA.id : state.teamB?.id;
    const teamName = state.teamA?.players.some(p => p.id === player.id) ? state.teamA.name : state.teamB?.name;

    if (!teamId || !teamName) return;

    const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
        type: type,
        teamId: teamId,
        playerId: player.id,
        playerName: player.name,
        teamName: teamName,
        timestamp: state.time,
        playerInId: null,
        playerInName: null,
        x: coords?.x || null,
        y: coords?.y || null,
    };
    dispatch({ type: 'ADD_EVENT', payload: { event: newEvent } });
    handleCreateGameEvent(newEvent);
    toast({
        title: "Evento Registrado",
        description: `${type} para ${player.name}.`
    })
  }
  
  const handleSelectCoordinates = (coords: { x: number; y: number }) => {
    if (eventTypeToRegister) {
      createEvent(eventTypeToRegister, coords);
      setEventTypeToRegister(null);
    }
    onAction();
  };

  return (
    <>
      <CourtMapModal
        isOpen={isCourtMapModalOpen}
        onClose={() => setIsCourtMapModalOpen(false)}
        onSelectCoordinates={handleSelectCoordinates}
        teamSide={teamSide}
      />
      <div className="flex flex-col gap-1">
        <div className="p-2 border-b border-gray-600">
          <p className="font-bold text-white">{player.name}</p>
          <p className="text-xs text-gray-400"># {player.number}</p>
        </div>
        <div className="grid grid-cols-2 gap-1 p-1">
          {actionButtons.map(action => (
            <motion.div key={action.type} whileTap={{ scale: 0.95 }}>
              <Button
                variant={action.variant || 'ghost'}
                size="sm"
                className={cn("w-full justify-start text-white hover:text-white", action.className)}
                onClick={() => handleActionClick(action.type)}
              >
                {React.cloneElement(action.icon as React.ReactElement, { className: 'mr-2 h-4 w-4' })}
                <span>{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
