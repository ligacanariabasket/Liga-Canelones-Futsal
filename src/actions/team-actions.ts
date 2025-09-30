'use server';

import { cache } from 'react';
import prisma from '../lib/prisma';
import type { FullMatch, GameEventType, Team } from '@/types';
import { Prisma, type GameEvent } from '@prisma/client';

const teamIncludePlayers = {
    players: true,
};

type TeamWithPlayers = Prisma.TeamGetPayload<{ include: typeof teamIncludePlayers }>;

export const getAllTeams = cache(async (): Promise<Team[]> => {
    try {
        const teams = await prisma.team.findMany({
            orderBy: {
                name: 'asc',
            },
            include: teamIncludePlayers,
        });
        return teams as Team[];
    } catch (error) {
        console.error('Error al obtener los equipos:', error);
        return [];
    }
});

const matchIncludeOptions = {
    teamA: { include: teamIncludePlayers },
    teamB: { include: teamIncludePlayers },
    events: true,
    playerMatchStats: true,
};

type TeamWithMatches = TeamWithPlayers & {
    matches: FullMatch[];
};

export const getTeamBySlug = cache(async (slug: string): Promise<TeamWithMatches | null> => {
    try {
        const team = await prisma.team.findUnique({
            where: { slug },
            include: teamIncludePlayers,
        });

        if (!team) {
            return null;
        }

        const matches = (await prisma.match.findMany({
            where: {
                OR: [
                    { teamAId: team.id },
                    { teamBId: team.id }
                ]
            },
            include: matchIncludeOptions,
            orderBy: {
                scheduledTime: 'asc'
            }
        })) as (Prisma.MatchGetPayload<{ include: typeof matchIncludeOptions }>)[]

        const fullMatches: FullMatch[] = matches.map((match) => {
            if (!match.teamA || !match.teamB) {
                throw new Error(`Match with id ${match.id} is missing team data.`);
            }
            return {
                ...match,
                scheduledTime: match.scheduledTime.toISOString(),
                updatedAt: match.updatedAt.toISOString(),
                status: match.status as FullMatch['status'],
                teamA: match.teamA as Team,
                teamB: match.teamB as Team,
                events: match.events.map((event: GameEvent) => ({
                    ...event,
                    type: event.type as GameEventType,
                })),
                playerMatchStats: match.playerMatchStats,
            };
        });

        return { ...team, matches: fullMatches };

    } catch (error) {
        console.error(`Error al obtener el equipo por slug: ${slug}`, error);
        return null;
    }
});
