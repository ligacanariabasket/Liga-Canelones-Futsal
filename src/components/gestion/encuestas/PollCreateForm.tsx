
'use client';

import * as React from "react";
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPoll } from '@/actions/poll-actions';
import { PollType } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { MatchesForSelect } from '@/actions/match-actions';
import { PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the schema here for client-side validation
const formSchema = z.object({
  question: z.string().min(1, 'La pregunta es obligatoria.'),
  type: z.nativeEnum(PollType),
  matchId: z.string().optional(),
  options: z.array(
    z.object({
      text: z.string().min(1, 'El texto de la opción es obligatorio.'),
      playerId: z.number().optional(),
    })
  ).min(2, 'Se requieren al menos 2 opciones.'),
});

type FormValues = z.infer<typeof formSchema>;

interface PollCreateFormProps {
  matches: MatchesForSelect;
}

export function PollCreateForm({ matches }: PollCreateFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = React.useState<'teamA' | 'teamB' | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      type: PollType.OTHER,
      options: [{ text: '' }, { text: '' }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const pollType = form.watch('type');
  const matchId = form.watch('matchId');

  React.useEffect(() => {
    // When poll type changes, reset options
    if (pollType === PollType.OTHER) {
      replace([{ text: '' }, { text: '' }]);
    } else {
      replace([]);
    }
    // Also reset sub-selections
    setSelectedTeam(null);
    setSelectedPlayerId('');
  }, [pollType, replace]);

  React.useEffect(() => {
    // When match changes, reset sub-selections
    setSelectedTeam(null);
    setSelectedPlayerId('');
  }, [matchId]);

  const selectedMatch = React.useMemo(() => {
    return matches.find(m => m.id === parseInt(matchId || '0', 10));
  }, [matchId, matches]);

  const playersOfSelectedTeam = React.useMemo(() => {
    if (!selectedMatch || !selectedTeam) return [];
    return selectedTeam === 'teamA' ? selectedMatch.teamA.players : selectedMatch.teamB.players;
  }, [selectedMatch, selectedTeam]);

  const handleAddPlayer = () => {
    const player = playersOfSelectedTeam.find(p => String(p.id) === selectedPlayerId);
    if (player) {
      // Avoid adding duplicates
      if (fields.some(field => field.playerId === player.id)) {
        toast({ title: "Jugador ya añadido", variant: "destructive" });
        return;
      }
      append({ text: player.name, playerId: player.id });
      setSelectedPlayerId(''); // Reset for next selection
    }
  };


  async function onSubmit(data: FormValues) {
    const pollData = {
      ...data,
      matchId: data.matchId ? parseInt(data.matchId, 10) : undefined,
    };

    const result = await createPoll(pollData);

    if (result?.errors) {
      toast({
        title: 'Error de Validación',
        description: result.message,
        variant: 'destructive',
      });
    } else if (result?.message.startsWith('Error')) {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    else {
      toast({
        title: 'Éxito',
        description: 'La encuesta ha sido creada exitosamente.',
      });
      router.push('/gestion/encuestas');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pregunta de la Encuesta</FormLabel>
              <FormControl>
                <Input placeholder="Ej: ¿Quién fue el jugador del partido?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Encuesta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(PollType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'PLAYER_OF_THE_MATCH' ? 'Jugador del Partido' : 'Otro'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {pollType === PollType.PLAYER_OF_THE_MATCH && (
          <FormField
            control={form.control}
            name="matchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asociar a un Partido Finalizado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un partido" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {matches.map((match) => (
                      <SelectItem key={match.id} value={String(match.id)}>
                        {`${new Date(match.scheduledTime).toLocaleDateString()} - ${match.teamA.name} vs ${match.teamB.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {pollType === 'PLAYER_OF_THE_MATCH' && selectedMatch && (
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                 <FormItem className="sm:col-span-1">
                     <FormLabel>Equipo</FormLabel>
                     <Select onValueChange={(value: 'teamA' | 'teamB') => setSelectedTeam(value)}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un equipo" />
                            </SelectTrigger>
                        </FormControl>
                         <SelectContent>
                            <SelectItem value="teamA">{selectedMatch.teamA.name}</SelectItem>
                            <SelectItem value="teamB">{selectedMatch.teamB.name}</SelectItem>
                         </SelectContent>
                     </Select>
                 </FormItem>
                 <FormItem className="sm:col-span-1">
                     <FormLabel>Jugador</FormLabel>
                      <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId} disabled={!selectedTeam}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un jugador" />
                            </SelectTrigger>
                        </FormControl>
                         <SelectContent>
                             {playersOfSelectedTeam.map(player => (
                                <SelectItem key={player.id} value={String(player.id)}>{player.name}</SelectItem>
                             ))}
                         </SelectContent>
                     </Select>
                 </FormItem>
                 <Button type="button" onClick={handleAddPlayer} disabled={!selectedPlayerId} className="sm:col-span-1">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Jugador
                 </Button>
             </div>
        )}

        <div>
          <FormLabel>Opciones</FormLabel>
          <div className={cn("space-y-4 pt-2", fields.length === 0 && "py-10 border-2 border-dashed rounded-lg flex items-center justify-center")}>
            {fields.length > 0 ? fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`options.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input {...field} placeholder={`Opción ${index + 1}`} readOnly={pollType === PollType.PLAYER_OF_THE_MATCH} />
                      </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )) : (
                 <p className="text-sm text-muted-foreground">Añade opciones a tu encuesta.</p>
            )}
          </div>
          {pollType === PollType.OTHER && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ text: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Opción
            </Button>
          )}
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Creando...' : 'Crear Encuesta'}
        </Button>
      </form>
    </Form>
  );
}

