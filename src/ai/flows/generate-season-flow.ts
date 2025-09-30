
'use server';
/**
 * @fileOverview Flow para generar una temporada completa, incluyendo equipos y fixture.
 * 
 * - createSeasonAndTeams - Asocia equipos a una temporada.
 * - generateFixtureForSeason - Genera el calendario de partidos para una temporada.
 */

import { ai } from '@/ai/genkit';
import prisma from '../../lib/prisma';
import { generateFixture } from '@/actions/match-actions';
import { z } from 'zod';
import type { CreateSeasonAndTeamsInput, GenerateFixtureForSeasonInput } from '@/types/genkit-types';
import { CreateSeasonAndTeamsInputSchema, GenerateFixtureForSeasonInputSchema } from '@/types/genkit-types';



// --- Flow to create season and teams ---

export async function createSeasonAndTeams(input: CreateSeasonAndTeamsInput) {
    return createSeasonAndTeamsFlow(input);
}

const createSeasonAndTeamsFlow = ai.defineFlow(
    {
        name: 'createSeasonAndTeamsFlow',
        inputSchema: CreateSeasonAndTeamsInputSchema,
        outputSchema: z.void(),
    },
    async (input) => {
        await prisma.seasonTeam.createMany({
            data: input.teams.map((team, index) => ({
                seasonId: input.seasonId,
                teamId: team.id,
                position: index + 1, 
                points: 0,
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
            })),
            skipDuplicates: true,
        });
    }
);


// --- Flow to generate fixture for an existing season ---

export async function generateFixtureForSeason(input: GenerateFixtureForSeasonInput) {
  return generateFixtureForSeasonFlow(input);
}

const generateFixtureForSeasonFlow = ai.defineFlow(
  {
    name: 'generateFixtureForSeasonFlow',
    inputSchema: GenerateFixtureForSeasonInputSchema,
    outputSchema: z.object({ matchCount: z.number() }),
  },
  async (input) => {
    const { count } = await generateFixture(input.seasonId, input.teams.map(t => t.id));
    return {
      matchCount: count,
    };
  }
);
