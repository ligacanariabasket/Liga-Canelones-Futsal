
'use client';

import type { Team } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamSelectItemProps {
  team: Team;
  onSelect: () => void;
  isSelected: boolean;
}

export function TeamSelectItem({ team, onSelect, isSelected }: TeamSelectItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-md transition-colors",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50 cursor-pointer"
      )}
      onClick={!isSelected ? onSelect : undefined}
    >
      <div className="flex items-center gap-3">
        <Image
          src={team.logoUrl || '/logofu.svg'}
          alt={`Logo de ${team.name}`}
          width={28}
          height={28}
          className="rounded-full"
        />
        <span className="font-semibold">{team.name}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7",
          isSelected ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : "text-primary hover:bg-primary/10 hover:text-primary"
        )}
        onClick={(e) => {
          e.stopPropagation(); // Evita que el div capture el click si es un botón
          onSelect();
        }}
      >
        {isSelected ? <MinusCircle /> : <PlusCircle />}
      </Button>
    </div>
  );
}
