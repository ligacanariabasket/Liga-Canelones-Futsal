
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
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
import type { Player, Team } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllTeams } from "@/actions/team-actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updatePlayer } from "@/actions/player-actions"


const editPlayerSchema = z.object({
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


type EditPlayerFormValues = z.infer<typeof editPlayerSchema>

interface EditPlayerSheetProps {
    player: Player & { team: Team };
    isOpen: boolean;
    onClose: () => void;
}

export function EditPlayerSheet({ player, isOpen, onClose }: EditPlayerSheetProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [teams, setTeams] = useState<Team[]>([]);

     useEffect(() => {
        getAllTeams().then(setTeams);
    }, []);

    const defaultAvatarUrl = player.avatarUrl || (player.team ? `/equipos/jugadores_individuales/avatar_${player.team.slug}.png` : '');

    const form = useForm<EditPlayerFormValues>({
        resolver: zodResolver(editPlayerSchema),
        defaultValues: {
            name: player.name,
            number: player.number,
            position: player.position,
            teamId: String(player.teamId),
            avatarUrl: defaultAvatarUrl,
            nationality: player.nationality || 'URU',
            birthDate: player.birthDate ? new Date(player.birthDate) : undefined,
            height: player.height || undefined,
            weight: player.weight || undefined,
        },
    });
    
    useEffect(() => {
        if (isOpen) {
             const defaultAvatar = player.avatarUrl || (player.team ? `/equipos/jugadores_individuales/avatar_${player.team.slug}.png` : '');
            form.reset({
                name: player.name,
                number: player.number,
                position: player.position,
                teamId: String(player.teamId),
                avatarUrl: defaultAvatar,
                nationality: player.nationality || 'URU',
                birthDate: player.birthDate ? new Date(player.birthDate) : undefined,
                height: player.height || undefined,
                weight: player.weight || undefined,
            })
        }
    }, [isOpen, player, form]);

    async function onSubmit(values: EditPlayerFormValues) {
        setIsSubmitting(true)
        try {
            await updatePlayer(player.id, values);
            toast({
                title: "Jugador Actualizado",
                description: `El jugador ${values.name} ha sido actualizado exitosamente.`,
            })
            onClose();
            router.refresh()
        } catch(error) {
             const errorMessage = error instanceof Error ? error.message : "No se pudo actualizar el jugador.";
             toast({
                variant: "destructive",
                title: "Error al actualizar",
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-lg">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle>Editar Jugador: {player.name}</SheetTitle>
                    <SheetDescription>
                        Realiza cambios en la información del jugador. Haz clic en guardar cuando termines.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-grow">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </form>
                    </Form>
                </ScrollArea>
                <SheetFooter className="p-6 mt-auto border-t">
                    <SheetClose asChild>
                        <Button type="button" variant="outline">Cancelar</Button>
                    </SheetClose>
                     <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
