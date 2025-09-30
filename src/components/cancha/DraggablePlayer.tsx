
'use client';

import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ActionMenu } from './ActionMenu';
import type { Player } from '@/types';
import { useState } from 'react';

const ItemTypes = {
  PLAYER: 'player',
};

interface DraggablePlayerProps {
  player: Player;
  x: number;
  y: number;
  color: 'blue' | 'red';
  onMove: (x: number, y: number) => void;
  isSubstitute?: boolean;
}

export function DraggablePlayer({ player, x, y, color, onMove, isSubstitute = false }: DraggablePlayerProps) {
    const { state, dispatch } = useGame();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.PLAYER,
        item: { id: player.id },
        canDrag: !isSubstitute,
        end: (item, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset();
            const didDrag = monitor.didDrop() || (delta && (delta.x !== 0 || delta.y !== 0));
            if (didDrag) {
                 const dropResult = monitor.getDropResult<{x: number, y: number}>();
                 if (dropResult) {
                    onMove(dropResult.x, dropResult.y);
                 }
            }
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [x, y, player.id, onMove, isSubstitute]);

    const handleClick = (e: React.MouseEvent) => {
        // Prevent click from propagating if it was part of a drag
        if (isDragging) {
             e.stopPropagation();
             return;
        }
        const teamId = state.teamA?.players.some(p => p.id === player.id) ? 'A' : 'B';
        dispatch({ type: 'SELECT_PLAYER', payload: { teamId, playerId: player.id }});
        setIsMenuOpen(true);
    };

    return (
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
                 <div
                    ref={drag}
                    onClick={handleClick}
                    className={cn(
                        'relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border-2 border-white/50 font-bold text-white shadow-lg transition-transform',
                        color === 'blue' ? 'bg-blue-500' : 'bg-red-500',
                        isDragging ? 'opacity-50 scale-110' : 'opacity-100 scale-100',
                        isSubstitute ? 'cursor-pointer' : 'absolute cursor-move'
                    )}
                    style={!isSubstitute ? {
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                    } : {}}
                >
                    <span className="text-lg md:text-xl">{player.number}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 bg-gray-900/80 border-gray-700 text-white backdrop-blur-md">
                 <ActionMenu player={player} onAction={() => setIsMenuOpen(false)} />
            </PopoverContent>
        </Popover>
    );
}
