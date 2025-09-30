
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
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Team } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateClub } from "@/actions/club-actions"

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const editClubSchema = z.object({
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


type EditClubFormValues = z.infer<typeof editClubSchema>

interface EditClubSheetProps {
    team: Team;
    isOpen: boolean;
    onClose: () => void;
}

export function EditClubSheet({ team, isOpen, onClose }: EditClubSheetProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<EditClubFormValues>({
        resolver: zodResolver(editClubSchema),
        defaultValues: {
            name: team.name,
            logoUrl: team.logoUrl || '',
            slug: team.slug,
            description: team.description || '',
            bannerUrl: team.bannerUrl || '',
            instagram: team.instagram || '',
            facebook: team.facebook || '',
            whatsapp: team.whatsapp || '',
            phone: team.phone || '',
        },
    });
    
    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: team.name,
                logoUrl: team.logoUrl || '',
                slug: team.slug,
                description: team.description || '',
                bannerUrl: team.bannerUrl || '',
                instagram: team.instagram || '',
                facebook: team.facebook || '',
                whatsapp: team.whatsapp || '',
                phone: team.phone || '',
            })
        }
    }, [isOpen, team, form]);


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue('name', name);
        form.setValue('slug', slugify(name));
    }
    
    async function onSubmit(values: EditClubFormValues) {
        setIsSubmitting(true)
        try {
            await updateClub(team.id, values);
            toast({
                title: "Club Actualizado",
                description: `El club ${values.name} ha sido actualizado exitosamente.`,
            })
            onClose();
            router.refresh()
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "No se pudo actualizar el club.";
             toast({
                variant: "destructive",
                title: "Error al actualizar club",
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex flex-col gap-0 p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle>Editar Club: {team.name}</SheetTitle>
                    <SheetDescription>
                        Realiza cambios en la información del club. Haz clic en guardar cuando termines.
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
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Teléfono de contacto" {...field} />
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
