
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSeason } from "@/actions/season-actions"

const createSeasonSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  year: z.coerce.number().min(2023, "El año debe ser 2023 o posterior"),
});

type CreateSeasonFormValues = z.infer<typeof createSeasonSchema>

export function CreateSeasonForm() {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreateSeasonFormValues>({
        resolver: zodResolver(createSeasonSchema),
        defaultValues: {
            name: '',
            year: new Date().getFullYear(),
        },
    });
    
    async function onSubmit(values: CreateSeasonFormValues) {
        setIsSubmitting(true)
        try {
            await createSeason(values.name, values.year)
            toast({
                title: "Temporada Creada",
                description: `La temporada ${values.name} ha sido creada exitosamente.`,
            })
            form.reset()
            router.refresh()
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "No se pudo crear la temporada. Por favor, intente de nuevo.";
             toast({
                variant: "destructive",
                title: "Error al crear temporada",
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de la Temporada</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Temporada Apertura" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                         <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Año</FormLabel>
                                     <FormControl>
                                        <Input type="number" placeholder="Ej: 2024" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Creando...' : 'Crear Temporada'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
