
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { Season } from '@prisma/client';
import { createSeason } from '@/actions/season-actions';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(5, { message: 'El nombre debe tener al menos 5 caracteres.' }),
});

interface CreateSeasonFormProps {
  onSeasonCreated: (season: Season) => void;
  isDisabled: boolean;
}

export function CreateSeasonForm({ onSeasonCreated, isDisabled }: CreateSeasonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `Temporada ${new Date().getFullYear()}`,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const newSeason = await createSeason(values.name, new Date().getFullYear());
      toast({
        title: 'Temporada Creada',
        description: `La temporada "${newSeason.name}" ha sido creada. Ahora, selecciona los equipos.`,
      });
      onSeasonCreated(newSeason);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo crear la temporada.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Temporada</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Torneo Apertura 2024" {...field} disabled={isDisabled || isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isDisabled || isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Creando...' : 'Crear y Continuar'}
        </Button>
      </form>
    </Form>
  );
}
