
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { GameEvent } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Code2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MatchEventsJsonProps {
    events: GameEvent[];
}

export function MatchEventsJson({ events }: MatchEventsJsonProps) {
    const { toast } = useToast();
    const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que el acordeón se abra/cierre
        const jsonString = JSON.stringify(sortedEvents, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            toast({
                title: "Copiado",
                description: "Los eventos del partido (JSON) han sido copiados al portapapeles.",
            });
        }).catch(err => {
            console.error("Error al copiar:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo copiar el contenido.",
            });
        });
    };

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <div className="flex items-center justify-between w-full pr-2">
                    <AccordionTrigger className="flex-grow">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" />
                            <span>Ver Eventos del Partido (JSON)</span>
                        </div>
                    </AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 ml-2 shrink-0">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <AccordionContent>
                    <Card className="bg-muted/50">
                        <CardContent className="p-4">
                            <pre className="text-xs overflow-x-auto p-4 bg-background rounded-md">
                                {JSON.stringify(sortedEvents, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
