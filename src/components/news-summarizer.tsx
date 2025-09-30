"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { summarizeArticleAction } from "@/app/actions";
import { Skeleton } from "./ui/skeleton";

const FormSchema = z.object({
  url: z.string().url({ message: "Por favor, introduce una URL válida." }),
});

export function NewsSummarizer() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSummarizing(true);
    setSummary(null);
    try {
      const result = await summarizeArticleAction(data);
      if ("summary" in result && result.summary) {
        setSummary(result.summary);
      } else {
        throw new Error("No se pudo generar el resumen.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Hubo un problema al resumir el artículo. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Resumidor de Noticias con IA
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            ¿No tienes tiempo para leer un artículo completo? Pega la URL a
            continuación y deja que nuestra IA te dé un resumen rápido.
          </p>
        </div>

        <Card className="mx-auto mt-8 max-w-2xl">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del Artículo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://ejemplo.com/noticia"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSummarizing}
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resumiendo...
                    </>
                  ) : (
                    "Generar Resumen"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isSummarizing || summary) && (
          <Card className="mx-auto mt-8 max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <BookText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Resumen del Artículo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isSummarizing ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : (
                <p className="leading-relaxed text-foreground/90">{summary}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
