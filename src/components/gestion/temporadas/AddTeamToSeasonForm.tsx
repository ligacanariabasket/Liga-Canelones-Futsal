
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Season, Team } from "@prisma/client"
import { addTeamsToSeason } from "@/actions/season-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

const addTeamToSeasonSchema = z.object({
  seasonId: z.string().min(1, "Debe seleccionar una temporada"),
  teamIds: z.array(z.number()).min(1, "Debe seleccionar al menos un equipo."),
});

type AddTeamToSeasonFormValues = z.infer<typeof addTeamToSeasonSchema>

interface AddTeamToSeasonFormProps {
    seasons: (Season & { teams: { teamId: number }[] })[];
    teams: Team[];
}

export function AddTeamToSeasonForm({ seasons, teams }: AddTeamToSeasonFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');

    const form = useForm<AddTeamToSeasonFormValues>({
        resolver: zodResolver(addTeamToSeasonSchema),
        defaultValues: {
            seasonId: '',
            teamIds: [],
        },
    });

    const selectedSeason = seasons.find(s => s.id === parseInt(selectedSeasonId, 10));
    const teamsInSeason = selectedSeason?.teams.map(t => t.teamId) || [];
    const availableTeams = teams.filter(t => !teamsInSeason.includes(t.id));
    
    async function onSubmit(values: AddTeamToSeasonFormValues) {
        setIsSubmitting(true)
        try {
            await addTeamsToSeason(parseInt(values.seasonId), values.teamIds);
            
            toast({
                title: "Equipos Añadidos",
                description: "Los equipos han sido añadidos a la temporada exitosamente.",
            })
            form.reset({ seasonId: values.seasonId, teamIds: []});
            router.refresh()
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "No se pudo añadir los equipos. Por favor, intente de nuevo.";
             toast({
                variant: "destructive",
                title: "Error al añadir equipos",
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="seasonId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Temporada</FormLabel>
                                    <Select 
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedSeasonId(value);
                                            form.setValue('teamIds', []); // Reset team selection
                                        }} 
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Seleccione una temporada" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {seasons.map(season => (
                                                <SelectItem key={season.id} value={String(season.id)}>{season.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {selectedSeasonId && (
                             <FormField
                                control={form.control}
                                name="teamIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Equipos Disponibles</FormLabel>
                                            <FormDescription>
                                                Seleccione los equipos para añadir a la temporada.
                                            </FormDescription>
                                        </div>
                                         <div className="flex items-center space-x-2 pb-2 border-b">
                                            <Checkbox
                                                id="select-all-teams"
                                                checked={field.value.length === availableTeams.length && availableTeams.length > 0}
                                                onCheckedChange={(checked) => {
                                                    form.setValue('teamIds', checked ? availableTeams.map(t => t.id) : [])
                                                }}
                                            />
                                            <label
                                                htmlFor="select-all-teams"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Seleccionar todos
                                            </label>
                                        </div>
                                        <ScrollArea className="h-72 w-full rounded-md border">
                                            <div className="p-4 space-y-2">
                                                {availableTeams.length > 0 ? availableTeams.map((team) => (
                                                    <FormField
                                                        key={team.id}
                                                        control={form.control}
                                                        name="teamIds"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={team.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(team.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                ? field.onChange([...field.value, team.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                    (value) => value !== team.id
                                                                                    )
                                                                                )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal w-full cursor-pointer">
                                                                        {team.name}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                )) : (
                                                    <p className="text-sm text-muted-foreground text-center">No hay más equipos para añadir a esta temporada.</p>
                                                )}
                                            </div>
                                        </ScrollArea>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                        )}
                        
                        <Button type="submit" disabled={isSubmitting || !selectedSeasonId || form.watch('teamIds').length === 0} className="w-full">
                            {isSubmitting ? 'Añadiendo...' : 'Añadir Equipos Seleccionados'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
