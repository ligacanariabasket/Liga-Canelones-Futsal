
'use client';

import type { PlayerWithStats } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { playerAvatars } from '@/data/datosgenerales';

interface FeaturedPlayerProps {
    player: PlayerWithStats;
    statKey: 'goals' | 'assists' | 'matchesPlayed';
    statLabel: 'Goles' | 'Asistencias' | 'Partidos';
}

export const FeaturedPlayer = ({ player, statKey, statLabel }: FeaturedPlayerProps) => {
    const teamSlug = player.team.slug || player.team.name.toLowerCase().replace(/\s+/g, '-');
    const avatarUrl = playerAvatars[player.id] || `/avatar/1.png`;
    
    return (
    <div className="relative mb-8 overflow-hidden rounded-xl p-4 sm:p-6 transition-shadow hover:shadow-lg group text-white">
        <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url('/optimas/banner_youtube.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
             <div className="relative w-48 h-64 md:w-56 md:h-72 flex-shrink-0">
                <div className="absolute top-0 left-0 text-2xl font-bold bg-primary text-primary-foreground px-3 py-1 rounded-br-lg rounded-tl-lg z-10">1º</div>
                <Image
                    src={avatarUrl}
                    alt={`Foto de ${player.name}`}
                    fill
                    className="object-contain object-bottom drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105"
                />
            </div>

            <div className="flex-grow text-center md:text-left">
                <h2 className="text-4xl sm:text-6xl font-black uppercase text-white drop-shadow-lg group-hover:text-primary-foreground transition-colors">{player.name}</h2>
                <Link href={`/clubes/${teamSlug}`} className="flex items-center justify-center md:justify-start gap-3 text-white/90 hover:text-white mt-2 group/team">
                    <Image src={player.team.logoUrl || ''} alt={`Logo de ${player.team.name}`} width={28} height={28} className="w-8 h-8 transition-transform group-hover/team:scale-110"/>
                    <span className="font-semibold text-2xl group-hover/team:underline">{player.team.name}</span>
                </Link>
            </div>

            <div className="md:ml-auto text-center md:text-right">
                <div className="text-7xl sm:text-8xl font-black text-accent drop-shadow-lg">{player[statKey]}</div>
                <div className="text-lg font-bold uppercase text-white/80 tracking-widest">{statLabel}</div>
            </div>
        </div>
    </div>
  )
};
