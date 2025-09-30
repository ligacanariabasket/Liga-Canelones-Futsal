

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { FullMatch, Team } from "@/types"
import { createMatch } from "@/actions/match-actions"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

const createMatchSchema = z.object({
  teamAId: z.string().min(1, "Debe seleccionar el equipo local"),
  teamBId: z.string().min(1, "Debe seleccionar el equipo visitante"),
  scheduledDate: z.date({
    required_error: "Debe seleccionar una fecha.",
  }),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)."),
  round: z.coerce.number().min(1, "La jornada debe ser al menos 1"),
}).refine(data => data.teamAId !== data.teamBId, {
    message: "Los equipos no pueden ser los mismos",
    path: ["teamBId"],
});

type CreateMatchFormValues = z.infer<typeof createMatchSchema>

interface CreateMatchFormProps {
    teams: Team[];
    seasonId: number;
    onMatchCreated: (newMatch: FullMatch) => void;
}

export function CreateMatchForm({ teams, seasonId, onMatchCreated }: CreateMatchFormProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreateMatchFormValues>({
        resolver: zodResolver(createMatchSchema),
        defaultValues: {
            teamAId: '',
            teamBId: '',
            scheduledDate: new Date(),
            scheduledTime: '19:00',
            round: 1,
        },
    });

    useEffect(() => {
        form.reset({
            teamAId: '',
            teamBId: '',
            scheduledDate: new Date(),
            scheduledTime: '19:00',
            round: 1,
        });
    }, [seasonId, form]);
    
    const teamAId = form.watch("teamAId");

    async function onSubmit(values: CreateMatchFormValues) {
        setIsSubmitting(true)
        try {
            const [hours, minutes] = values.scheduledTime.split(':').map(Number);
            const combinedDateTime = new Date(values.scheduledDate);
            combinedDateTime.setHours(hours, minutes);

            const newMatch = await createMatch({
                teamAId: parseInt(values.teamAId),
                teamBId: parseInt(values.teamBId),
                scheduledTime: combinedDateTime,
                round: values.round,
                seasonId: seasonId,
            })
            toast({
                title: "Partido Creado",
                description: "El nuevo partido ha sido programado exitosamente.",
            })
            
            // This now receives the full match object from the action
            onMatchCreated(newMatch);

            form.reset({ round: 1, teamAId: '', teamBId: '', scheduledDate: new Date(), scheduledTime: '19:00' })
        } catch {
             toast({
                variant: "destructive",
                title: "Error al crear partido",
                description: "No se pudo crear el partido. Por favor, intente de nuevo.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="teamAId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Equipo Local</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione un equipo" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {teams.map(team => (
                                        <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                    <FormField
                    control={form.control}
                    name="teamBId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Equipo Visitante</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!teamAId}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione un equipo" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {teams.filter(team => String(team.id) !== teamAId).map(team => (
                                        <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="scheduledDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Seleccione una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="scheduledTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hora</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                    control={form.control}
                    name="round"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jornada</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Número de jornada" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" disabled={isSubmitting || teams.length < 2} className="w-full">
                    {isSubmitting ? 'Creando...' : 'Crear Partido'}
                </Button>
            </form>
        </Form>
    )
}
