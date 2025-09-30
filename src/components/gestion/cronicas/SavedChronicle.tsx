
'use client';

import type { MatchChronicle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookCheck, ListChecks } from 'lucide-react';
import { BlogContent } from '@/components/blog/BlogContent';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';

interface SavedChronicleProps {
    chronicle: MatchChronicle;
}

export function SavedChronicle({ chronicle }: SavedChronicleProps) {
    let finalChronicle: GenerateMatchChronicleOutput | null = null;

    try {
        if (chronicle && chronicle.chronicle && typeof chronicle.chronicle === 'object') {
            const chronicleData = chronicle.chronicle as { finalChronicle?: any };
            if (chronicleData.finalChronicle) {
                if (typeof chronicleData.finalChronicle === 'string') {
                    finalChronicle = JSON.parse(chronicleData.finalChronicle);
                } else {
                    finalChronicle = chronicleData.finalChronicle;
                }
            }
        }
    } catch (e) {
        console.error("Failed to parse finalChronicle JSON:", e);
    }
    
    if (!finalChronicle) {
        return null;
    }

    const summaryString = Array.isArray(finalChronicle.matchStatsSummary) 
        ? finalChronicle.matchStatsSummary.join('\n\n')
        : finalChronicle.matchStatsSummary;

    return (
        <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                    <BookCheck className="h-5 w-5" />
                    Cronica Guardada
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                    Esta es la ultima version de la cronica guardada para este partido.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 prose prose-sm dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-primary not-prose">{finalChronicle.title}</h2>
                <BlogContent content={finalChronicle.chronicleBody} />

                <div className="not-prose">
                    <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
                        <ListChecks className="h-5 w-5" />
                        Numeros del Partido
                    </h3>
                    <BlogContent content={summaryString} />
                </div>
            </CardContent>
        </Card>
    );
}
