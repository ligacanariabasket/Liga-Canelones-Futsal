
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { updateMatchChronicle } from '@/actions/match-actions';
import { Loader2, Save, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BlogContent } from '@/components/blog/BlogContent';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';
import { getChronicleByMatchId } from '@/actions/match-actions';

const editChronicleSchema = z.object({
  title: z.string().min(5, 'El titulo es requerido.'),
  chronicleBody: z.string().min(50, 'El cuerpo de la cronica es requerido.'),
  matchStatsSummary: z.string().min(1, 'Debe haber al menos un punto en el resumen.'),
  instagramEmbed: z.string().optional(),
});

type EditChronicleFormValues = z.infer<typeof editChronicleSchema>;

interface EditChronicleFormProps {
  initialChronicleData: GenerateMatchChronicleOutput;
  chronicleId: number;
  matchId: number;
}

export function EditChronicleForm({ initialChronicleData, chronicleId, matchId }: EditChronicleFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summaryString = Array.isArray(initialChronicleData.matchStatsSummary) 
        ? initialChronicleData.matchStatsSummary.join('\n')
        : String(initialChronicleData.matchStatsSummary || '');

  const form = useForm<EditChronicleFormValues>({
    resolver: zodResolver(editChronicleSchema),
    defaultValues: {
      title: initialChronicleData.title || '',
      chronicleBody: initialChronicleData.chronicleBody || '',
      matchStatsSummary: summaryString,
      instagramEmbed: (initialChronicleData as any).instagramEmbed || '',
    },
  });

  const watchedValues = form.watch();

  async function onSubmit(values: EditChronicleFormValues) {
    setIsSubmitting(true);
    try {
      const existingChronicle = await getChronicleByMatchId(matchId);
      const currentChronicleData = (existingChronicle?.chronicle as any) || { partialChronicles: [], finalChronicle: null };

      const updatedFinalChronicle = {
        title: values.title,
        chronicleBody: values.chronicleBody,
        matchStatsSummary: values.matchStatsSummary,
        instagramEmbed: values.instagramEmbed,
      };

      const updatedChroniclePayload = {
          ...currentChronicleData,
          finalChronicle: updatedFinalChronicle
      };
      
      await updateMatchChronicle(chronicleId, updatedChroniclePayload);

      toast({
        title: 'Cronica Actualizada',
        description: 'La cronica ha sido actualizada exitosamente.',
      });
      router.push(`/gestion/cronicas/${matchId}`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo actualizar la cronica.';
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Editor de Contenido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Titulo</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Equipo A vence a Equipo B" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        <FormField
                        control={form.control}
                        name="chronicleBody"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cuerpo de la Cronica (Markdown)</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="La narrativa principal del partido..."
                                className="min-h-[300px] font-mono"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        <FormField
                        control={form.control}
                        name="matchStatsSummary"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Resumen y Cierre (Markdown)</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Un punto estadistico por linea..."
                                className="min-h-[150px] font-mono"
                                {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Cada linea de texto se convertira en un punto de la lista de resumen.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="instagramEmbed"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Incrustar Instagram (Embed Code)</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder='Pega aqui el codigo "embed" de Instagram...'
                                className="min-h-[120px] font-mono text-xs"
                                {...field}
                                />
                            </FormControl>
                             <FormDescription>
                                Opcional. Pega el codigo de insercion completo de una publicacion de Instagram.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card className="sticky top-24 h-fit">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        Vista Previa
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                        <h1>{watchedValues.title}</h1>
                        <BlogContent content={watchedValues.chronicleBody} />
                        <h3>Numeros del Partido</h3>
                        <BlogContent content={watchedValues.matchStatsSummary} />
                    </div>
                     {watchedValues.instagramEmbed && (
                        <div className="mt-6" dangerouslySetInnerHTML={{ __html: watchedValues.instagramEmbed }} />
                     )}
                </CardContent>
            </Card>
        </div>

        <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-40">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
