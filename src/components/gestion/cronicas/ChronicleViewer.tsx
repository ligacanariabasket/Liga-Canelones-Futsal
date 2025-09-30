
'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { BlogContent } from '@/components/blog/BlogContent';
import { ListChecks } from 'lucide-react';
import Image from 'next/image';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';
import type { MatchChronicle } from '@/types';

// Define a type for the Instagram embed script object on the window
interface Instgrm {
    Embeds: {
        process: () => void;
    };
}

type ChronicleJson = GenerateMatchChronicleOutput & {
    instagramEmbed?: string;
}

interface ChronicleViewerProps {
    chronicle: MatchChronicle;
}

export function ChronicleViewer({ chronicle }: ChronicleViewerProps) {
    let finalChronicle: ChronicleJson | null = null;

    try {
      if (chronicle && chronicle.chronicle && typeof chronicle.chronicle === 'object') {
          const chronicleObject = chronicle.chronicle as { finalChronicle?: any };
           if (chronicleObject.finalChronicle) {
                if (typeof chronicleObject.finalChronicle === 'string') {
                    finalChronicle = JSON.parse(chronicleObject.finalChronicle);
                } else {
                    finalChronicle = chronicleObject.finalChronicle;
                }
            }
      }
    } catch (e) {
        console.error("Failed to parse chronicle JSON:", e);
    }
    
    const instagramEmbed = finalChronicle?.instagramEmbed;

    useEffect(() => {
        // This script is responsible for processing Instagram embeds.
        const processInstagramEmbeds = () => {
            const instgrm = (window as Window & { instgrm?: Instgrm }).instgrm;
            if (instgrm) {
                instgrm.Embeds.process();
            }
        };


        if (instagramEmbed) {
            // Check if the Instagram script is already on the page
            if (document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
                processInstagramEmbeds();
            } else {
                // If not, create and append it
                const script = document.createElement('script');
                script.async = true;
                script.src = "//www.instagram.com/embed.js";
                script.onload = () => {
                    processInstagramEmbeds();
                };
                document.body.appendChild(script);

                // Cleanup function to remove script if component unmounts
                return () => {
                    if (document.body.contains(script)) {
                        document.body.removeChild(script);
                    }
                }
            }
        }
    }, [instagramEmbed]);

    if (!finalChronicle) {
        return <p className="text-destructive text-center">Error al cargar la cronica. El formato de los datos puede ser incorrecto.</p>;
    }


    return (
        <Card>
            <CardHeader>
                 <CardDescription>
                    <div className="flex items-center gap-2">
                        <Image src="/logofu.png" alt="Logo de la Liga" width={20} height={20} />
                        <span>Cronica generada por Liga Canaria Futsal</span>
                    </div>
                 </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <BlogContent content={finalChronicle.chronicleBody} />

                <div className="not-prose">
                    <h3 className="font-bold text-xl text-primary flex items-center gap-2 mb-4">
                        <ListChecks className="h-5 w-5" />
                        Numeros del Partido
                    </h3>
                    <BlogContent content={finalChronicle.matchStatsSummary} />
                </div>
                
                 {finalChronicle.instagramEmbed && (
                    <div className="not-prose flex justify-center my-6">
                         <div dangerouslySetInnerHTML={{ __html: finalChronicle.instagramEmbed }} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
