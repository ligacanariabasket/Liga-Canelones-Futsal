
'use client';

import { PlayerBasicInfo } from '@/components/jugadores/perfil/PlayerBasicInfo';
import { PlayerHero } from '@/components/jugadores/perfil/PlayerHero';
import { PlayerInfoTabs } from '@/components/jugadores/perfil/PlayerInfoTabs';
import { PlayerStats } from '@/components/jugadores/perfil/PlayerStats';
import { ShotMap } from '@/components/partidos/estadisticas/ShotMap';
import type { Team, GameEvent, Player } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlayerAdvancedStats } from '@/components/jugadores/perfil/PlayerAdvancedStats';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface PlayerProfileClientProps {
    player: Player & { team: Team, gameEvents: GameEvent[] };
}

export function PlayerProfileClient({ player }: PlayerProfileClientProps) {
    const [selectedMatchId, setSelectedMatchId] = useState<string>('all');
    const [randomCourtImage, setRandomCourtImage] = useState<string>('');

    useEffect(() => {
        const courtImages = ['/cancha/cancha_entera_azul.png', '/cancha/cancha_entera_roja.png'];
        setRandomCourtImage(courtImages[Math.floor(Math.random() * courtImages.length)]);
    }, []);

    const finishedMatches = useMemo(() => {
        if (!player) return [];
        const matchMap = new Map<number, { id: number, name: string }>();
        player.gameEvents.forEach(event => {
             if (event.matchId) {
                const opponent = event.teamId === player.teamId ? 'Oponente' : event.teamName; // Simplified
                matchMap.set(event.matchId, { id: event.matchId, name: `vs ${opponent}`});
            }
        });
        return Array.from(matchMap.values());
    }, [player]);

    const filteredEvents = useMemo(() => {
        if (!player) return [];
        if (selectedMatchId === 'all') {
            return player.gameEvents;
        }
        return player.gameEvents.filter(event => String(event.matchId) === selectedMatchId);
    }, [player, selectedMatchId]);

    const opponentTeam: Team = {
      id: -1,
      name: 'Oponente',
      slug: 'oponente',
      logoUrl: '',
      description: '',
      bannerUrl: '',
      instagram: '',
      facebook: '',
      whatsapp: '',
      phone: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      players: [],
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PlayerHero player={player} />
                <PlayerInfoTabs />

                <div className="bg-muted/40 py-8">
                    <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <PlayerBasicInfo player={player} />
                        <PlayerStats player={player} />
                    </div>
                    <div className="container mx-auto max-w-4xl mt-8">
                        <div className="mb-4">
                            <Label htmlFor="match-filter">Filtrar por Partido</Label>
                            <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
                                <SelectTrigger id="match-filter" className="mt-1">
                                    <SelectValue placeholder="Seleccionar partido" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los Partidos</SelectItem>
                                    {finishedMatches.map(match => (
                                        <SelectItem key={match.id} value={String(match.id)}>
                                            {match.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                      <ShotMap events={filteredEvents} teamA={player.team} teamB={opponentTeam} backgroundImageUrl={randomCourtImage} />
                    </div>
                     <div className="container mx-auto max-w-4xl mt-8">
                        <PlayerAdvancedStats player={player} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
