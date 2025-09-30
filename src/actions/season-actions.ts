
'use server';

import { cache } from 'react';
import prisma from '../lib/prisma';
import type { Season, Team } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import type { SeasonTeam } from '@/types';

// Definimos un tipo más específico para el resultado que esperamos
type StandingWithTeam = SeasonTeam & { team: Team };
type StandingCalculated = Omit<SeasonTeam, 'id' | 'seasonId' | 'position'> & { team: Team, position: number, recentResults: ('W' | 'D' | 'L')[] };


/**
 * Retrieves the standings for a specific season.
 * @param {number} seasonId - The ID of the season to retrieve the standings for.
 * @returns {Promise<StandingWithTeam[]>} A promise that resolves to an array with the standings data.
 */
export const getStandings = cache(async (seasonId: number): Promise<StandingWithTeam[]> => {
    try {
        const standings = await prisma.seasonTeam.findMany({
            where: {
                seasonId: seasonId,
            },
            include: {
                team: true, // Incluye la información completa del equipo
            },
            orderBy: {
                position: 'asc', // Ordena por la posición en la tabla
            },
        });
        
        // Aseguramos el tipo de retorno
        return standings as StandingWithTeam[];

    } catch (error) {
        console.error(`Error al obtener la tabla de posiciones para la temporada ${seasonId}:`, error);
        // Devolvemos un array vacío en caso de error para evitar que la página se rompa.
        return [];
    }
});

/**
 * Calculates standings dynamically from finished matches for a given season.
 * @param {number} seasonId - The ID of the season.
 * @returns {Promise<StandingCalculated[]>} A promise that resolves to an array of calculated standings.
 */
export const getStandingsFromMatches = cache(async (seasonId: number): Promise<StandingCalculated[]> => {
    try {
        const finishedMatches = await prisma.match.findMany({
            where: {
                seasonId: seasonId,
                status: 'FINISHED',
            },
            include: {
                teamA: true,
                teamB: true,
            },
            orderBy: {
                scheduledTime: 'desc'
            }
        });

        const allTeamsInSeason = await prisma.seasonTeam.findMany({
            where: { seasonId },
            include: { team: true }
        });

        const statsMap: { [teamId: number]: Omit<StandingCalculated, 'team' | 'position'> & { teamId: number } } = {};

        // Initialize stats for all teams in the season
        allTeamsInSeason.forEach(seasonTeam => {
            statsMap[seasonTeam.teamId] = {
                teamId: seasonTeam.teamId,
                points: 0,
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                recentResults: []
            };
        });
        
        const reversedMatches = [...finishedMatches].reverse();

        for (const match of reversedMatches) {
            const { teamAId, teamBId, scoreA, scoreB } = match;

            const teamAStats = statsMap[teamAId];
            const teamBStats = statsMap[teamBId];

            if (!teamAStats || !teamBStats) continue;

            teamAStats.played += 1;
            teamBStats.played += 1;
            teamAStats.goalsFor += scoreA ?? 0;
            teamBStats.goalsFor += scoreB ?? 0;
            teamAStats.goalsAgainst += scoreB ?? 0;
            teamBStats.goalsAgainst += scoreA ?? 0;

            let resultA: 'W' | 'D' | 'L' = 'D';
            let resultB: 'W' | 'D' | 'L' = 'D';

            if (scoreA > scoreB) {
                teamAStats.wins += 1;
                teamAStats.points += 2;
                teamBStats.losses += 1;
                resultA = 'W';
                resultB = 'L';
            } else if (scoreB > scoreA) {
                teamBStats.wins += 1;
                teamBStats.points += 2;
                teamAStats.losses += 1;
                resultA = 'L';
                resultB = 'W';
            } else {
                teamAStats.draws += 1;
                teamBStats.draws += 1;
                teamAStats.points += 1;
                teamBStats.points += 1;
            }
            
            teamAStats.recentResults.unshift(resultA);
            teamBStats.recentResults.unshift(resultB);
        }

        const finalStandingsWithTeams = Object.values(statsMap).map(stat => {
            const teamData = allTeamsInSeason.find(t => t.teamId === stat.teamId)?.team;
            if (!teamData) throw new Error(`Team with ID ${stat.teamId} not found in season.`);
            
            return {
                ...stat,
                goalDifference: stat.goalsFor - stat.goalsAgainst,
                recentResults: stat.recentResults.slice(0, 5),
                team: teamData,
            };
        });

        const sortedStandings = finalStandingsWithTeams.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
            return a.team.name.localeCompare(b.team.name);
        });

        return sortedStandings.map((stat, index) => ({
            ...stat,
            position: index + 1,
        }));
    } catch (error) {
        console.error(`Error calculating standings for season ${seasonId}:`, error);
        return [];
    }
});


/**
 * Retrieves all seasons from the database, including the teams associated with each season.
 * @returns {Promise<(Season & { teams: SeasonTeam[] })[]>} A promise that resolves to an array of seasons with their teams.
 */
export const getAllSeasonsWithTeams = cache(async (): Promise<(Season & { teams: (SeasonTeam & { team: Team })[] })[]> => {
    try {
        const seasons = await prisma.season.findMany({
            include: {
                teams: {
                    include: {
                        team: {
                            include: {
                                players: true // Ensure players are included in the team data
                            }
                        }
                    }
                }
            },
            orderBy: {
                year: 'desc',
            },
        });
        return seasons as (Season & { teams: (SeasonTeam & { team: Team })[] })[];
    } catch (error) {
        console.error('Error al obtener las temporadas:', error);
        return [];
    }
});

/**
 * Creates a new season in the database.
 * @param {string} name - The name of the season.
 * @param {number} year - The year of the season.
 * @returns {Promise<Season>} A promise that resolves to the newly created season.
 * @throws {Error} If the season could not be created.
 */
export async function createSeason(name: string, year: number): Promise<Season> {
    const season = await prisma.season.create({
        data: {
            name,
            year,
        },
    });
    revalidatePath('/gestion/temporadas');
    revalidatePath('/gestion/gestion-manual/crear');
    return season;
}

/**
 * Adds a list of teams to a specific season.
 * It checks for existing teams to avoid duplicates.
 * @param {number} seasonId - The ID of the season to add teams to.
 * @param {number[]} teamIds - An array of team IDs to add to the season.
 * @returns {Promise<void>} A promise that resolves when the teams have been added.
 * @throws {Error} If the teams are already in the season or if the operation fails.
 */
export async function addTeamsToSeason(seasonId: number, teamIds: number[]): Promise<void> {
    const existingTeams = await prisma.seasonTeam.findMany({
        where: {
            seasonId,
            teamId: { in: teamIds },
        },
        select: {
            teamId: true,
        },
    });

    const existingTeamIds = new Set(existingTeams.map(t => t.teamId));
    const newTeamIds = teamIds.filter(id => !existingTeamIds.has(id));

    if (newTeamIds.length === 0) {
        throw new Error('Todos los equipos seleccionados ya están en esta temporada.');
    }

    const dataToCreate = newTeamIds.map(teamId => ({
        seasonId,
        teamId,
        position: 0,
        points: 0,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
    }));

    await prisma.seasonTeam.createMany({
        data: dataToCreate,
    });

    revalidatePath('/gestion/temporadas');
    revalidatePath('/gestion/gestion-manual/crear');
}


/**
 * Retrieves all teams from the database.
 * This function is a re-export from `team-actions.ts` to avoid code duplication.
 * @returns {Promise<Team[]>} A promise that resolves to an array of all teams.
 */
export const getAllTeams = cache(async (): Promise<Team[]> => {
    return (await prisma.team.findMany({
        orderBy: {
            name: 'asc'
        },
        include: {
            players: true
        }
    })) as Team[];
});


    