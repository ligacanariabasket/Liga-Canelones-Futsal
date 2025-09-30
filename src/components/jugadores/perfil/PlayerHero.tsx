
'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Player, Team } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { playerAvatars } from '@/data/datosgenerales';

interface PlayerHeroProps {
    player: Player & { team: Team };
}

export function PlayerHero({ player }: PlayerHeroProps) {
    const router = useRouter();
    const avatarUrl = playerAvatars[player.id] || `/avatar/1.png`;

    return (
        <header className="relative bg-gray-900 overflow-hidden pt-12 pb-8">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: player.team.bannerUrl ? `url(/optimas${player.team.bannerUrl.replace(/\.(jpg|jpeg|png)$/, '.webp')})` : "none" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

            <div className="absolute inset-x-0 top-0 z-20 h-16 flex items-center text-white">
                 <div className="container mx-auto flex items-center justify-between">
                     <Button onClick={() => router.back()} variant="ghost" size="icon" className="hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                 </div>
            </div>
            
            <div className="container mx-auto pt-8 relative z-10">
                 <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between">
                    <div className="absolute -left-10 -top-10 md:left-0 md:top-0 text-[12rem] md:text-[18rem] font-black text-white/5 opacity-50 z-0 select-none pointer-events-none">
                        {player.number}
                    </div>

                    <div className="order-2 md:order-1 text-center md:text-left mt-4 md:mt-0 relative z-10">
                        <Link href={`/clubes/${player.team.slug}`} className="inline-flex items-center gap-2 group mb-2">
                            <Image
                                src={player.team.logoUrl || ''}
                                alt={`Logo de ${player.team.name}`}
                                width={28}
                                height={28}
                                className="w-7 h-7 object-contain transition-transform group-hover:scale-110 bg-white/20 rounded-full p-1"
                            />
                            <span className="font-bold text-lg text-white/90 group-hover:text-primary transition-colors">{player.team.name}</span>
                        </Link>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-white drop-shadow-lg">{player.name}</h1>
                        
                         <div className="mt-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-x-6 gap-y-2 text-lg">
                            <div className="flex items-center gap-4 text-white/80">
                                <span className="font-semibold">{player.position}</span>
                                <div className="flex items-center gap-2">
                                    <Image src="/bandera_uruguay.svg" alt="Bandera de Uruguay" width={24} height={16} />
                                    <span className="font-semibold">{player.nationality}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="relative order-1 md:order-2 h-80 w-80 md:h-96 md:w-96 flex-shrink-0 z-10">
                        <Image
                            src={avatarUrl}
                            alt={`Foto de ${player.name}`}
                            fill
                            className="object-contain object-bottom drop-shadow-[0_20px_15px_rgba(0,0,0,0.4)]"
                        />
                    </div>
                 </div>
            </div>
        </header>
    );
}
