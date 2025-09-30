'use client';

import type { PlayerWithStats } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardFooter } from '@/components/ui/card';
import { playerAvatars } from '@/data/datosgenerales';
import { motion } from 'framer-motion';

interface PlayerScoreCardProps {
  player: PlayerWithStats;
}

export function PlayerScoreCard({ player }: PlayerScoreCardProps) {
  const avatarUrl = playerAvatars[player.id] || `/avatar/1.png`;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link href={`/jugadores/${player.id}`} className="block h-full group">
        <Card className="relative flex flex-col h-full overflow-hidden bg-primary/90 text-primary-foreground border-none shadow-lg">
          {/* Main player image */}
          <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-primary to-accent">
            <Image
              src={avatarUrl}
              alt={`Foto de ${player.name}`}
              fill
              className="object-contain object-bottom drop-shadow-[0_10px_8px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>

          {/* Team logo overlay */}
          <div className="absolute top-2 right-2 p-2 bg-background/20 backdrop-blur-sm rounded-full">
            <Image
              src={player.team.logoUrl || ''}
              alt={`Logo de ${player.team.name}`}
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>

          <CardFooter className="p-3 bg-white text-black flex items-center justify-between mt-auto">
            <span className="font-black text-lg uppercase truncate">{player.name}</span>
            <span className="text-4xl font-black tabular-nums">{player.goals}</span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
