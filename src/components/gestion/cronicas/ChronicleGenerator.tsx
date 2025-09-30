
'use client';

import { useState } from 'react';
import type { FullMatch } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateAndSaveChronicleAction } from '@/actions/chronicle-actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ChronicleGeneratorProps {
  match: FullMatch;
  hasExistingChronicle: boolean;
}

export function ChronicleGenerator({ match, hasExistingChronicle }: ChronicleGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAndSaveChronicleAction({ matchId: match.id });
      if (result.success) {
        toast({ title: 'Crónica Generada y Guardada', description: 'La crónica ha sido creada y guardada en la base de datos.' });
        router.refresh();
      } else {
        throw new Error(result.error || 'El flujo de la IA no se completó exitosamente.');
      }
    } catch (e) {
      const error = e as Error;
      toast({ variant: 'destructive', title: 'Error al generar la crónica', description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generador de Crónica Final</CardTitle>
          <CardDescription>
            {hasExistingChronicle
              ? 'Ya existe una crónica guardada. Puedes generar una nueva versión para sobreescribirla.'
              : 'Usa la IA para analizar todos los eventos del partido y generar una crónica profesional.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between p-6 text-center">
            <div className="flex flex-col items-center gap-2">
                <Image src={match.teamA.logoUrl || ''} alt={match.teamA.name} width={64} height={64} className="rounded-full" />
                <span className="font-semibold">{match.teamA.name}</span>
            </div>
            <span className="text-4xl font-bold">{match.scoreA} - {match.scoreB}</span>
             <div className="flex flex-col items-center gap-2">
                <Image src={match.teamB.logoUrl || ''} alt={match.teamB.name} width={64} height={64} className="rounded-full" />
                <span className="font-semibold">{match.teamB.name}</span>
            </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
          <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Generando...' : (hasExistingChronicle ? 'Regenerar y Guardar' : 'Generar y Guardar Crónica')}
          </Button>
          {match.events.length === 0 && (
            <p className="text-sm text-destructive mt-2">Este partido no tiene eventos registrados. No se puede generar una crónica.</p>
          )}
      </div>

      {isGenerating && (
          <div className="text-center flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>El cronista experto está analizando el partido... Esto puede tardar un momento.</p>
          </div>
      )}
    </div>
  );
}
