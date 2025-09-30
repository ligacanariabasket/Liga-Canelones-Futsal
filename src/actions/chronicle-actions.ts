
'use server';

import { generateMatchChronicleFlow } from '@/ai/flows/generate-match-chronicle-flow';
import { z } from 'zod';
import { getMatchForChronicle, getOrCreateMatchChronicle, updateMatchChronicle } from '@/actions/match-actions';
import { revalidatePath } from 'next/cache';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';
import { imageFileStructure } from '@/data/imagenesdata';
import type { GameEvent } from '@/types';

const GenerateChronicleInputSchema = z.object({ 
    matchId: z.number() 
});

const formatTimeFromTimestamp = (event: GameEvent) => {
    const { timestamp, type } = event;
    const gameDurationPerPeriod = 1200; // 20 mins in seconds

    if (type === 'MATCH_END') return "Final del partido";
    if (type === 'MATCH_START') return "Inicio del partido";
    if (type === 'PERIOD_START') return "Inicio del segundo tiempo";

    let period = 1;
    let secondsIntoPeriod = 0;
    
    if (timestamp > gameDurationPerPeriod) {
        secondsIntoPeriod = timestamp - gameDurationPerPeriod;
        period = 1;
    } else {
        secondsIntoPeriod = gameDurationPerPeriod - timestamp;
        period = 2;
    }
    
    const minute = Math.floor(secondsIntoPeriod / 60);

    return `Minuto ${minute} del ${period === 1 ? '1er' : '2do'} tiempo`;
};

/**
 * Acción de Servidor para generar y guardar la crónica completa de un partido.
 */
export async function generateAndSaveChronicleAction(input: z.infer<typeof GenerateChronicleInputSchema>): Promise<{ success: boolean; chronicle?: GenerateMatchChronicleOutput, error?: string }> {
    const parseResult = GenerateChronicleInputSchema.safeParse(input);
    if (!parseResult.success) {
        return { success: false, error: "Input inválido." };
    }

    const { matchId } = parseResult.data;

    try {
        const match = await getMatchForChronicle(matchId);
        if (!match) throw new Error(`Partido con ID ${matchId} no encontrado.`);
        
        if (match.events.length === 0) {
            throw new Error("No hay eventos registrados para este partido. No se puede generar la crónica.");
        }

        const eventsWithDescription = match.events.map(event => ({
            ...event,
            timeDescription: formatTimeFromTimestamp(event)
        }));

        const finalChronicle = await generateMatchChronicleFlow({
            matchId: match.id,
            teamA: { id: match.teamA.id, name: match.teamA.name },
            teamB: { id: match.teamB.id, name: match.teamB.name },
            scoreA: match.scoreA || 0,
            scoreB: match.scoreB || 0,
            events: eventsWithDescription,
            imageStructure: imageFileStructure,
        });
        
        if (!finalChronicle) {
            throw new Error("La IA no pudo generar la crónica final.");
        }
        
        const chronicleDbEntry = await getOrCreateMatchChronicle(matchId, match.teamA.id);

        const newChronicleData = {
            partialChronicles: [], // Clear partials as they are no longer needed
            finalChronicle: finalChronicle,
        };

        await updateMatchChronicle(chronicleDbEntry.id, newChronicleData);

        revalidatePath(`/gestion/cronicas/${matchId}`);
        revalidatePath(`/gestion/cronicas/${matchId}/ver`);

        return { success: true, chronicle: finalChronicle };

    } catch (error) {
        console.error(`Error en generateAndSaveChronicleAction para el partido ${matchId}:`, error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al generar la crónica.";
        return { success: false, error: errorMessage };
    }
}
