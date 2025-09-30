
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
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Team } from "@/types"
import { createPlayer } from "@/actions/player-actions"

const createPlayerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  number: z.coerce.number().min(0, "El número no puede ser negativo"),
  position: z.enum(["GOLERO", "DEFENSA", "ALA", "PIVOT"]),
  teamId: z.string().min(1, "Debe seleccionar un equipo"),
  avatarUrl: z.string().optional(),
  nationality: z.string().optional(),
  birthDate: z.date().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
});

type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>

interface CreatePlayerFormProps {
    teams: Team[];
    defaultTeamId?: number;
}

export function CreatePlayerForm({ teams, defaultTeamId }: CreatePlayerFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreatePlayerFormValues>({
        resolver: zodResolver(createPlayerSchema),
        defaultValues: {
            name: '',
            number: 0,
            position: "ALA",
            teamId: defaultTeamId ? String(defaultTeamId) : '',
            avatarUrl: '',
            nationality: 'URU',
        },
    });

    useEffect(() => {
        if (defaultTeamId) {
            form.setValue('teamId', String(defaultTeamId));
        }
    }, [defaultTeamId, form]);
    
    async function onSubmit(values: CreatePlayerFormValues) {
        setIsSubmitting(true)
        try {
            await createPlayer(values);
            toast({
                title: "Jugador Creado",
                description: `El jugador ${values.name} ha sido creado exitosamente.`,
            })
            form.reset({
                name: '',
                number: 0,
                position: 'ALA',
                teamId: defaultTeamId ? String(defaultTeamId) : '',
                avatarUrl: '',
                nationality: 'URU',
                birthDate: undefined,
                height: undefined,
                weight: undefined
            })
            router.refresh()
        } catch(error) {
             const errorMessage = error instanceof Error ? error.message : "No se pudo crear el jugador.";
             toast({
                variant: "destructive",
                title: "Error al crear jugador",
                description: errorMessage,
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Jugador</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Juan Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Equipo</FormLabel>
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
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Posición</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Seleccione una posición" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="GOLERO">Golero</SelectItem>
                                        <SelectItem value="DEFENSA">Defensa</SelectItem>
                                        <SelectItem value="ALA">Ala</SelectItem>
                                        <SelectItem value="PIVOT">Pivot</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nacionalidad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: URU" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha de Nacimiento</FormLabel>
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
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Elige una fecha</span>
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
                                        disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Altura (cm)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Ej: 180" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Peso (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Ej: 80" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Creando...' : 'Crear Jugador'}
                </Button>
            </form>
        </Form>
    )
}
