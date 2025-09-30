
'use server';
/**
 * @fileOverview Flow to generate a match chronicle.
 *
 * - generateMatchChronicleFlow - A function that handles the chronicle generation.
 * - GenerateMatchChronicleInput - The input type for the function.
 * - GenerateMatchChronicleOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateMatchChronicleInputSchema,
  GenerateMatchChronicleOutputSchema,
  type GenerateMatchChronicleInput,
  type GenerateMatchChronicleOutput,
} from '@/types/genkit-types';

export async function generateMatchChronicleFlow(
  input: GenerateMatchChronicleInput
): Promise<GenerateMatchChronicleOutput> {
  return generateChronicleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMatchChroniclePrompt',
  input: { schema: GenerateMatchChronicleInputSchema },
  output: { schema: GenerateMatchChronicleOutputSchema },
  prompt: `
        You are an expert sports journalist specializing in Futsal for "Liga Canaria Futsal". Your task is to write a compelling and professional match chronicle.

        ## Match Details
        - **Match ID:** {{{matchId}}}
        - **Teams:** {{{teamA.name}}} vs {{{teamB.name}}}
        - **Final Score:** {{{teamA.name}}} {{{scoreA}}} - {{{scoreB}}} {{{teamB.name}}}

        ## Key Events (in chronological order)
        You have the following list of key events from the match. Use them to construct your narrative.
        {{#each events}}
        - **{{timeDescription}}**: {{type}} - {{#if playerName}}{{playerName}} ({{teamName}}){{else}}{{teamName}}{{/if}}{{#if playerInName}} for {{playerInName}}{{/if}}
        {{/each}}
        
        ## Available Images
        You can use any of the following image paths in your chronicle body.
        {{#each imageStructure}}
        - {{this}}
        {{/each}}

        ## Instructions

        ### 1. Chronicle Body (chronicleBody)
        - Write an engaging journalistic-style narrative of the match.
        - Start with a strong opening paragraph summarizing the result and the general tone of the match.
        - Develop the body by describing key moments, turning points, goals, and standout performances, using the provided event list.
        - Maintain a professional and exciting tone suitable for a sports news outlet.
        - The body should be between 200 and 350 words.
        - Format the content in **Markdown**.
        - MUST include exactly two Markdown images from the available image list, using the format \`![Image description](/path/to/image.jpg)\`.
        - The first image MUST be related to the winning team.
        - The second image MUST be related to the standout player of the match, regardless of whether their team won or lost.

        ### 2. Match Stats Summary (matchStatsSummary)
        - Create a concise summary of the most important statistics in Markdown list format.
        - Include 2 to 4 key statistics that tell the story of the match (e.g., top scorer, most influential player, key tactical observation).
        - After the list, add a separator '---' and then include a promotional line for the league, like "¡Sigue toda la emoción en Liga Canaria Futsal!".
        - The summary MUST end with the league banner image on a new line: \`![Banner de la Liga](/optimas/banner_youtube.webp)\`.
        
        ### 3. Title (title)
        - Create a simple, direct, and impactful title for the chronicle. Example: 'Victoria Agónica de [Winning Team] sobre [Losing Team]'.

        Now, generate the 'title', 'chronicleBody', and 'matchStatsSummary' based on the provided data.
    `,
});


const generateChronicleFlow = ai.defineFlow(
  {
    name: 'generateChronicleFlow',
    inputSchema: GenerateMatchChronicleInputSchema,
    outputSchema: GenerateMatchChronicleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate chronicle from the LLM.');
    }
    return output;
  }
);
