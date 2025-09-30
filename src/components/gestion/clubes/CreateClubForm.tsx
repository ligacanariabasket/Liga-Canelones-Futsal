
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { createClub } from "@/actions/club-actions"

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const createClubSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  logoUrl: z.string().optional().or(z.literal('')),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  bannerUrl: z.string().optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  facebook: z.string().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  phone: z.string().optional(),
});

type CreateClubFormValues = z.infer<typeof createClubSchema>

export function CreateClubForm() {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreateClubFormValues>({
        resolver: zodResolver(createClubSchema),
        defaultValues: {
            name: '',
            logoUrl: '',
            slug: '',
            description: '',
            bannerUrl: '',
            instagram: '',
            facebook: '',
            whatsapp: '',
            phone: '',
        },
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue('name', name);
        form.setValue('slug', slugify(name));
    }
    
    async function onSubmit(values: CreateClubFormValues) {
        setIsSubmitting(true)
        try {
            await createClub(values);
            toast({
                title: "Club Creado",
                description: `El club ${values.name} ha sido creado exitosamente.`,
            })
            form.reset()
            router.refresh()
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "No se pudo crear el club.";
             toast({
                variant: "destructive",
                title: "Error al crear club",
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
                            <FormLabel>Nombre del Club</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Futsaleros FC" {...field} onChange={handleNameChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="ej: futsaleros-fc" {...field} />
                            </FormControl>
                             <FormDescription>
                                Se utiliza para la URL. Se genera automáticamente.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL del Logo</FormLabel>
                             <FormControl>
                                <Input placeholder="/equipos/logo.png" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bannerUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL del Banner</FormLabel>
                             <FormControl>
                                <Input placeholder="/banners/equipo.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                             <FormControl>
                                <Textarea placeholder="Una breve descripción del club..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instagram</FormLabel>
                             <FormControl>
                                <Input placeholder="URL del perfil de Instagram" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Facebook</FormLabel>
                             <FormControl>
                                <Input placeholder="URL del perfil de Facebook" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                             <FormControl>
                                <Input placeholder="Número de WhatsApp" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teléfono de Contacto</FormLabel>
                             <FormControl>
                                <Input placeholder="Número de teléfono" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Creando...' : 'Crear Club'}
                </Button>
            </form>
        </Form>
    )
}
