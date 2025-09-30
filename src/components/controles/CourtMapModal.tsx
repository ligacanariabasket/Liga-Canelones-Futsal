
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CourtMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoordinates: (coords: { x: number; y: number }) => void;
  teamSide: 'A' | 'B';
}

export function CourtMapModal({ isOpen, onClose, onSelectCoordinates, teamSide }: CourtMapModalProps) {
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    // Si es el equipo B, atacan hacia la izquierda (0-50 en el eje X)
    // El mapa `media_cancha__teamB` está espejado, así que debemos transformar la coordenada.
    if (teamSide === 'B') {
      xPercent = 50 - (xPercent / 2);
    } else {
      // El equipo A ataca hacia la derecha (50-100 en el eje X)
      xPercent = 50 + (xPercent / 2);
    }

    onSelectCoordinates({ x: Math.round(xPercent), y: Math.round(yPercent) });
    onClose();
  };

  const imageUrl = teamSide === 'A' 
    ? '/cancha/media_cancha__teamA.svg' 
    : '/cancha/media_cancha__teamB.svg';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Selecciona la ubicación en la cancha</DialogTitle>
          <DialogDescription>
            Haz clic en el mapa para registrar la ubicación del tiro o gol en la mitad de la cancha de ataque.
          </DialogDescription>
        </DialogHeader>
        <div 
          className="relative w-full aspect-[1/1] cursor-pointer" 
          onClick={handleMapClick}
        >
          <Image
            src={imageUrl}
            alt={`Media cancha de futsal para equipo ${teamSide}`}
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
