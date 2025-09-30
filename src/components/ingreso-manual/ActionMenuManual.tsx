
'use client';

import * as React from "react";
import { Button } from '@/components/ui/button';
import type { GameEventType, Player } from '@/types';
import { Goal, Shield, Hand, Footprints, Square, RefreshCw, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActionMenuManualProps {
  player: Player;
  onAction: (type: GameEventType) => void;
  selectedEventType: GameEventType | null;
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

export function ActionMenuManual({ onAction, selectedEventType }: ActionMenuManualProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {actionButtons.map(action => (
        <motion.div key={action.type} whileTap={{ scale: 0.95 }}>
          <Button
            variant={selectedEventType === action.type ? 'default' : 'outline'}
            size="sm"
            className={cn(
                "w-full flex-col h-16",
                selectedEventType !== action.type && action.className
            )}
            onClick={() => onAction(action.type)}
          >
            {React.cloneElement(action.icon as React.ReactElement, { className: 'h-5 w-5 mb-1' })}
            <span className="text-xs">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
