
'use server';

import { cache } from 'react';
import { prisma } from '../lib/prisma';
import type { Player, Team, PlayerStat, PlayerWithStats, GameEvent } from '@/types';
import { getAllMatches, getMatchStats } from './match-actions';
import type { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';


export type PlayersForSelect = Prisma.PromiseReturnType<typeof getPlayersForSelect>

export const getPlayersForSelect = cache(async () => {
  const players = await prisma.player.findMany({
    select: {
      id: true,
      name: true,
      team: {
        select: { name: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
  return players;
});

const playerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  number: z.coerce.number().min(0, "El número no puede ser negativo"),
  position: z.enum(["GOLERO", "DEFENSA", "ALA", "PIVOT"]),
  teamId: z.string().min(1, "Debe seleccionar un equipo"),
  avatarUrl: z.string().optional(),
  nationality: z.string().optional(),
  birthDate: z.date().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
});


export async function createPlayer(values: z.infer<typeof playerSchema>) {
    const validatedFields = playerSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Datos de jugador inválidos.');
    }

    const { name, number, position, teamId: teamIdString, avatarUrl, nationality, birthDate, height, weight } = validatedFields.data;
    const teamId = parseInt(teamIdString, 10);
    
    let finalAvatarUrl = avatarUrl;

    if (!finalAvatarUrl || finalAvatarUrl.trim() === '') {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: { slug: true }
      });
      if (team) {
        finalAvatarUrl = `/optimas/equipos/jugadores_individuales/avatar_${team.slug}.webp`;
      }
    }

    const playerData: Prisma.PlayerCreateInput = {
        name,
        number,
        position,
        team: {
            connect: { id: teamId }
        },
        nationality: nationality || 'URU',
        birthDate,
        height,
        weight,
        ...(finalAvatarUrl && { avatarUrl: finalAvatarUrl }),
    };

    await prisma.player.create({
        data: playerData,
    });

    revalidatePath('/gestion/jugadores');
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (team) {
      revalidatePath(`/gestion/jugadores/equipo/${team.slug}`);
    }
}

export async function updatePlayer(id: number, values: z.infer<typeof playerSchema>) {
    const validatedFields = playerSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Datos de jugador inválidos.');
    }

    const { name, number, position, teamId: teamIdString, avatarUrl, nationality, birthDate, height, weight } = validatedFields.data;
    const teamId = parseInt(teamIdString, 10);

    const currentPlayer = await prisma.player.findUnique({ where: { id }});
    if (!currentPlayer) {
        throw new Error("El jugador no existe.");
    }
    
    const playerData: Prisma.PlayerUpdateInput = {
        name,
        number,
        position,
        team: {
            connect: { id: teamId }
        },
        nationality: nationality || undefined,
        birthDate: birthDate || undefined,
        height: height || undefined,
        weight: weight || undefined,
        ...(avatarUrl && { avatarUrl: avatarUrl }),
    };
    
    await prisma.player.update({
        where: { id },
        data: playerData,
    });

    revalidatePath('/gestion/jugadores');
    const oldTeam = await prisma.team.findUnique({ where: { id: currentPlayer.teamId } });
    const newTeam = await prisma.team.findUnique({ where: { id: teamId } });
    if (oldTeam) {
        revalidatePath(`/gestion/jugadores/equipo/${oldTeam.slug}`);
    }
    if (newTeam && oldTeam?.id !== newTeam.id) {
        revalidatePath(`/gestion/jugadores/equipo/${newTeam.slug}`);
    }
}

/**
 * Retrieves a list of all players from the database, including their team.
 * @returns {Promise<(Player & { team: Team })[]>} A promise that resolves to an array of Player objects with their team.
 */
export const getAllPlayers = cache(async (): Promise<(Player & { team: Team })[]> => {
    try {
        const players = await prisma.player.findMany({
            include: {
                team: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return players as (Player & { team: Team })[];
    } catch (error) {
        console.error('Error al obtener todos los jugadores:', error);
        return [];
    }
});

/**
 * Retrieves a specific player by their ID.
 * @param {number} id - The ID of the player to retrieve.
 * @returns {Promise<(Player & { team: Team }) | null>} A promise that resolves to the player object with their team, or null if not found.
 */
export const getPlayerById = cache(async (id: number): Promise<(Player & { team: Team, gameEvents: GameEvent[] }) | null> => {
    try {
        const player = await prisma.player.findUnique({
            where: { id },
            include: {
                team: true,
                gameEvents: {
                    include: {
                        team: true,
                    }
                },
            },
        });

        if (!player) {
            return null;
        }
        
        return player as unknown as (Player & { team: Team, gameEvents: GameEvent[] });

    } catch (error) {
        console.error(`Error al obtener el jugador con id ${id}:`, error);
        return null;
    }
});

/**
 * Aggregates player stats from all finished matches.
 * @returns {Promise<PlayerWithStats[]>} A promise that resolves to an array of players with their aggregated stats.
 */
export const getAggregatedPlayerStats = cache(async (): Promise<PlayerWithStats[]> => {
    const allMatches = await getAllMatches();
    const finishedMatches = allMatches.filter(m => m.status === 'FINISHED');
    const allPlayersWithTeam = await getAllPlayers();

    const playerStatsMap: { [playerId: number]: { player: PlayerWithStats, goals: number, assists: number, matchesPlayed: number, minutesPlayed: number } } = {};

    // Initialize all players
    allPlayersWithTeam.forEach(p => {
        playerStatsMap[p.id] = {
            player: { ...p, goals: 0, assists: 0, matchesPlayed: 0, minutesPlayed: 0, avgMinutesPerMatch: 0 },
            goals: 0,
            assists: 0,
            matchesPlayed: 0,
            minutesPlayed: 0
        };
    });


    for (const match of finishedMatches) {
        const stats = await getMatchStats(match.id);
        if (!stats) continue;

        const processStats = (statArray: PlayerStat[], type: 'goals' | 'assists') => {
            statArray.forEach(stat => {
                if (!playerStatsMap[stat.player.id]) return;

                if (type === 'goals') {
                    playerStatsMap[stat.player.id].goals += stat.count;
                } else {
                    playerStatsMap[stat.player.id].assists += stat.count;
                }
            });
        };

        const getPlayerStatFromEvents = (eventType: 'GOAL' | 'ASSIST') => {
            return Object.values(match.events.filter(e => e.type === eventType).reduce((acc, event) => {
                if (event.playerId) {
                    if (!acc[event.playerId]) {
                        const player = allPlayersWithTeam.find(p => p.id === event.playerId);
                        if (player) {
                            acc[event.playerId] = { player, count: 0 };
                        }
                    }
                    if (acc[event.playerId]) {
                        acc[event.playerId].count++;
                    }
                }
                return acc;
            }, {} as { [key: number]: PlayerStat }));
        }

        processStats(getPlayerStatFromEvents('GOAL'), 'goals');
        processStats(getPlayerStatFromEvents('ASSIST'), 'assists');
        
        const playersInMatch = new Set<number>();
        stats.teamA.players.forEach(p => playersInMatch.add(p.id));
        stats.teamB.players.forEach(p => playersInMatch.add(p.id));

        playersInMatch.forEach(playerId => {
             if (playerStatsMap[playerId]) {
                playerStatsMap[playerId].matchesPlayed += 1;
            }
        });
        
        match.playerMatchStats.forEach(stat => {
            if (playerStatsMap[stat.playerId]) {
                playerStatsMap[stat.playerId].minutesPlayed += stat.timePlayedInSeconds;
            }
        });
    }

    return Object.values(playerStatsMap).map(p => {
        const matchesPlayed = p.matchesPlayed || 0;
        const minutesPlayed = Math.floor(p.minutesPlayed / 60);
        const avgMinutesPerMatch = matchesPlayed > 0 ? parseFloat((minutesPlayed / matchesPlayed).toFixed(1)) : 0;
        
        return {
            ...p.player,
            goals: p.goals,
            assists: p.assists,
            matchesPlayed,
            minutesPlayed,
            avgMinutesPerMatch,
        };
    });
});
