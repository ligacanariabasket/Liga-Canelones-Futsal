
'use client';

import { useState } from 'react';
import type { PlayerWithStats } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { playerAvatars } from '@/data/datosgenerales';

type StatKey = 'goals' | 'assists' | 'matchesPlayed' | 'minutesPlayed' | 'avgMinutesPerMatch';
type StatLabel = 'Goles' | 'Asistencias' | 'Partidos' | 'Minutos' | 'Prom. Minutos';


const STATS_CONFIG: { key: StatKey; label: StatLabel }[] = [
  { key: 'goals', label: 'Goles' },
  { key: 'assists', label: 'Asistencias' },
  { key: 'matchesPlayed', label: 'Partidos' },
  { key: 'minutesPlayed', label: 'Minutos' },
  { key: 'avgMinutesPerMatch', label: 'Prom. Minutos' },
];

interface RankingProps {
  players: PlayerWithStats[];
}

const FeaturedPlayer = ({ player, statKey, statLabel }: { player: PlayerWithStats, statKey: StatKey, statLabel: StatLabel }) => {
    const teamSlug = player.team.slug || player.team.name.toLowerCase().replace(/\s+/g, '-');
    const avatarUrl = playerAvatars[player.id] || `/avatar/1.png`;
    
    return (
    <div className="relative mb-8 overflow-hidden rounded-xl p-4 sm:p-6 transition-shadow hover:shadow-lg group text-white">
        <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url('/banner_youtube.jpg')` }}
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

export function PlayerRanking({ players }: RankingProps) {
  const [activeStat, setActiveStat] = useState<StatKey>('goals');

  if (players.length === 0) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">No hay datos de ranking disponibles.</CardContent></Card>;
  }

  const sortedPlayers = [...players]
    .filter(p => p[activeStat] > 0) // Filter out players with 0 for the stat
    .sort((a, b) => b[activeStat] - a[activeStat]);

  const featuredPlayer = sortedPlayers.length > 0 ? sortedPlayers[0] : null;
  const rankedList = sortedPlayers.slice(1, 10); // Take the next 9 players for a total of 10
  const activeLabel = STATS_CONFIG.find(s => s.key === activeStat)?.label || 'Goles';

  if (!featuredPlayer) {
      return (
          <div>
            <div className="mb-6 flex justify-center gap-2 flex-wrap">
                {STATS_CONFIG.map(stat => (
                    <Button 
                        key={stat.key}
                        variant={activeStat === stat.key ? 'default' : 'outline'}
                        onClick={() => setActiveStat(stat.key)}
                    >
                        {stat.label}
                    </Button>
                ))}
            </div>
            <Card><CardContent className="p-8 text-center text-muted-foreground">No hay jugadores con {activeLabel.toLowerCase()} registrados.</CardContent></Card>
          </div>
      )
  }

  return (
    <div>
        <div className="mb-6 flex justify-center gap-2 flex-wrap">
            {STATS_CONFIG.map(stat => (
                 <Button 
                    key={stat.key}
                    variant={activeStat === stat.key ? 'default' : 'outline'}
                    onClick={() => setActiveStat(stat.key)}
                 >
                    {stat.label}
                </Button>
            ))}
        </div>

        {featuredPlayer && <FeaturedPlayer player={featuredPlayer} statKey={activeStat} statLabel={activeLabel} />}

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-16 text-center">POS.</TableHead>
                <TableHead>JUGADOR</TableHead>
                <TableHead className="w-24 text-right uppercase">{activeLabel}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rankedList.map((player, index) => {
                    const teamSlug = player.team.slug || player.team.name.toLowerCase().replace(/\s+/g, '-');
                    const avatarUrl = playerAvatars[player.id] || `/avatar/1.png`;
                    return (
                        <TableRow key={player.id} className="hover:bg-muted/30">
                            <TableCell className="text-center font-bold text-muted-foreground">{index + 2}º</TableCell>
                            <TableCell>
                            <div className="flex items-center gap-4 group">
                                <Link href={`/jugadores/${player.id}`}>
                                    <Image
                                    src={avatarUrl}
                                    alt={`Foto de ${player.name}`}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full object-cover object-top transition-transform group-hover:scale-105"
                                    />
                                </Link>
                                <div>
                                <Link href={`/jugadores/${player.id}`} className="font-bold group-hover:text-primary transition-colors">{player.name}</Link>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Link href={`/clubes/${teamSlug}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                        <Image src={player.team.logoUrl || ''} alt={`Logo de ${player.team.name}`} width={14} height={14} />
                                        {player.team.name}
                                    </Link>
                                </div>
                                </div>
                            </div>
                            </TableCell>
                            <TableCell className="text-right text-2xl font-black text-primary">{player[activeStat]}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
          </div>
        </Card>
    </div>
  );
}
