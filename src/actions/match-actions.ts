

'use server';

import prisma from '../lib/prisma';
import type { Team, Player, GameEvent as PrismaGameEvent, PlayerMatchStats, MatchStatus, GameEventType, PlayerStat, PlayerPositionType, FullMatch as ClientFullMatch, GameState, MatchChronicle } from '@/types';
import { revalidatePath } from 'next/cache';
import { Prisma, type Match, type EventType } from '@prisma/client';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';

export type MatchesForSelect = Prisma.PromiseReturnType<typeof getMatchesForSelect>

export async function getMatchesForSelect() {
  const matches = await prisma.match.findMany({
    select: {
      id: true,
      scheduledTime: true,
      status: true,
      teamA: {
        select: { id: true, name: true, players: { select: { id: true, name: true, number: true, position: true } } },
      },
      teamB: {
        select: { id: true, name: true, players: { select: { id: true, name: true, number: true, position: true } } },
      },
    },
    orderBy: {
      scheduledTime: 'desc',
    },
  });
  return matches;
}

// --- Type Definitions for this Action File ---

export type FullMatch = Match & {
  teamA: Team & { players: Player[] };
  teamB: Team & { players: Player[] };
  events: PrismaGameEvent[];
  playerMatchStats: PlayerMatchStats[];
};

function toClientFullMatch(match: FullMatch): ClientFullMatch {
    return {
        ...match,
        scheduledTime: match.scheduledTime.toISOString(),
        updatedAt: match.updatedAt.toISOString(),
        teamA: {
            ...match.teamA,
            players: (match.teamA.players || []).map(p => ({...p, position: p.position as PlayerPositionType})) as Player[],
        },
        teamB: {
            ...match.teamB,
            players: (match.teamB.players || []).map(p => ({...p, position: p.position as PlayerPositionType})) as Player[],
        }
    };
}


// --- Match Read Operations ---

export async function getMatchById(matchId: number): Promise<ClientFullMatch | undefined> {
    const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
            teamA: { include: { players: true } },
            teamB: { include: { players: true } },
            events: true,
            playerMatchStats: true,
        },
    });

    if (!match) return undefined;

    return toClientFullMatch(match as unknown as FullMatch);
}

export async function getMatchForChronicle(matchId: number) {
    const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
            teamA: { include: { players: true } },
            teamB: { include: { players: true } },
            events: true,
        },
    });

    if (!match) return undefined;

    const getStatCount = (teamId: number, type: GameEventType) => {
        return match.events.filter(e => e.teamId === teamId && e.type === type).length;
    }

    const stats = {
        teamA: {
            goals: match.scoreA,
            shots: getStatCount(match.teamAId, 'SHOT'),
            fouls: getStatCount(match.teamAId, 'FOUL'),
        },
        teamB: {
            goals: match.scoreB,
            shots: getStatCount(match.teamBId, 'SHOT'),
            fouls: getStatCount(match.teamBId, 'FOUL'),
        }
    };

    return {
        id: match.id,
        teamA: match.teamA,
        teamB: match.teamB,
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        events: match.events,
        stats: stats
    };
}

export type MatchStats = FullMatch & {
  stats: {
    topScorers: PlayerStat[];
    assistsLeaders: PlayerStat[];
    foulsByPlayer: PlayerStat[];
    shotsByPlayer: PlayerStat[];
  };
};

export async function getMatchStats(id: number): Promise<MatchStats | undefined> {
  const match = await getMatchById(id);
  if (!match) return undefined;
  
  const allPlayersInMatch = [...match.teamA.players, ...match.teamB.players];
  
  const getPlayerStatFromEvents = (eventType: GameEventType): PlayerStat[] => {
      const stats: { [key: number]: PlayerStat } = {};
      match.events.filter(e => e.type === eventType).forEach(event => {
          if (event.playerId) {
              if (!stats[event.playerId]) {
                  const player = allPlayersInMatch.find(p => p.id === event.playerId);
                  const team = player?.teamId === match.teamA.id ? match.teamA : match.teamB;
                  if (player && team) {
                      stats[event.playerId] = { player: { ...player, team }, count: 0 };
                  }
              }
              if (stats[event.playerId]) {
                  stats[event.playerId].count++;
              }
          }
      });
      return Object.values(stats).sort((a, b) => b.count - a.count);
  }

  const matchStats: MatchStats = {
      ...match,
      stats: {
          topScorers: getPlayerStatFromEvents('GOAL'),
          assistsLeaders: getPlayerStatFromEvents('ASSIST'),
          foulsByPlayer: getPlayerStatFromEvents('FOUL'),
          shotsByPlayer: getPlayerStatFromEvents('SHOT'),
      }
  };

  return matchStats;
}

export async function getAllMatches(): Promise<ClientFullMatch[]> {
  const matches = await prisma.match.findMany({
    include: {
        teamA: { include: { players: true } },
        teamB: { include: { players: true } },
        events: true,
        playerMatchStats: true,
    }
  });

  return (matches as unknown as FullMatch[]).map(toClientFullMatch);
}

export type LiveMatch = Match & {
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  time: number;
  period: number;
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
  const liveMatchesData = await prisma.match.findMany({
    where: { status: 'LIVE' },
    include: { teamA: true, teamB: true },
    orderBy: { scheduledTime: 'asc' },
  });

  return liveMatchesData as unknown as LiveMatch[];
}

// --- Match Write Operations ---

export async function createMatch(data: {
    teamAId: number;
    teamBId: number;
    scheduledTime: Date;
    round: number;
    seasonId: number;
}): Promise<ClientFullMatch> { // Return FullMatch to include relations
    const newMatch = await prisma.match.create({
        data: {
            ...data,
            status: 'SCHEDULED',
            scoreA: 0,
            scoreB: 0,
            period: 1,
            time: 1200,
            foulsA: 0,
            foulsB: 0,
            timeoutsA: 1,
            timeoutsB: 1,
            isRunning: false,
            activePlayersA: [],
            activePlayersB: [],
        }
    });
    revalidatePath('/gestion/partidos');
    
    const fullNewMatch = await getMatchById(newMatch.id);
    if (!fullNewMatch) {
        throw new Error("Failed to re-fetch newly created match.");
    }
    return fullNewMatch;
}

export async function createManualMatches(seasonId: number, matches: { teamAId: number, teamBId: number, round: number, scheduledTime: Date }[]): Promise<void> {
    const matchesToCreate = matches.map(match => ({
        ...match,
        seasonId,
        status: 'SCHEDULED' as MatchStatus,
        scoreA: 0,
        scoreB: 0,
        period: 1,
        time: 1200,
        foulsA: 0,
        foulsB: 0,
        timeoutsA: 1,
        timeoutsB: 1,
    }));

    await prisma.match.createMany({
        data: matchesToCreate,
        skipDuplicates: true,
    });
    revalidatePath('/gestion/partidos');
    revalidatePath('/gestion/gestion-manual/crear');
}

export async function updateMatchStatus(matchId: number, status: MatchStatus): Promise<void> {
  await prisma.match.update({
    where: { id: matchId },
    data: { status },
  });
  revalidatePath('/partidos');
  revalidatePath(`/partidos/${matchId}`);
  revalidatePath(`/controles`);
}


export async function saveMatchState(matchId: number, state: GameState): Promise<void> {
    if (!state.teamA || !state.teamB) {
        throw new Error('Invalid match state provided.');
    }

    const { status, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB, period, time, isRunning, activePlayersA, activePlayersB, playerTimeTracker } = state;

    try {
        const updateMatchPromise = prisma.match.update({
            where: { id: matchId },
            data: {
                status,
                scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB,
                period, time, isRunning, activePlayersA, activePlayersB,
            },
        });

        const playerStatPromises = Object.entries(playerTimeTracker).map(([playerIdStr, stats]) => {
            const playerId = parseInt(playerIdStr, 10);
            const player = state.teamA?.players.find(p => p.id === playerId) || state.teamB?.players.find(p => p.id === playerId);
            if (!player) return null; // Return null if player not found

            return prisma.playerMatchStats.upsert({
                where: { matchId_playerId: { matchId, playerId } },
                update: {
                  timePlayedInSeconds: Math.floor(stats.totalTime),
                },
                create: {
                    matchId,
                    playerId,
                    timePlayedInSeconds: Math.floor(stats.totalTime),
                },
            });
        }).filter((p): p is NonNullable<typeof p> => p !== null);

        await prisma.$transaction([updateMatchPromise, ...playerStatPromises]);

    } catch (error) {
        console.error(`Failed to save match state for ${matchId}:`, error);
        throw new Error('Database operation failed.');
    }
}


export async function createGameEvent(matchId: number, event: Omit<GameEvent, 'id' | 'matchId'>): Promise<void> {
    try {
        await prisma.gameEvent.create({
            data: {
                matchId: matchId,
                ...event,
                type: event.type as EventType,
                timestamp: event.timestamp
            },
        });
        revalidatePath(`/partidos/${matchId}`);
    } catch(error) {
        console.error(`Failed to create event for match ${matchId}:`, error);
        throw new Error('Could not create game event.');
    }
}
    
export async function generateFixture(seasonId: number, teamIds: number[]): Promise<Prisma.BatchPayload> {
    if (teamIds.length < 2) {
        throw new Error("Se necesitan al menos dos equipos para generar un fixture.");
    }

    const matchesToCreate: Prisma.MatchCreateManyInput[] = [];
    const scheduleDate = new Date();
    scheduleDate.setHours(19, 0, 0, 0); // Start matches at 19:00

    for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
            matchesToCreate.push({
                teamAId: teamIds[i],
                teamBId: teamIds[j],
                seasonId,
                round: (i + j - 1),
                scheduledTime: new Date(scheduleDate),
                status: 'SCHEDULED',
                scoreA: 0,
                scoreB: 0,
                period: 1,
                time: 1200,
                foulsA: 0,
                foulsB: 0,
                timeoutsA: 1,
                timeoutsB: 1,
            });

            scheduleDate.setDate(scheduleDate.getDate() + 1);
        }
    }
    
    revalidatePath('/gestion/partidos');
    return prisma.match.createMany({
        data: matchesToCreate,
        skipDuplicates: true,
    });
}

export async function clearLiveMatchEvents(): Promise<{ count: number }> {
    const liveMatches = await prisma.match.findMany({
        where: { status: 'LIVE' },
        select: { id: true },
    });

    if (liveMatches.length === 0) {
        return { count: 0 };
    }

    const liveMatchIds = liveMatches.map(match => match.id);

    const [deletedEvents] = await prisma.$transaction([
        prisma.gameEvent.deleteMany({
            where: {
                matchId: {
                    in: liveMatchIds,
                },
            },
        }),
        prisma.match.updateMany({
            where: {
                id: {
                    in: liveMatchIds,
                },
            },
            data: {
                status: 'SCHEDULED',
                scoreA: 0,
                scoreB: 0,
                foulsA: 0,
                foulsB: 0,
                timeoutsA: 1,
                timeoutsB: 1,
                period: 1,
                time: 1200,
                isRunning: false,
                activePlayersA: [],
                activePlayersB: [],
            },
        })
    ]);
    
    revalidatePath('/controles');
    revalidatePath('/partidos');
    liveMatchIds.forEach(id => {
        revalidatePath(`/controles/${id}`);
        revalidatePath(`/partidos/${id}`);
    });

    return { count: deletedEvents.count };
}

export async function getOrCreateMatchChronicle(matchId: number, teamId: number): Promise<MatchChronicle> {
    const existingChronicle = await prisma.matchChronicle.findFirst({
        where: { matchId },
    });

    if (existingChronicle) {
        return existingChronicle as MatchChronicle;
    }

    const newChronicle = await prisma.matchChronicle.create({
        data: {
            matchId,
            teamId,
            chronicle: {
                partialChronicles: [],
                finalChronicle: null,
            },
        },
    });

    return newChronicle as MatchChronicle;
}


export async function getChronicleByMatchId(matchId: number): Promise<MatchChronicle | null> {
    const chronicle = await prisma.matchChronicle.findFirst({
        where: { matchId: matchId },
        include: {
            team: true,
        }
    });
    return chronicle as MatchChronicle | null;
}

export async function updateMatchChronicle(id: number, chronicle: Prisma.JsonObject): Promise<MatchChronicle> {
  const result = await prisma.matchChronicle.update({
    where: {
      id,
    },
    data: {
      chronicle,
    },
  });
  revalidatePath(`/gestion/cronicas/${result.matchId}`);
  revalidatePath(`/gestion/cronicas/${result.matchId}/edit`);
  return result as MatchChronicle;
}

export async function getLatestChronicles(limit: number = 5): Promise<(MatchChronicle & { match: FullMatch })[]> {
    const chronicles = await prisma.matchChronicle.findMany({
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            match: {
                include: {
                    teamA: { include: { players: true } },
                    teamB: { include: { players: true } },
                    events: true,
                    playerMatchStats: true,
                }
            },
        },
    });

    return chronicles as unknown as (MatchChronicle & { match: FullMatch })[];
}
    

export async function getFinishedMatchesForHomepage(limit: number = 6) {
  return prisma.match.findMany({
    where: { status: 'FINISHED' },
    take: limit,
    orderBy: {
      scheduledTime: 'desc',
    },
    include: {
      teamA: true,
      teamB: true,
      _count: {
        select: {
          chronicles: true,
        },
      },
    },
  });
}
    

    