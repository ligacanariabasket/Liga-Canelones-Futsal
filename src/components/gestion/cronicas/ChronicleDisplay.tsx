
'use client';

import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Copy, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlogContent } from '@/components/blog/BlogContent';

interface ChronicleDisplayProps {
  chronicle: GenerateMatchChronicleOutput;
  onSave: () => void;
  isSaving: boolean;
}

export function ChronicleDisplay({ chronicle, onSave, isSaving }: ChronicleDisplayProps) {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    const textToCopy = `
      # ${chronicle.title}

      ${chronicle.chronicleBody}

      ## Números del Partido
      ${chronicle.matchStatsSummary}
    `.replace(/  +/g, ' ').trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({ title: 'Copiado', description: 'Crónica copiada al portapapeles.' });
    }).catch(() => {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo copiar la crónica.' });
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle>{chronicle.title}</CardTitle>
            <CardDescription>Crónica generada por Liga Canaria Futsal</CardDescription>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                <Copy className="h-4 w-4" />
           </Button>
           <Button onClick={onSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar Crónica'}
           </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <BlogContent content={chronicle.chronicleBody} />
        
        <div className="not-prose">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
                <ListChecks className="h-5 w-5" />
                Números del Partido
            </h3>
            <BlogContent content={chronicle.matchStatsSummary} />
        </div>
      </CardContent>
    </Card>
  );
}
