
'use client';

import type { Player, Team } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { playerAvatars } from '@/data/datosgenerales';

interface PlayerInfoCardProps {
  player: Player;
  team: Team;
}

export function PlayerInfoCard({ player, team }: PlayerInfoCardProps) {
  const avatarUrl = playerAvatars[player.id] || `/avatar/1.png`;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href={`/jugadores/${player.id}`} className="block h-full group">
        <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-primary/20 bg-card relative isolate">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 z-0 transition-opacity group-hover:opacity-20"
            style={{ backgroundImage: team.bannerUrl ? `url(/optimas${team.bannerUrl.replace(/\.(jpg|jpeg|png)$/, '.webp')})` : "none" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent z-10"></div>
          
          <div className="relative w-full aspect-[4/5] overflow-hidden z-20 mt-[-2rem]">
            <Image
              src={avatarUrl}
              alt={`Foto de ${player.name}`}
              fill
              className="object-contain object-bottom drop-shadow-[0_10px_8px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 p-2">
                 <span className="text-5xl font-black text-white/50 drop-shadow-lg" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}>
                    {player.number}
                </span>
            </div>
          </div>
          <CardContent className="p-3 bg-transparent flex flex-col items-center justify-between z-20 text-center -mt-8">
             <div className="flex flex-col items-center">
                <h3 className="text-lg font-bold leading-tight text-foreground">{player.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{player.position}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
